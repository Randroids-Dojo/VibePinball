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

  it("keeps low-speed live balls recoverable after launch settling", async () => {
    const physics = await PinballPhysics.create();
    const beforeRecovery = await launchAndSettle(physics, 36, 900);

    expect(beforeRecovery.ball.z > 4.15 || Math.abs(beforeRecovery.ball.x) < 2.4).toBe(true);

    let afterRecovery = beforeRecovery;
    const activeFlippers = { ...emptyActionState(), leftFlipper: true, rightFlipper: true };
    for (let i = 0; i < 45; i += 1) {
      afterRecovery = step(physics, activeFlippers);
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
