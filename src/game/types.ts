export type GamePhase = "ready" | "playing" | "gameOver";

export type GameAction =
  | "leftFlipper"
  | "rightFlipper"
  | "plunger"
  | "nudgeLeft"
  | "nudgeRight"
  | "nudgeUp";

export type ActionState = Record<GameAction, boolean>;

export type TableEvent =
  | { type: "bumper"; id: string }
  | { type: "sling"; side: "left" | "right" }
  | { type: "target"; id: string }
  | { type: "lane"; id: string }
  | { type: "lockEnter"; id: string }
  | { type: "lockHeld"; id: string }
  | { type: "lockEject"; id: string }
  | { type: "rampEnter"; id: string }
  | { type: "rampMade"; id: string }
  | { type: "orbitMade"; id: string }
  | { type: "launch" }
  | { type: "skillShot" }
  | { type: "drain" }
  | { type: "tiltWarning" }
  | { type: "tilt" };

export interface HudState {
  phase: GamePhase;
  score: number;
  ball: number;
  message: string;
  targets: number;
  locks: number;
  tiltWarnings: number;
  plungerCharge: number;
}

export interface GameState extends HudState {
  bonus: number;
  tilted: boolean;
  skillShotOpen: boolean;
  hitTargets: Set<string>;
  lockedBalls: number;
}
