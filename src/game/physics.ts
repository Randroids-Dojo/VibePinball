import type { ActionState, TableEvent } from "./types";
import type { RigidBody, World } from "@dimforge/rapier3d-compat";

type RapierModule = typeof import("@dimforge/rapier3d-compat");

interface Zone {
  id: string;
  x: number;
  z: number;
  radius: number;
}

export interface BallSnapshot {
  x: number;
  y: number;
  z: number;
}

export interface PhysicsSnapshot {
  ball: BallSnapshot;
  leftFlipperAngle: number;
  rightFlipperAngle: number;
  plungerCharge: number;
  events: TableEvent[];
}

const bumpers: Zone[] = [
  { id: "pop-a", x: -1.25, z: -4.9, radius: 0.72 },
  { id: "pop-b", x: 1.15, z: -5.15, radius: 0.72 },
  { id: "pop-c", x: 0, z: -3.85, radius: 0.68 }
];

const targets: Zone[] = [
  { id: "left", x: -1.55, z: -2.55, radius: 0.5 },
  { id: "center", x: 0, z: -2.9, radius: 0.5 },
  { id: "right", x: 1.55, z: -2.55, radius: 0.5 }
];

export class PinballPhysics {
  private readonly rapier: RapierModule;
  private readonly world: World;
  private readonly ball: RigidBody;
  private readonly cooldowns = new Map<string, number>();
  private accumulator = 0;
  private plungerCharge = 0;
  private nudgeHeat = 0;
  private launched = false;

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
      rapier.ColliderDesc.ball(0.24).setRestitution(0.78).setFriction(0.08),
      ballBody
    );

    createTableColliders(rapier, world);
    return new PinballPhysics(rapier, world, ballBody);
  }

  resetBall(): void {
    this.launched = false;
    this.plungerCharge = 0;
    this.ball.setTranslation({ x: 3.18, y: 0.35, z: 5.55 }, true);
    this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  step(actions: ActionState, dt: number, scoringEnabled: boolean): PhysicsSnapshot {
    const events: TableEvent[] = [];
    this.accumulator += Math.min(dt, 0.05);
    this.tickInput(actions, dt, events, scoringEnabled);

    while (this.accumulator >= 1 / 60) {
      this.world.step();
      this.accumulator -= 1 / 60;
    }

    this.clampBallSpeed();
    this.detectDeviceHits(events, scoringEnabled);

    const pos = this.ball.translation();
    if (pos.z > 7.35) {
      events.push({ type: "drain" });
      this.resetBall();
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
    for (const bumper of bumpers) {
      if (this.isNear(pos.x, pos.z, bumper.x, bumper.z, bumper.radius, `bumper-${bumper.id}`, 0.35)) {
        const dx = pos.x - bumper.x;
        const dz = pos.z - bumper.z;
        this.ball.applyImpulse({ x: dx * 3.5, y: 0, z: dz * 3.5 - 1.2 }, true);
        events.push({ type: "bumper", id: bumper.id });
      }
    }

    for (const target of targets) {
      if (this.isNear(pos.x, pos.z, target.x, target.z, target.radius, `target-${target.id}`, 1.2)) {
        this.ball.applyImpulse({ x: (pos.x - target.x) * 2.6, y: 0, z: 4.5 }, true);
        events.push({ type: "target", id: target.id });
      }
    }

    if (pos.z < -6.4 && pos.x > 2.2 && !this.cooldowns.has("skill-shot")) {
      this.cooldowns.set("skill-shot", 2.5);
      events.push({ type: "skillShot" });
    } else if (pos.z < -6.8 && Math.abs(pos.x) < 1 && !this.cooldowns.has("top-lane")) {
      this.cooldowns.set("top-lane", 2);
      events.push({ type: "lane", id: "top" });
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
  const addWall = (x: number, z: number, hx: number, hz: number, angle = 0) => {
    const body = world.createRigidBody(
      rapier.RigidBodyDesc.fixed().setTranslation(x, 0.16, z).setRotation({
        x: 0,
        y: Math.sin(angle / 2),
        z: 0,
        w: Math.cos(angle / 2)
      })
    );
    world.createCollider(
      rapier.ColliderDesc.cuboid(hx, 0.32, hz).setRestitution(0.62).setFriction(0.18),
      body
    );
  };

  addWall(-4.08, 0, 0.18, 7.4);
  addWall(4.08, 0, 0.18, 7.4);
  addWall(0, -7.25, 3.75, 0.18);
  addWall(-2.4, 6.05, 1.15, 0.2, -0.34);
  addWall(2.4, 6.05, 1.15, 0.2, 0.34);
  addWall(2.72, 4.6, 0.12, 2.4);
  addWall(3.36, 2.55, 0.16, 1.35, -0.42);
  addWall(3.18, 6.45, 0.62, 0.18, -0.22);
};
