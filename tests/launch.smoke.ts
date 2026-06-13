import { expect, test } from "@playwright/test";

test("a full-power launch enters play and does not return to the plunger", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(400);

  await page.keyboard.down("Space");
  await page.waitForTimeout(1400);
  await page.keyboard.up("Space");

  let everInPlay = false;
  let returnedToPlunger = false;
  for (let i = 0; i < 70; i += 1) {
    await page.waitForTimeout(120);
    const ball = await page.evaluate(
      () => (window as unknown as { __vpDebug?: { ball: { x: number; z: number } } }).__vpDebug?.ball
    );
    if (!ball) {
      continue;
    }
    if (ball.z < 3.5) {
      everInPlay = true;
    }
    if (everInPlay && ball.x > 3.05 && ball.z > 4.55 && i > 10) {
      returnedToPlunger = true;
      break;
    }
  }

  expect(everInPlay).toBe(true);
  expect(returnedToPlunger).toBe(false);
});
