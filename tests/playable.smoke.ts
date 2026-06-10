import { expect, test } from "@playwright/test";

test("renders a playable table and responds to launch input", async ({ page }) => {
  await page.goto("/");

  const canvas = page.getByTestId("pinball-canvas");
  await expect(canvas).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();

  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText(/Ball 1 ready/)).toBeVisible();

  await page.waitForTimeout(250);
  const beforeLaunchFrame = await canvas.evaluate((node) => {
    return node instanceof HTMLCanvasElement ? node.toDataURL("image/png") : "";
  });

  const launchButton = page.getByRole("button", { name: "Launch" });
  await page.keyboard.down("Space");
  await page.waitForTimeout(450);
  await expect(launchButton).toBeVisible();
  await page.keyboard.up("Space");
  await page.waitForTimeout(800);

  const scoreText = page.locator(".score");
  await expect(scoreText).toContainText("0");

  const hasPlayfieldSize = await canvas.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width > 300 && rect.height > 300;
  });
  expect(hasPlayfieldSize).toBe(true);

  const afterLaunchFrame = await canvas.evaluate((node) => {
    return node instanceof HTMLCanvasElement ? node.toDataURL("image/png") : "";
  });
  expect(afterLaunchFrame.length).toBeGreaterThan(1000);
  expect(afterLaunchFrame).not.toBe(beforeLaunchFrame);
});
