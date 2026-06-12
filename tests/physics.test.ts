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
