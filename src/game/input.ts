import type { ActionState, GameAction } from "./types";

export const emptyActionState = (): ActionState => ({
  leftFlipper: false,
  rightFlipper: false,
  plunger: false,
  nudgeLeft: false,
  nudgeRight: false,
  nudgeUp: false
});

const keyBindings = new Map<string, GameAction>([
  ["ShiftLeft", "leftFlipper"],
  ["KeyA", "leftFlipper"],
  ["ShiftRight", "rightFlipper"],
  ["KeyL", "rightFlipper"],
  ["Space", "plunger"],
  ["ArrowLeft", "nudgeLeft"],
  ["ArrowRight", "nudgeRight"],
  ["ArrowUp", "nudgeUp"]
]);

export const actionForKey = (code: string): GameAction | null => {
  return keyBindings.get(code) ?? null;
};

export const setAction = (
  state: ActionState,
  action: GameAction,
  pressed: boolean
): ActionState => ({
  ...state,
  [action]: pressed
});

export const shouldPreventBrowserDefault = (code: string): boolean => {
  return code === "Space" || code.startsWith("Arrow") || keyBindings.has(code);
};
