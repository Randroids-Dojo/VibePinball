import { describe, expect, it } from "vitest";
import { emptyActionState } from "../src/game/input";
import { PinballPhysics, type PhysicsSnapshot } from "../src/game/physics";

const step = (
  physics: PinballPhysics,
  actions = emptyActionState(),
  seconds = 1 / 60
): PhysicsSnapshot => physics.step(actions, seconds, true);

describe("pinball physics", () => {
  it("keeps post-launch hardware rebounds on the physical deck", async () => {
    const chargeDurations = [18, 27, 36, 54, 72];

    for (const chargeFrames of chargeDurations) {
      const physics = await PinballPhysics.create();
      const snapshot = await launchAndSettle(physics, chargeFrames, 540);

      expect(snapshot.ball.y).toBeGreaterThan(0.12);
      expect(snapshot.ball.y).toBeLessThan(0.8);
    }
  });

  it("contains the ball inside the cabinet box across launches and flipper mashing", async () => {
    const physics = await PinballPhysics.create();

    for (const chargeFrames of [12, 36, 72]) {
      physics.resetBall();

      const charging = { ...emptyActionState(), plunger: true };
      for (let i = 0; i < chargeFrames; i += 1) {
        expectInsideCabinet(step(physics, charging));
      }

      for (let i = 0; i < 1200; i += 1) {
        const mashing = {
          ...emptyActionState(),
          leftFlipper: i % 40 < 20,
          rightFlipper: i % 40 >= 20,
          nudgeUp: i % 180 === 0
        };
        expectInsideCabinet(step(physics, mashing));
      }
    }
  });

  it("launches a resting ball up-table through physical flipper contact", async () => {
    const physics = await PinballPhysics.create();
    physics.placeBall(-1.0, 5.45, 0, 0);

    for (let i = 0; i < 30; i += 1) {
      step(physics);
    }
    const settled = step(physics);

    const flipping = { ...emptyActionState(), leftFlipper: true };
    let flipped = settled;
    let furthestUpTableZ = settled.ball.z;
    for (let i = 0; i < 30; i += 1) {
      flipped = step(physics, flipping);
      furthestUpTableZ = Math.min(furthestUpTableZ, flipped.ball.z);
    }

    expect(settled.ball.z - furthestUpTableZ).toBeGreaterThan(1);
    expect(planarDistance(settled.ball, flipped.ball)).toBeGreaterThan(1);
  });

  it("applies no phantom force to balls away from the flippers", async () => {
    const physics = await PinballPhysics.create();

    for (let i = 0; i < 120; i += 1) {
      step(physics);
    }
    const resting = step(physics);

    const mashing = { ...emptyActionState(), leftFlipper: true, rightFlipper: true };
    let after = resting;
    for (let i = 0; i < 60; i += 1) {
      after = step(physics, mashing);
    }

    expect(planarDistance(resting.ball, after.ball)).toBeLessThan(0.1);
  });

  it("sweeps the flipper angle over time instead of teleporting it", async () => {
    const physics = await PinballPhysics.create();
    const atRest = step(physics);

    const flipping = { ...emptyActionState(), leftFlipper: true };
    const firstFrame = step(physics, flipping);
    const secondFrame = step(physics, flipping);
    let settledAngle = secondFrame;
    for (let i = 0; i < 10; i += 1) {
      settledAngle = step(physics, flipping);
    }

    expect(firstFrame.leftFlipperAngle).toBeGreaterThan(atRest.leftFlipperAngle);
    expect(firstFrame.leftFlipperAngle).toBeLessThan(settledAngle.leftFlipperAngle);
    expect(secondFrame.leftFlipperAngle).toBeGreaterThan(firstFrame.leftFlipperAngle);
  });

  it("kicks the ball away from a pop bumper on skirt contact", async () => {
    const physics = await PinballPhysics.create();
    physics.placeBall(-1.25, -4.0, 0, -4);

    let sawBumper = false;
    let previous = step(physics);
    for (let i = 0; i < 90; i += 1) {
      const snapshot = step(physics);
      if (snapshot.events.some((event) => event.type === "bumper")) {
        sawBumper = true;
        previous = snapshot;
        break;
      }
      previous = snapshot;
    }
    expect(sawBumper).toBe(true);

    let maxSpeed = 0;
    let lastBall = previous.ball;
    for (let i = 0; i < 30; i += 1) {
      const snapshot = step(physics);
      maxSpeed = Math.max(maxSpeed, planarDistance(snapshot.ball, lastBall) * 60);
      lastBall = snapshot.ball;
    }
    expect(maxSpeed).toBeGreaterThan(2);
    expect(maxSpeed).toBeLessThan(14);
  });

  it("scores target hits from rebound physics without injecting energy", async () => {
    const physics = await PinballPhysics.create();
    physics.placeBall(0, -1.8, 0, -5);

    let sawTarget = false;
    let lastBall = { x: 0, y: 0, z: -1.8 };
    for (let i = 0; i < 90; i += 1) {
      const snapshot = step(physics);
      lastBall = snapshot.ball;
      if (snapshot.events.some((event) => event.type === "target")) {
        sawTarget = true;
        break;
      }
    }
    expect(sawTarget).toBe(true);

    let reboundSpeed = 0;
    for (let i = 0; i < 10; i += 1) {
      const snapshot = step(physics);
      reboundSpeed = Math.max(reboundSpeed, planarDistance(snapshot.ball, lastBall) * 60);
      lastBall = snapshot.ball;
    }
    expect(reboundSpeed).toBeLessThan(7);
  });

  it("fires the sling kick on rubber face contact", async () => {
    const physics = await PinballPhysics.create();
    physics.placeBall(-1.56, 3.17, -2.56, 3.08);

    let sawSling = false;
    for (let i = 0; i < 30; i += 1) {
      const snapshot = step(physics);
      if (snapshot.events.some((event) => event.type === "sling" && event.side === "left")) {
        sawSling = true;
        break;
      }
    }
    expect(sawSling).toBe(true);

    let lastBall = physics.step(emptyActionState(), 0, false).ball;
    let maxSpeed = 0;
    for (let i = 0; i < 30; i += 1) {
      const snapshot = step(physics);
      maxSpeed = Math.max(maxSpeed, planarDistance(snapshot.ball, lastBall) * 60);
      lastBall = snapshot.ball;
    }
    expect(maxSpeed).toBeGreaterThan(2);
    expect(maxSpeed).toBeLessThan(14);
  });

  it("captures and ejects the lock saucer ball at a playable speed", async () => {
    const physics = await PinballPhysics.create();
    physics.placeBall(0.92, -4.35, 0, 3);

    let sawEnter = false;
    let sawEject = false;
    let lastBall = { x: 0.92, y: 0, z: -2.6 };
    let postEjectSpeed = 0;
    for (let i = 0; i < 180; i += 1) {
      const snapshot = step(physics);
      if (snapshot.events.some((event) => event.type === "lockEnter")) {
        sawEnter = true;
      }
      if (snapshot.events.some((event) => event.type === "lockEject")) {
        sawEject = true;
      }
      if (sawEject) {
        postEjectSpeed = Math.max(postEjectSpeed, planarDistance(snapshot.ball, lastBall) * 60);
      }
      lastBall = snapshot.ball;
    }
    expect(sawEnter).toBe(true);
    expect(sawEject).toBe(true);
    expect(postEjectSpeed).toBeGreaterThan(2);
    expect(postEjectSpeed).toBeLessThan(15);
  });

  it("keeps low-speed live balls recoverable after launch settling", async () => {
    const physics = await PinballPhysics.create();
    const beforeRecovery = await launchAndSettle(physics, 36, 900);

    const restingAtPlunger = beforeRecovery.ball.x > 3.05 && beforeRecovery.ball.z > 4.55;
    let afterRecovery = beforeRecovery;
    if (restingAtPlunger) {
      const charging = { ...emptyActionState(), plunger: true };
      for (let i = 0; i < 40; i += 1) {
        afterRecovery = step(physics, charging);
      }
      for (let i = 0; i < 30; i += 1) {
        afterRecovery = step(physics);
      }
    } else {
      const activeFlippers = { ...emptyActionState(), leftFlipper: true, rightFlipper: true };
      for (let i = 0; i < 45; i += 1) {
        afterRecovery = step(physics, activeFlippers);
      }
    }

    expect(planarDistance(beforeRecovery.ball, afterRecovery.ball)).toBeGreaterThan(1);
  });
});

const launchAndSettle = async (
  physics: PinballPhysics,
  chargeFrames: number,
  settleFrames: number
): Promise<PhysicsSnapshot> => {
  physics.resetBall();

  const charging = { ...emptyActionState(), plunger: true };
  for (let i = 0; i < chargeFrames; i += 1) {
    step(physics, charging);
  }

  let snapshot = step(physics);
  expect(snapshot.events.some((event) => event.type === "launch")).toBe(true);

  for (let i = 0; i < settleFrames; i += 1) {
    snapshot = step(physics);
    if (snapshot.events.some((event) => event.type === "drain")) {
      break;
    }
  }

  return snapshot;
};

const planarDistance = (
  a: PhysicsSnapshot["ball"],
  b: PhysicsSnapshot["ball"]
): number => Math.hypot(a.x - b.x, a.z - b.z);

const expectInsideCabinet = (snapshot: PhysicsSnapshot): void => {
  const { x, y, z } = snapshot.ball;
  expect(Math.abs(x), `ball x ${x.toFixed(3)} stays inside the side walls`).toBeLessThanOrEqual(4.5);
  expect(y, `ball y ${y.toFixed(3)} stays above the deck`).toBeGreaterThanOrEqual(-0.35);
  expect(y, `ball y ${y.toFixed(3)} stays under the glass`).toBeLessThanOrEqual(2.2);
  expect(z, `ball z ${z.toFixed(3)} stays behind the backboard`).toBeGreaterThanOrEqual(-8.0);
  expect(z, `ball z ${z.toFixed(3)} stays inside the cabinet front`).toBeLessThanOrEqual(8.5);
};
