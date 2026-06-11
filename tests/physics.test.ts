import { describe, expect, it } from "vitest";
import { emptyActionState } from "../src/game/input";
import { PinballPhysics, type PhysicsSnapshot } from "../src/game/physics";

const step = (
  physics: PinballPhysics,
  actions = emptyActionState(),
  seconds = 1 / 60
): PhysicsSnapshot => physics.step(actions, seconds, true);

describe("pinball physics", () => {
  it("marks a fast post-launch drain for ball-save handling", async () => {
    const physics = await PinballPhysics.create();
    physics.resetBall();

    const charging = { ...emptyActionState(), plunger: true };
    for (let i = 0; i < 27; i += 1) {
      step(physics, charging);
    }

    let snapshot = step(physics);
    expect(snapshot.events.some((event) => event.type === "launch")).toBe(true);

    let quickDrain = false;

    for (let i = 0; i < 480; i += 1) {
      snapshot = step(physics);
      const drain = snapshot.events.find((event) => event.type === "drain");
      if (drain?.type === "drain") {
        quickDrain = drain.quick === true;
        break;
      }
    }

    expect(quickDrain).toBe(true);
  });
});
