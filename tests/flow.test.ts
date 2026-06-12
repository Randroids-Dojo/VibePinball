import { expect, it } from "vitest";
import { emptyActionState } from "../src/game/input";
import { PinballPhysics } from "../src/game/physics";

it("keeps the ball contained, unstuck, and flowing across an extended session", async () => {
  const physics = await PinballPhysics.create();
  const counts = new Map<string, number>();
  let maxAbsX = 0;
  let minY = 10;
  let maxY = -10;
  let minZ = 10;
  let maxZ = -10;
  let worstStall = 0;
  let stallFrames = 0;
  let lastBall = { x: 0, y: 0, z: 0 };

  for (let round = 0; round < 8; round += 1) {
    physics.resetBall();
    const charging = { ...emptyActionState(), plunger: true };
    for (let i = 0; i < 30 + round * 12; i += 1) {
      physics.step(charging, 1 / 60, true);
    }
    for (let i = 0; i < 3600; i += 1) {
      const actions = {
        ...emptyActionState(),
        leftFlipper: (i + round * 7) % (38 + round) < 19,
        rightFlipper: (i + round * 13) % (55 + round) >= 27,
        nudgeUp: i % 421 === 0,
        nudgeLeft: i % 533 === 0
      };
      const snapshot = physics.step(actions, 1 / 60, true);
      const ball = snapshot.ball;
      maxAbsX = Math.max(maxAbsX, Math.abs(ball.x));
      minY = Math.min(minY, ball.y);
      maxY = Math.max(maxY, ball.y);
      minZ = Math.min(minZ, ball.z);
      maxZ = Math.max(maxZ, ball.z);

      const moved = Math.hypot(ball.x - lastBall.x, ball.z - lastBall.z);
      const atPlunger = ball.x > 3.05 && ball.z > 4.55;
      const atFlippers = ball.z > 4.15 && Math.abs(ball.x) < 2.4;
      if (moved < 0.005 && !atPlunger && !atFlippers) {
        stallFrames += 1;
        worstStall = Math.max(worstStall, stallFrames);
      } else {
        stallFrames = 0;
      }
      lastBall = ball;

      for (const event of snapshot.events) {
        counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
      }
    }
  }


  expect(counts.get("launch") ?? 0).toBeGreaterThan(4);
  expect((counts.get("sling") ?? 0) + (counts.get("target") ?? 0) + (counts.get("orbitMade") ?? 0)).toBeGreaterThan(10);
  expect(maxAbsX).toBeLessThanOrEqual(4.5);
  expect(minY).toBeGreaterThanOrEqual(-0.35);
  expect(maxY).toBeLessThanOrEqual(2.2);
  expect(minZ).toBeGreaterThanOrEqual(-8.0);
  expect(maxZ).toBeLessThanOrEqual(8.5);
  expect(worstStall).toBeLessThan(180);
});
