import type { ActionState, TableEvent } from "./types";
import type { Collider, RigidBody, World } from "@dimforge/rapier3d-compat";
import {
  silverballSocialBlueprint,
  type FlipperDevice,
  type PlasticStandoff,
  type RampCrossBrace,
  type RampPath,
  type RampSideWall,
  type Segment,
  type SaucerDevice,
  type SensorZone,
  type SlingDevice,
  type WireformPath
} from "./tableBlueprint";

type RapierModule = typeof import("@dimforge/rapier3d-compat");

interface FlipperBodies {
  left: RigidBody;
  right: RigidBody;
}

interface OneWayGate {
  collider: Collider;
}

interface TableColliderBodies {
  flippers: FlipperBodies;
  gates: OneWayGate[];
}

export interface BallSnapshot {
  x: number;
  y: number;
  z: number;
}

export interface PhysicsSnapshot {
  ball: BallSnapshot;
  saucerHold: { id: string; x: number; z: number } | null;
  leftFlipperAngle: number;
  rightFlipperAngle: number;
  plungerCharge: number;
  events: TableEvent[];
}

const blueprint = silverballSocialBlueprint;

export const targetBankColliderSegments = (
  targets = blueprint.targets,
  targetBank = blueprint.targetBank
): Segment[] => [
  ...targetBank.frameSegments.filter(
    (segment) => segment.id !== "target-bank.frame-bottom-rail"
  ),
  targetBank.switchRail,
  ...targets.flatMap((target) => [
    target.mountPlate,
    target.rearStop,
    ...target.switchBlades
  ])
];

export const rampSideWallColliderSegments = (
  ramps = blueprint.ramps
): RampSideWall[] => ramps.flatMap((ramp) => ramp.sideWalls);

export const rampCrossBraceColliderSegments = (
  ramps = blueprint.ramps
): RampCrossBrace[] => ramps.flatMap((ramp) => ramp.crossBraces);

export const plasticStandoffColliderPosts = (
  plastics = blueprint.plastics
): PlasticStandoff[] => plastics.flatMap((cover) => cover.standoffs);

export const saucerCupRimColliderSegments = (
  saucers = blueprint.saucers
): Segment[] => saucers.flatMap((saucer) => {
  const radius = saucer.cup.outerRadius;
  const thickness = Math.max(saucer.cup.outerRadius - saucer.cup.innerRadius, 0.08);
  const segmentAngles = [-2.38, -1.62, -0.86, 0.86, 1.62, 2.38];
  const chordWidth = radius * 0.52;

  return segmentAngles.map((angle, index) => ({
    id: `${saucer.cup.id}.rim-${index + 1}`,
    x: saucer.x + Math.sin(angle) * radius,
    z: saucer.z - Math.cos(angle) * radius,
    width: chordWidth,
    depth: thickness,
    angle,
    kind: "metal" as const
  }));
});

export class PinballPhysics {
  private readonly rapier: RapierModule;
  private readonly world: World;
  private readonly ball: RigidBody;
  private readonly flipperBodies: FlipperBodies;
  private readonly gates: OneWayGate[];
  private readonly cooldowns = new Map<string, number>();
  private accumulator = 0;
  private plungerCharge = 0;
  private nudgeHeat = 0;
  private launched = false;
  private launchedSeconds: number | null = null;
  private lowSpeedSeconds = 0;
  private saucerHoldSeconds = 0;
  private saucerHeldBy: SaucerDevice | null = null;
  private saucerHoldEventPending = false;
  private leftFlipperAngle: number;
  private rightFlipperAngle: number;

  private static readonly SUBSTEP = 1 / 180;
  private static readonly FLIP_SPEED = 28;
  private static readonly FLIP_RETURN_SPEED = 14;

  private constructor(rapier: RapierModule, world: World, ball: RigidBody, tableBodies: TableColliderBodies) {
    this.rapier = rapier;
    this.world = world;
    this.ball = ball;
    this.flipperBodies = tableBodies.flippers;
    this.gates = tableBodies.gates;
    this.leftFlipperAngle = blueprint.flippers.find((item) => item.side === "left")?.restAngle ?? 0;
    this.rightFlipperAngle = blueprint.flippers.find((item) => item.side === "right")?.restAngle ?? 0;
  }

  static async create(): Promise<PinballPhysics> {
    const rapier = await import("@dimforge/rapier3d-compat");
    await rapier.init();

    const world = new rapier.World(blueprint.playfield.gravity);
    world.timestep = PinballPhysics.SUBSTEP;
    const ballBody = world.createRigidBody(
      rapier.RigidBodyDesc.dynamic()
        .setTranslation(3.27, 0.35, 5.55)
        .setLinearDamping(0.08)
        .setAngularDamping(0.1)
        .setCcdEnabled(true)
        .setCanSleep(false)
    );
    world.createCollider(
      rapier.ColliderDesc.ball(blueprint.scale.ballRadius).setRestitution(0.78).setFriction(0.08),
      ballBody
    );

    const tableBodies = createTableColliders(rapier, world);
    return new PinballPhysics(rapier, world, ballBody, tableBodies);
  }

  resetBall(): void {
    this.launched = false;
    this.plungerCharge = 0;
    this.nudgeHeat = 0;
    this.cooldowns.clear();
    this.launchedSeconds = null;
    this.lowSpeedSeconds = 0;
    this.saucerHeldBy = null;
    this.saucerHoldSeconds = 0;
    this.saucerHoldEventPending = false;
    this.ball.setTranslation({ x: 3.27, y: 0.35, z: 5.55 }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  placeBall(x: number, z: number, velocityX: number, velocityZ: number): void {
    this.launched = true;
    this.launchedSeconds = 10;
    this.lowSpeedSeconds = 0;
    this.saucerHeldBy = null;
    this.ball.setTranslation({
      x,
      y: blueprint.playfield.surfaceY + blueprint.scale.ballRadius + 0.02,
      z
    }, true);
    this.ball.setLinvel({ x: velocityX, y: 0, z: velocityZ }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  step(actions: ActionState, dt: number, scoringEnabled: boolean): PhysicsSnapshot {
    const events: TableEvent[] = [];
    this.accumulator += Math.min(dt, 0.05);
    this.tickSaucerHold(dt, events, scoringEnabled);
    this.tickInput(actions, dt, events, scoringEnabled);
    if (scoringEnabled && this.launchedSeconds !== null) {
      this.launchedSeconds += dt;
    }

    while (this.accumulator >= PinballPhysics.SUBSTEP) {
      this.advanceFlipperAngles(actions);
      this.updateFlipperBodies(this.leftFlipperAngle, this.rightFlipperAngle);
      this.updateOneWayGates();
      this.world.step();
      this.accumulator -= PinballPhysics.SUBSTEP;
    }

    this.clampBallSpeed();
    this.containEscapedBall();
    this.recoverLowSpeedBall(dt);
    this.detectDeviceHits(events, scoringEnabled);

    let pos = this.ball.translation();
    if (this.isInsideDrain(pos.x, pos.z)) {
      events.push({ type: "drain", quick: this.isQuickDrain() });
      this.resetBall();
      pos = this.ball.translation();
    }

    this.cooldowns.forEach((value, key) => {
      const next = value - dt;
      if (next <= 0) {
        this.cooldowns.delete(key);
      } else {
        this.cooldowns.set(key, next);
      }
    });

    this.nudgeHeat = Math.max(0, this.nudgeHeat - dt * 0.8);

    return {
      ball: { x: pos.x, y: pos.y, z: pos.z },
      saucerHold: this.saucerHeldBy
        ? { id: this.saucerHeldBy.id, x: this.saucerHeldBy.holdX, z: this.saucerHeldBy.holdZ }
        : null,
      leftFlipperAngle: this.leftFlipperAngle,
      rightFlipperAngle: this.rightFlipperAngle,
      plungerCharge: this.plungerCharge,
      events
    };
  }

  private updateOneWayGates(): void {
    const vel = this.ball.linvel();
    const flapOpen = vel.z < -0.6;
    for (const gate of this.gates) {
      gate.collider.setEnabled(!flapOpen);
    }
  }

  private advanceFlipperAngles(actions: ActionState): void {
    const leftFlipper = blueprint.flippers.find((item) => item.side === "left");
    const rightFlipper = blueprint.flippers.find((item) => item.side === "right");
    if (leftFlipper) {
      this.leftFlipperAngle = PinballPhysics.sweepToward(this.leftFlipperAngle, leftFlipper, actions.leftFlipper);
    }
    if (rightFlipper) {
      this.rightFlipperAngle = PinballPhysics.sweepToward(this.rightFlipperAngle, rightFlipper, actions.rightFlipper);
    }
  }

  private static sweepToward(current: number, flipper: FlipperDevice, active: boolean): number {
    const target = active ? flipper.activeAngle : flipper.restAngle;
    const speed = active ? PinballPhysics.FLIP_SPEED : PinballPhysics.FLIP_RETURN_SPEED;
    const maxDelta = speed * PinballPhysics.SUBSTEP;
    const delta = target - current;
    if (Math.abs(delta) <= maxDelta) {
      return target;
    }
    return current + Math.sign(delta) * maxDelta;
  }

  private updateFlipperBodies(leftFlipperAngle: number, rightFlipperAngle: number): void {
    const leftFlipper = blueprint.flippers.find((item) => item.side === "left");
    const rightFlipper = blueprint.flippers.find((item) => item.side === "right");
    if (leftFlipper) {
      this.setFlipperBodyPose(this.flipperBodies.left, leftFlipper, leftFlipperAngle);
    }
    if (rightFlipper) {
      this.setFlipperBodyPose(this.flipperBodies.right, rightFlipper, rightFlipperAngle);
    }
  }

  private setFlipperBodyPose(body: RigidBody, flipper: FlipperDevice, angle: number): void {
    body.setNextKinematicTranslation({ x: flipper.x, y: 0.25, z: flipper.z });
    body.setNextKinematicRotation(createFlipperRotation(flipper, angle));
  }

  private tickInput(
    actions: ActionState,
    dt: number,
    events: TableEvent[],
    scoringEnabled: boolean
  ): void {
    const pos = this.ball.translation();
    const vel = this.ball.linvel();
    const ballSpeed = Math.hypot(vel.x, vel.y, vel.z);
    const inShooterLane = pos.x > 3.05 && pos.z > 4.55 && ballSpeed < 1.2;

    if (actions.plunger && inShooterLane) {
      this.plungerCharge = Math.min(1, this.plungerCharge + dt * 0.85);
      this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (!actions.plunger && this.plungerCharge > 0 && pos.x > 3.05 && pos.z > 4.55) {
      const launchSpeed = 12 + this.plungerCharge * 14;
      this.ball.applyImpulse({ x: 0, y: 0, z: -launchSpeed * this.ball.mass() }, true);
      this.plungerCharge = 0;
      this.launched = true;
      this.launchedSeconds = 0;
      events.push({ type: "launch" });
    }

    if (!scoringEnabled) {
      return;
    }

    if (actions.nudgeLeft || actions.nudgeRight || actions.nudgeUp) {
      this.nudgeHeat += dt * 5.5;
      if (!this.cooldowns.has("nudge")) {
        const nudgeKick = 2 * this.ball.mass();
        const x = actions.nudgeLeft ? -nudgeKick : actions.nudgeRight ? nudgeKick : 0;
        const z = actions.nudgeUp ? -nudgeKick : 0;
        this.ball.applyImpulse({ x, y: 0, z }, true);
        this.cooldowns.set("nudge", 0.25);
        if (this.nudgeHeat > 3.6) {
          events.push({ type: "tilt" });
        } else if (this.nudgeHeat > 2.2) {
          events.push({ type: "tiltWarning" });
        }
      }
    }
  }

  private detectDeviceHits(events: TableEvent[], scoringEnabled: boolean): void {
    if (!scoringEnabled) {
      return;
    }

    const pos = this.ball.translation();
    const ballMass = this.ball.mass();

    for (const bumper of blueprint.bumpers) {
      const contactRadius = bumper.skirtRadius + blueprint.scale.ballRadius + 0.02;
      if (this.isNear(pos.x, pos.z, bumper.x, bumper.z, contactRadius, `bumper-${bumper.id}`, 0.35)) {
        const dx = pos.x - bumper.x;
        const dz = pos.z - bumper.z;
        const length = Math.max(Math.hypot(dx, dz), 0.001);
        this.ball.applyImpulse({
          x: (dx / length) * 8 * ballMass,
          y: 0,
          z: (dz / length) * 8 * ballMass
        }, true);
        events.push({ type: "bumper", id: bumper.id });
      }
    }

    for (const target of blueprint.targets) {
      if (this.isNear(pos.x, pos.z, target.x, target.z, target.radius, `target-${target.id}`, 1.2)) {
        events.push({ type: "target", id: target.id });
      }
    }

    for (const sling of blueprint.slings) {
      const cooldownKey = `sling-${sling.side}`;
      if (!this.cooldowns.has(cooldownKey) && this.isTouchingSlingFace(pos.x, pos.z, sling)) {
        this.cooldowns.set(cooldownKey, 0.25);
        this.ball.applyImpulse({
          x: sling.impulseNormalX * 7 * ballMass,
          y: 0,
          z: sling.impulseNormalZ * 7 * ballMass
        }, true);
        events.push({ type: "sling", side: sling.side });
      }
    }

    for (const lane of blueprint.lanes) {
      const cooldownKey = this.laneCooldownKey(lane.id);
      const isSkillShotEligible = lane.id === "lane.shooter.skill" && this.skillShotEligible(lane.id);
      if (this.isNear(pos.x, pos.z, lane.x, lane.z, lane.radius, cooldownKey, 1.2)) {
        if (isSkillShotEligible) {
          events.push({ type: "skillShot" });
        } else {
          events.push({ type: "lane", id: lane.id });
        }
      }
    }

    for (const saucer of blueprint.saucers) {
      if (this.isNear(pos.x, pos.z, saucer.x, saucer.z, saucer.radius, `saucer-${saucer.id}`, 1.5)) {
        this.captureSaucer(saucer);
        events.push({ type: "lockEnter", id: saucer.id });
      }
    }

    for (const ramp of blueprint.ramps) {
      if (this.isNearZone(pos.x, pos.z, ramp.entry, `ramp-entry-${ramp.id}`, 0.8)) {
        events.push({ type: "rampEnter", id: ramp.id });
      }
      if (this.isNearZone(pos.x, pos.z, ramp.exit, `ramp-exit-${ramp.id}`, 0.8)) {
        events.push({ type: "rampMade", id: ramp.id });
      }
    }

    for (const orbit of blueprint.orbits) {
      if (this.isNearZone(pos.x, pos.z, orbit.entry, `orbit-entry-${orbit.id}`, 0.75)) {
        events.push({ type: "orbitMade", id: orbit.id });
      }
      if (this.isNearZone(pos.x, pos.z, orbit.exit, `orbit-exit-${orbit.id}`, 0.75)) {
        events.push({ type: "lane", id: orbit.exit.id });
      }
    }

    for (const wireform of blueprint.wireforms) {
      if (this.isNearZone(pos.x, pos.z, wireform.exit, `wireform-exit-${wireform.id}`, 1.0)) {
        events.push({ type: wireform.id.includes("orbit") ? "orbitMade" : "lane", id: wireform.id });
      }
    }

  }

  private isTouchingSlingFace(x: number, z: number, sling: SlingDevice): boolean {
    const face = sling.rubberFace;
    const angle = face.angle ?? 0;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - face.x;
    const dz = z - face.z;
    const localX = dx * cos - dz * sin;
    const localZ = dx * sin + dz * cos;
    const clampedX = Math.min(Math.max(localX, -face.width / 2), face.width / 2);
    const clampedZ = Math.min(Math.max(localZ, -face.depth / 2), face.depth / 2);
    const distance = Math.hypot(localX - clampedX, localZ - clampedZ);
    return distance <= blueprint.scale.ballRadius + 0.06;
  }

  private isNear(
    x: number,
    z: number,
    cx: number,
    cz: number,
    radius: number,
    cooldownKey: string,
    cooldownSeconds: number
  ): boolean {
    if (this.cooldowns.has(cooldownKey)) {
      return false;
    }

    const isInside = (x - cx) ** 2 + (z - cz) ** 2 < radius ** 2;
    if (isInside) {
      this.cooldowns.set(cooldownKey, cooldownSeconds);
    }

    return isInside;
  }

  private captureSaucer(saucer: SaucerDevice): void {
    this.saucerHeldBy = saucer;
    this.saucerHoldSeconds = 0.36;
    this.saucerHoldEventPending = true;
    this.ball.setTranslation({ x: saucer.holdX, y: 0.32, z: saucer.holdZ }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  private tickSaucerHold(dt: number, events: TableEvent[], scoringEnabled: boolean): void {
    if (!this.saucerHeldBy) {
      return;
    }

    const saucer = this.saucerHeldBy;
    if (scoringEnabled && this.saucerHoldEventPending) {
      events.push({ type: "lockHeld", id: saucer.id });
    }
    this.saucerHoldEventPending = false;
    this.ball.setTranslation({ x: saucer.holdX, y: 0.32, z: saucer.holdZ }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.saucerHoldSeconds -= dt;

    if (this.saucerHoldSeconds > 0) {
      return;
    }

    const dx = saucer.ejectX - saucer.holdX;
    const dz = saucer.ejectZ - saucer.holdZ;
    const length = Math.max(Math.hypot(dx, dz), 0.001);
    this.saucerHeldBy = null;
    if (scoringEnabled) {
      events.push({ type: "lockEject", id: saucer.id });
    }
    this.ball.applyImpulse({
      x: dx / length * saucer.ejectStrength * this.ball.mass(),
      y: 0,
      z: dz / length * saucer.ejectStrength * this.ball.mass()
    }, true);
  }

  private isNearZone(
    x: number,
    z: number,
    zone: SensorZone,
    cooldownKey: string,
    cooldownSeconds: number
  ): boolean {
    return this.isNear(x, z, zone.x, zone.z, zone.radius, cooldownKey, cooldownSeconds);
  }

  private skillShotEligible(laneId: string): boolean {
    return this.launched && !this.cooldowns.has(this.laneCooldownKey(laneId));
  }

  private laneCooldownKey(laneId: string): string {
    return `lane-${laneId}`;
  }

  private isInsideDrain(x: number, z: number): boolean {
    const drain = blueprint.drain;
    return (x - drain.x) ** 2 + (z - drain.z) ** 2 < drain.radius ** 2 || z > drain.troughZ;
  }

  private isQuickDrain(): boolean {
    return this.launchedSeconds !== null && this.launchedSeconds <= 6;
  }

  private clampBallSpeed(): void {
    const vel = this.ball.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed > 26) {
      const scale = 26 / speed;
      this.ball.setLinvel({ x: vel.x * scale, y: vel.y * scale, z: vel.z * scale }, true);
    }
  }

  private containEscapedBall(): void {
    const pos = this.ball.translation();
    const halfWidth = blueprint.playfield.width / 2;
    const halfDepth = blueprint.playfield.depth / 2;
    const escaped =
      pos.y < -0.35 ||
      pos.y > blueprint.cabinet.glassPanel.y + 0.45 ||
      Math.abs(pos.x) > halfWidth + 0.4 ||
      pos.z < -(halfDepth + 0.4) ||
      pos.z > halfDepth + 0.9;

    if (!escaped) {
      return;
    }

    this.ball.setTranslation({
      x: Math.min(Math.max(pos.x, -3.5), 3.5),
      y: blueprint.playfield.surfaceY + blueprint.scale.ballRadius + 0.04,
      z: Math.min(Math.max(pos.z, -6.6), 6.8)
    }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  private recoverLowSpeedBall(dt: number): void {
    if (!this.launched || this.launchedSeconds === null || this.launchedSeconds < 1 || this.saucerHeldBy) {
      this.lowSpeedSeconds = 0;
      return;
    }

    const pos = this.ball.translation();
    if (pos.y > 0.75) {
      this.lowSpeedSeconds = 0;
      return;
    }

    const vel = this.ball.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed > 0.18) {
      this.lowSpeedSeconds = 0;
      return;
    }

    this.lowSpeedSeconds += dt;
    if (this.lowSpeedSeconds < 0.9) {
      return;
    }

    if (pos.z > 5.25 && Math.abs(pos.x) < 1.75) {
      this.lowSpeedSeconds = 0;
      return;
    }

    if (pos.x > 3.05 && pos.z > 4.55) {
      this.lowSpeedSeconds = 0;
      return;
    }

    this.lowSpeedSeconds = 0;
    this.ball.setTranslation({
      x: pos.x * 0.72,
      y: blueprint.playfield.surfaceY + blueprint.scale.ballRadius + 0.04,
      z: Math.min(pos.z + 0.28, blueprint.drain.troughZ - 0.35)
    }, true);
    this.ball.setLinvel({
      x: -pos.x * 1.1 + blueprint.playfield.gravity.x * 0.04,
      y: vel.y,
      z: Math.max(2.2, blueprint.playfield.gravity.z * 0.24)
    }, true);
  }
}

const createYawPitchRotation = (yaw: number, pitch = 0) => {
  const yawRotation = {
    x: 0,
    y: Math.sin(yaw / 2),
    z: 0,
    w: Math.cos(yaw / 2)
  };
  const pitchRotation = {
    x: Math.sin(pitch / 2),
    y: 0,
    z: 0,
    w: Math.cos(pitch / 2)
  };

  return {
    w: pitchRotation.w * yawRotation.w - pitchRotation.x * yawRotation.x - pitchRotation.y * yawRotation.y - pitchRotation.z * yawRotation.z,
    x: pitchRotation.w * yawRotation.x + pitchRotation.x * yawRotation.w + pitchRotation.y * yawRotation.z - pitchRotation.z * yawRotation.y,
    y: pitchRotation.w * yawRotation.y - pitchRotation.x * yawRotation.z + pitchRotation.y * yawRotation.w + pitchRotation.z * yawRotation.x,
    z: pitchRotation.w * yawRotation.z + pitchRotation.x * yawRotation.y - pitchRotation.y * yawRotation.x + pitchRotation.z * yawRotation.w
  };
};

const createFlipperRotation = (flipper: FlipperDevice, angle: number) => {
  return createYawPitchRotation(flipper.side === "left" ? angle : Math.PI + angle);
};

const createTableColliders = (rapier: RapierModule, world: World): TableColliderBodies => {
  const addBoxCollider = (
    x: number,
    y: number,
    z: number,
    hx: number,
    hy: number,
    hz: number,
    angle = 0,
    pitch = 0,
    restitution = 0.62
  ) => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.fixed()
        .setTranslation(x, y, z)
        .setRotation(createYawPitchRotation(angle, pitch))
    );
    world.createCollider(
      rapier.ColliderDesc.cuboid(hx, hy, hz).setRestitution(restitution).setFriction(0.1),
      body
    );
  };

  const addWall = (x: number, z: number, hx: number, hz: number, angle = 0, restitution = 0.62) => {
    addBoxCollider(x, 0.16, z, hx, 0.32, hz, angle, 0, restitution);
  };

  const addPlayfieldDeck = () => {
    const deck = blueprint.playfield;
    addBoxCollider(
      deck.x,
      deck.surfaceY - deck.thickness / 2,
      deck.z,
      deck.width / 2,
      deck.thickness / 2,
      deck.depth / 2,
      0,
      0,
      0.18
    );
  };

  const addSegment = (segment: Segment) => {
    const bounce = segment.kind === "rubber" ? 0.86 : 0.62;
    addWall(
      segment.x,
      segment.z,
      segment.width / 2,
      segment.depth / 2,
      segment.angle ?? 0,
      bounce
    );
  };

  const addOneWayGate = (segment: Segment): OneWayGate => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.fixed()
        .setTranslation(segment.x, 0.16, segment.z)
        .setRotation(createYawPitchRotation(segment.angle ?? 0))
    );
    const collider = world.createCollider(
      rapier.ColliderDesc.cuboid(segment.width / 2, 0.32, segment.depth / 2)
        .setRestitution(0.3)
        .setFriction(0.1),
      body
    );
    return { collider };
  };

  const addPost = (x: number, z: number, radius: number, restitution = 0.82) => {
    const body = world.createRigidBody(rapier.RigidBodyDesc.fixed().setTranslation(x, 0.2, z));
    world.createCollider(
      rapier.ColliderDesc.cylinder(0.34, radius).setRestitution(restitution).setFriction(0.12),
      body
    );
  };

  const addRamp = (ramp: RampPath) => {
    const rise = ramp.endY - ramp.startY;
    const pitch = Math.atan2(rise, ramp.depth);
    const slopedDepth = Math.hypot(ramp.depth, rise);
    const centerY = (ramp.startY + ramp.endY) / 2;
    addBoxCollider(
      ramp.x,
      centerY,
      ramp.z,
      ramp.width / 2,
      ramp.floorThickness / 2,
      slopedDepth / 2,
      ramp.angle,
      pitch,
      0.5
    );

    for (const wall of rampSideWallColliderSegments([ramp])) {
      addBoxCollider(
        wall.x,
        (wall.startY + wall.endY) / 2,
        wall.z,
        wall.width / 2,
        wall.height / 2,
        wall.depth / 2,
        wall.angle,
        wall.pitch,
        0.56
      );
    }

    for (const brace of rampCrossBraceColliderSegments([ramp])) {
      addBoxCollider(
        brace.x,
        brace.y,
        brace.z,
        brace.width / 2,
        0.02,
        brace.depth / 2,
        brace.angle ?? 0,
        brace.pitch,
        0.62
      );
    }

    for (const rail of ramp.sideRails) {
      addBoxCollider(
        rail.x,
        (rail.startY + rail.endY) / 2,
        rail.z,
        rail.width / 2,
        rail.height / 2,
        rail.depth / 2,
        rail.angle,
        rail.pitch,
        0.68
      );
    }

    const lipY = ramp.startY + 0.12;
    addBoxCollider(
      ramp.entranceLip.x,
      lipY,
      ramp.entranceLip.z,
      ramp.entranceLip.width / 2,
      0.2,
      ramp.entranceLip.depth / 2,
      ramp.entranceLip.angle ?? 0,
      0,
      0.62
    );
    for (const support of ramp.supports) {
      const body = world.createRigidBody(rapier.RigidBodyDesc.fixed().setTranslation(support.x, support.height / 2, support.z));
      world.createCollider(
        rapier.ColliderDesc.cylinder(support.height / 2, support.radius).setRestitution(0.58).setFriction(0.22),
        body
      );
    }
  };

  const addWireform = (wireform: WireformPath) => {
    for (const rail of wireform.rails) {
      addBoxCollider(
        rail.x,
        rail.y,
        rail.z,
        rail.width / 2,
        rail.height / 2,
        rail.depth / 2,
        rail.angle ?? 0,
        0,
        0.7
      );
    }

    for (const tie of wireform.ties) {
      addBoxCollider(
        tie.x,
        wireform.railY,
        tie.z,
        tie.width / 2,
        0.025,
        tie.depth / 2,
        tie.angle ?? 0,
        0,
        0.62
      );
    }

    for (const support of wireform.supports) {
      const body = world.createRigidBody(
        rapier.RigidBodyDesc.fixed().setTranslation(support.x, support.height / 2, support.z)
      );
      world.createCollider(
        rapier.ColliderDesc.cylinder(support.height / 2, support.radius).setRestitution(0.58).setFriction(0.22),
        body
      );
    }
  };

  const addPlasticStandoff = (standoff: PlasticStandoff) => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.fixed().setTranslation(standoff.x, standoff.height / 2, standoff.z)
    );
    world.createCollider(
      rapier.ColliderDesc.cylinder(standoff.height / 2, standoff.radius).setRestitution(0.58).setFriction(0.22),
      body
    );
  };

  const addCabinetContainment = () => {
    const glass = blueprint.cabinet.glassPanel;
    const deck = blueprint.playfield;
    const halfWidth = deck.width / 2;
    const halfDepth = deck.depth / 2;
    const wallHalfHeight = (glass.y + 0.2) / 2;

    addBoxCollider(glass.x, glass.y + 0.05, glass.z, halfWidth + 0.3, 0.06, glass.depth / 2 + 0.3, 0, 0, 0.05);
    addBoxCollider(-(halfWidth + 0.08), wallHalfHeight, deck.z, 0.08, wallHalfHeight, halfDepth + 0.5, 0, 0, 0.3);
    addBoxCollider(halfWidth + 0.08, wallHalfHeight, deck.z, 0.08, wallHalfHeight, halfDepth + 0.5, 0, 0, 0.3);
    addBoxCollider(deck.x, wallHalfHeight, -(halfDepth + 0.08), halfWidth + 0.5, wallHalfHeight, 0.08, 0, 0, 0.3);
    addBoxCollider(deck.x, wallHalfHeight, halfDepth + 0.45, halfWidth + 0.5, wallHalfHeight, 0.08, 0, 0, 0.3);
  };

  const addFlipper = (flipper: FlipperDevice) => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(flipper.x, 0.25, flipper.z)
        .setRotation(createFlipperRotation(flipper, flipper.restAngle))
    );
    const straightLength = Math.max(flipper.length - flipper.batRadius * 2, 0.1);
    const centerX = flipper.batRadius + straightLength / 2;
    const tipX = flipper.length - flipper.batRadius;
    world.createCollider(
      rapier.ColliderDesc.cuboid(straightLength / 2, flipper.rubberWidth, flipper.batRadius * 0.62)
        .setTranslation(centerX, 0, 0)
        .setRestitution(0.88)
        .setFriction(0.12),
      body
    );
    world.createCollider(
      rapier.ColliderDesc.ball(flipper.batRadius)
        .setTranslation(flipper.batRadius, 0, 0)
        .setRestitution(0.88)
        .setFriction(0.12),
      body
    );
    world.createCollider(
      rapier.ColliderDesc.ball(flipper.batRadius)
        .setTranslation(tipX, 0, 0)
        .setRestitution(0.9)
        .setFriction(0.1),
      body
    );
    world.createCollider(
      rapier.ColliderDesc.cylinder(0.18, flipper.pivotRadius)
        .setRestitution(0.72)
        .setFriction(0.18),
      body
    );
    return body;
  };

  addPlayfieldDeck();
  addCabinetContainment();
  blueprint.boundaries.forEach(addSegment);
  blueprint.laneWalls.forEach(addSegment);
  blueprint.rubberBands.forEach(addSegment);
  blueprint.drain.drainGuides.forEach(addSegment);
  blueprint.drain.trough.walls.forEach(addSegment);
  addSegment(blueprint.drain.trough.feedGuide);
  blueprint.flipperStops
    .filter((stop) => !stop.id.includes("return-stop"))
    .forEach(addSegment);
  blueprint.slings.forEach((sling) => addSegment(sling.rubberFace));
  blueprint.plunger.lowerGuides.forEach(addSegment);
  const gates = [
    addOneWayGate(blueprint.plunger.gate),
    addOneWayGate(blueprint.plunger.corridorGate)
  ];
  addPost(blueprint.plunger.gateHingePost.x, blueprint.plunger.gateHingePost.z, blueprint.plunger.gateHingePost.radius, 0.58);
  addPost(blueprint.plunger.gateStopPost.x, blueprint.plunger.gateStopPost.z, blueprint.plunger.gateStopPost.radius, 0.58);
  plasticStandoffColliderPosts().forEach(addPlasticStandoff);
  blueprint.ramps.forEach(addRamp);
  blueprint.handoffs
    .flatMap((handoff) => handoff.segments)
    .forEach(addSegment);
  blueprint.handoffs
    .flatMap((handoff) => handoff.posts ?? [])
    .forEach((post) => addPost(post.x, post.z, post.radius, post.kind === "rubber" ? 0.82 : 0.68));
  blueprint.wireforms.forEach(addWireform);
  blueprint.posts.forEach((post) => addPost(post.x, post.z, post.radius));
  blueprint.bumpers.forEach((bumper) => {
    addPost(bumper.x, bumper.z, bumper.skirtRadius, 0.92);
    bumper.guardSegments.forEach(addSegment);
  });
  targetBankColliderSegments().forEach(addSegment);
  blueprint.targetBank.posts.forEach((post) => addPost(post.x, post.z, post.radius, 0.58));
  blueprint.targets.forEach((target) => {
    addWall(target.face.x, target.face.z, target.face.width / 2, target.face.thickness / 2, target.face.angle ?? 0, 0.72);
  });
  blueprint.saucers.forEach((saucer) => {
    saucer.posts.forEach((post) => addPost(post.x, post.z, post.radius, 0.6));
    saucer.walls.forEach(addSegment);
  });
  saucerCupRimColliderSegments().forEach(addSegment);
  const leftFlipper = blueprint.flippers.find((flipper) => flipper.side === "left");
  const rightFlipper = blueprint.flippers.find((flipper) => flipper.side === "right");
  if (!leftFlipper || !rightFlipper) {
    throw new Error("Blueprint must define left and right flippers.");
  }

  return {
    flippers: {
      left: addFlipper(leftFlipper),
      right: addFlipper(rightFlipper)
    },
    gates
  };
};
