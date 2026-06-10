import { describe, expect, it } from "vitest";
import {
  applyTableEvent,
  createInitialGameState,
  setPlungerCharge,
  startGame
} from "../src/game/rules";

describe("pinball rules", () => {
  it("starts a three ball game", () => {
    const state = startGame();

    expect(state.phase).toBe("playing");
    expect(state.ball).toBe(1);
    expect(state.score).toBe(0);
    expect(state.message).toContain("Ball 1");
  });

  it("scores target progress once events arrive", () => {
    const state = applyTableEvent(startGame(), { type: "target", id: "left" });

    expect(state.score).toBe(1000);
    expect(state.targets).toBe(1);
    expect(state.bonus).toBe(250);
  });

  it("ends after the third drain and adds non-tilted bonus", () => {
    let state = startGame();
    state = applyTableEvent(state, { type: "target", id: "left" });
    state = applyTableEvent(state, { type: "drain" });
    state = applyTableEvent(state, { type: "drain" });
    state = applyTableEvent(state, { type: "drain" });

    expect(state.phase).toBe("gameOver");
    expect(state.ball).toBe(3);
    expect(state.score).toBe(1250);
  });

  it("cancels scoring and bonus after tilt until drain", () => {
    let state = startGame();
    state = applyTableEvent(state, { type: "tilt" });
    state = applyTableEvent(state, { type: "target", id: "left" });
    state = applyTableEvent(state, { type: "drain" });

    expect(state.score).toBe(0);
    expect(state.ball).toBe(2);
    expect(state.tilted).toBe(false);
  });

  it("clamps plunger charge", () => {
    expect(setPlungerCharge(createInitialGameState(), 2).plungerCharge).toBe(1);
    expect(setPlungerCharge(createInitialGameState(), -2).plungerCharge).toBe(0);
  });
});
