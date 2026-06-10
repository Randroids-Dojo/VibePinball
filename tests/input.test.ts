import { describe, expect, it } from "vitest";
import {
  actionForKey,
  emptyActionState,
  setAction,
  shouldPreventBrowserDefault
} from "../src/game/input";

describe("input mapping", () => {
  it("normalizes keyboard input into action names", () => {
    expect(actionForKey("ShiftLeft")).toBe("leftFlipper");
    expect(actionForKey("KeyL")).toBe("rightFlipper");
    expect(actionForKey("Space")).toBe("plunger");
  });

  it("updates immutable action state", () => {
    const state = emptyActionState();
    const next = setAction(state, "leftFlipper", true);

    expect(state.leftFlipper).toBe(false);
    expect(next.leftFlipper).toBe(true);
  });

  it("prevents active play keys from scrolling the browser", () => {
    expect(shouldPreventBrowserDefault("Space")).toBe(true);
    expect(shouldPreventBrowserDefault("ArrowLeft")).toBe(true);
    expect(shouldPreventBrowserDefault("KeyQ")).toBe(false);
  });
});
