import type { ActionState, TableEvent } from "./types";
import type { RigidBody, World } from "@dimforge/rapier3d-compat";
import {
  rampSidePoint,
  silverballSocialBlueprint,
  type RampPath,
  type Segment,
  type SaucerDevice,
  type SensorZone,
  type WireformPath
} from "./tableBlueprint";

type RapierModule = typeof import("@dimforge/rapier3d-compat");

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

export class PinballPhysics {
  private readonly rapier: RapierModule;
  private readonly world: World;
  private readonly ball: RigidBody;
  private readonly cooldowns = new Map<string, number>();
  private accumulator = 0;
  private plungerCharge = 0;
  private nudgeHeat = 0;
  private launched = false;
  private saucerHoldSeconds = 0;
  private saucerHeldBy: SaucerDevice | null = null;

  private constructor(rapier: RapierModule, world: World, ball: RigidBody) {
    this.rapier = rapier;
    this.world = world;
    this.ball = ball;
  }

  static async create(): Promise<PinballPhysics> {
    const rapier = await import("@dimforge/rapier3d-compat");
    await rapier.init();

    const world = new rapier.World({ x: -1.25, y: 0, z: 8.8 });
    const ballBody = world.createRigidBody(
      rapier.RigidBodyDesc.dynamic()
        .setTranslation(3.18, 0.35, 5.55)
        .setLinearDamping(0.08)
        .setAngularDamping(0.1)
    );
    world.createCollider(
      rapier.ColliderDesc.ball(blueprint.scale.ballRadius).setRestitution(0.78).setFriction(0.08),
      ballBody
    );

    createTableColliders(rapier, world);
    return new PinballPhysics(rapier, world, ballBody);
  }

  resetBall(): void {
    this.launched = false;
    this.plungerCharge = 0;
    this.nudgeHeat = 0;
    this.cooldowns.clear();
    this.saucerHeldBy = null;
    this.saucerHoldSeconds = 0;
    this.ball.setTranslation({ x: 3.18, y: 0.35, z: 5.55 }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  step(actions: ActionState, dt: number, scoringEnabled: boolean): PhysicsSnapshot {
    const events: TableEvent[] = [];
    this.accumulator += Math.min(dt, 0.05);
    this.tickSaucerHold(dt);
    this.tickInput(actions, dt, events, scoringEnabled);

    while (this.accumulator >= 1 / 60) {
      this.world.step();
      this.accumulator -= 1 / 60;
    }

    this.clampBallSpeed();
    this.detectDeviceHits(events, scoringEnabled);

    let pos = this.ball.translation();
    if (this.isInsideDrain(pos.x, pos.z)) {
      events.push({ type: "drain" });
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
      leftFlipperAngle: actions.leftFlipper ? 0.58 : -0.22,
      rightFlipperAngle: actions.rightFlipper ? -0.58 : 0.22,
      plungerCharge: this.plungerCharge,
      events
    };
  }

  private tickInput(
    actions: ActionState,
    dt: number,
    events: TableEvent[],
    scoringEnabled: boolean
  ): void {
    const pos = this.ball.translation();
    const inShooterLane = pos.x > 2.72 && pos.z > 4.55 && !this.launched;

    if (actions.plunger && inShooterLane) {
      this.plungerCharge = Math.min(1, this.plungerCharge + dt * 0.85);
      this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (!actions.plunger && this.plungerCharge > 0 && inShooterLane) {
      const strength = 7.5 + this.plungerCharge * 11;
      this.ball.applyImpulse({ x: -1.75, y: 0, z: -strength }, true);
      this.plungerCharge = 0;
      this.launched = true;
    }

    if (!scoringEnabled) {
      return;
    }

    if (actions.leftFlipper && this.isNear(pos.x, pos.z, -1.35, 4.65, 1.35, "left-flipper", 0.08)) {
      this.ball.applyImpulse({ x: 2.6, y: 0, z: -6.7 }, true);
    }

    if (actions.rightFlipper && this.isNear(pos.x, pos.z, 1.35, 4.65, 1.35, "right-flipper", 0.08)) {
      this.ball.applyImpulse({ x: -2.6, y: 0, z: -6.7 }, true);
    }

    if (actions.nudgeLeft || actions.nudgeRight || actions.nudgeUp) {
      this.nudgeHeat += dt * 5.5;
      if (!this.cooldowns.has("nudge")) {
        const x = actions.nudgeLeft ? -2.2 : actions.nudgeRight ? 2.2 : 0;
        const z = actions.nudgeUp ? -2.2 : 0;
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
    for (const bumper of blueprint.bumpers) {
      if (this.isNear(pos.x, pos.z, bumper.x, bumper.z, bumper.skirtRadius, `bumper-${bumper.id}`, 0.35)) {
        const dx = pos.x - bumper.x;
        const dz = pos.z - bumper.z;
        this.ball.applyImpulse({ x: dx * 3.5, y: 0, z: dz * 3.5 - 1.2 }, true);
        events.push({ type: "bumper", id: bumper.id });
      }
    }

    for (const target of blueprint.targets) {
      if (this.isNear(pos.x, pos.z, target.x, target.z, target.radius, `target-${target.id}`, 1.2)) {
        this.ball.applyImpulse({ x: (pos.x - target.x) * 2.6, y: 0, z: 4.5 }, true);
        events.push({ type: "target", id: target.id });
      }
    }

    for (const sling of blueprint.slings) {
      if (this.isNear(pos.x, pos.z, sling.x, sling.z, 0.55, `sling-${sling.side}`, 0.25)) {
        this.ball.applyImpulse({
          x: sling.impulseNormalX * 3.6,
          y: 0,
          z: sling.impulseNormalZ * 3.6
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
    this.ball.setTranslation({ x: saucer.holdX, y: 0.32, z: saucer.holdZ }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  private tickSaucerHold(dt: number): void {
    if (!this.saucerHeldBy) {
      return;
    }

    const saucer = this.saucerHeldBy;
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
    this.ball.applyImpulse({
      x: dx / length * saucer.ejectStrength,
      y: 0,
      z: dz / length * saucer.ejectStrength
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

  private clampBallSpeed(): void {
    const vel = this.ball.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed > 18) {
      const scale = 18 / speed;
      this.ball.setLinvel({ x: vel.x * scale, y: vel.y * scale, z: vel.z * scale }, true);
    }
  }
}

const createTableColliders = (rapier: RapierModule, world: World): void => {
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
      rapier.ColliderDesc.cuboid(hx, hy, hz).setRestitution(restitution).setFriction(0.18),
      body
    );
  };

  const addWall = (x: number, z: number, hx: number, hz: number, angle = 0, restitution = 0.62) => {
    addBoxCollider(x, 0.16, z, hx, 0.32, hz, angle, 0, restitution);
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

  const addPost = (x: number, z: number, radius: number, restitution = 0.82) => {
    const body = world.createRigidBody(rapier.RigidBodyDesc.fixed().setTranslation(x, 0.2, z));
    world.createCollider(
      rapier.ColliderDesc.cylinder(0.34, radius).setRestitution(restitution).setFriction(0.16),
      body
    );
  };

  const addRamp = (ramp: RampPath) => {
    const rise = ramp.endY - ramp.startY;
    const pitch = Math.atan2(rise, ramp.depth);
    const slopedDepth = Math.hypot(ramp.depth, rise);
    const centerY = (ramp.startY + ramp.endY) / 2;
    const sideRailY = centerY + ramp.floorThickness / 2 + ramp.sideRailHeight / 2;
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

    for (const offset of [-ramp.sideRailOffset, ramp.sideRailOffset]) {
      const side = rampSidePoint(ramp, offset);
      addBoxCollider(
        side.x,
        sideRailY,
        side.z,
        0.035,
        ramp.sideRailHeight / 2,
        slopedDepth / 2,
        ramp.angle,
        pitch,
        0.68
      );
    }

    const lipY = ramp.startY + 0.12;
    const lipBounce = ramp.entranceLip.kind === "rubber" ? 0.86 : 0.62;
    addBoxCollider(
      ramp.entranceLip.x,
      lipY,
      ramp.entranceLip.z,
      ramp.entranceLip.width / 2,
      0.2,
      ramp.entranceLip.depth / 2,
      ramp.entranceLip.angle ?? 0,
      0,
      lipBounce
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
    for (const segment of wireform.segments) {
      for (const offset of [-wireform.railOffset, wireform.railOffset]) {
        addBoxCollider(
          segment.x + offset,
          wireform.railY,
          segment.z,
          0.025,
          wireform.railHeight / 2,
          segment.depth / 2,
          segment.angle ?? 0,
          0,
          0.7
        );
      }

      addBoxCollider(
        segment.x,
        wireform.railY,
        segment.z,
        wireform.tieWidth / 2,
        0.025,
        0.03,
        segment.angle ?? 0,
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

  blueprint.boundaries.forEach(addSegment);
  blueprint.laneWalls.forEach(addSegment);
  blueprint.flipperStops.forEach(addSegment);
  blueprint.slings.forEach((sling) => addSegment(sling.rubberFace));
  addSegment(blueprint.plunger.gate);
  blueprint.ramps.forEach(addRamp);
  blueprint.handoffs
    .flatMap((handoff) => handoff.segments)
    .forEach(addSegment);
  blueprint.wireforms.forEach(addWireform);
  blueprint.posts.forEach((post) => addPost(post.x, post.z, post.radius));
  blueprint.bumpers.forEach((bumper) => addPost(bumper.x, bumper.z, bumper.capRadius, 0.92));
  blueprint.targets.forEach((target) => {
    addWall(target.x, target.z, 0.18, 0.05, target.angle, 0.72);
    addSegment(target.rearStop);
  });
  blueprint.saucers.forEach((saucer) => {
    saucer.posts.forEach((post) => addPost(post.x, post.z, post.radius, 0.6));
    saucer.walls.forEach(addSegment);
  });
  blueprint.flippers.forEach((flipper) => {
    const direction = flipper.side === "left" ? 1 : -1;
    addWall(
      flipper.x + direction * flipper.length * 0.32,
      flipper.z,
      flipper.length / 2,
      0.08,
      flipper.restAngle,
      0.88
    );
  });
};
