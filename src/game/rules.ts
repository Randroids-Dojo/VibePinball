import type { GameState, TableEvent } from "./types";
import { targetBankSize } from "./tableBlueprint";

const maxBalls = 3;

const eventScores: Record<TableEvent["type"], number> = {
  bumper: 250,
  sling: 150,
  target: 1000,
  lane: 500,
  lockEnter: 2500,
  lockHeld: 0,
  lockEject: 0,
  rampEnter: 0,
  rampMade: 1500,
  orbitMade: 1250,
  launch: 0,
  skillShot: 5000,
  drain: 0,
  tiltWarning: 0,
  tilt: 0
};

export const createInitialGameState = (): GameState => ({
  phase: "ready",
  score: 0,
  ball: 1,
  message: "Press Start, then hold Space or Launch.",
  targets: 0,
  locks: 0,
  tiltWarnings: 0,
  plungerCharge: 0,
  bonus: 0,
  tilted: false,
  skillShotOpen: true,
  hitTargets: new Set(),
  lockedBalls: 0,
  ballSaveAvailable: true
});

export const startGame = (): GameState => ({
  ...createInitialGameState(),
  phase: "playing",
  message: "Ball 1 ready. Charge the plunger."
});

export const setPlungerCharge = (
  state: GameState,
  plungerCharge: number
): GameState => ({
  ...state,
  plungerCharge: Math.max(0, Math.min(1, plungerCharge))
});

export const applyTableEvent = (
  state: GameState,
  event: TableEvent
): GameState => {
  if (state.phase !== "playing") {
    return state;
  }

  if (state.tilted && event.type !== "drain") {
    return state;
  }

  if (event.type === "drain") {
    return drainBall(state, event.quick === true);
  }

  if (event.type === "tiltWarning") {
    const warnings = Math.min(2, state.tiltWarnings + 1);
    return {
      ...state,
      tiltWarnings: warnings,
      message: warnings >= 2 ? "Danger. Next hard nudge tilts." : "Tilt warning."
    };
  }

  if (event.type === "tilt") {
    return {
      ...state,
      tilted: true,
      message: "Tilt. Flippers and scoring disabled until drain."
    };
  }

  if (event.type === "target") {
    const nextTargets = new Set(state.hitTargets);
    nextTargets.add(event.id);
    return {
      ...award(state, eventScores.target),
      hitTargets: nextTargets,
      targets: nextTargets.size,
      bonus: state.bonus + 250,
      message: nextTargets.size >= targetBankSize ? "Lock is lit." : `Target ${nextTargets.size}/${targetBankSize}`
    };
  }

  if (event.type === "lockEnter") {
    const isQualified = state.hitTargets.size >= targetBankSize;
    const canLock = isQualified && state.lockedBalls < 2;
    const nextLockedBalls = canLock ? state.lockedBalls + 1 : state.lockedBalls;
    return {
      ...award(state, canLock ? eventScores.lockEnter : 0),
      locks: nextLockedBalls,
      lockedBalls: nextLockedBalls,
      message: !isQualified
        ? "Saucer award. Complete SOCIAL to light lock."
        : canLock
          ? `Ball lock ${nextLockedBalls}/2.`
          : "Lock is already full."
    };
  }

  if (event.type === "lockHeld") {
    return state;
  }

  if (event.type === "lockEject") {
    return state;
  }

  if (event.type === "rampMade") {
    return {
      ...award(state, eventScores.rampMade),
      bonus: state.bonus + 200,
      message: "Left ramp."
    };
  }

  if (event.type === "orbitMade") {
    return {
      ...award(state, eventScores.orbitMade),
      bonus: state.bonus + 150,
      message: "Orbit."
    };
  }

  if (event.type === "launch") {
    return {
      ...state,
      message: "Ball launched. Aim for the skill shot."
    };
  }

  if (event.type === "skillShot" && state.skillShotOpen) {
    return {
      ...award(state, eventScores.skillShot),
      skillShotOpen: false,
      bonus: state.bonus + 1000,
      message: "Skill shot."
    };
  }

  if (event.type === "skillShot") {
    return state;
  }

  if (event.type === "lane") {
    return {
      ...award(state, eventScores.lane),
      skillShotOpen: false,
      bonus: state.bonus + 100,
      message: "Lane award."
    };
  }

  if (event.type === "bumper") {
    return {
      ...award(state, eventScores.bumper),
      bonus: state.bonus + 25,
      message: "Bumper."
    };
  }

  if (event.type === "sling") {
    return {
      ...award(state, eventScores.sling),
      message: `${event.side === "left" ? "Left" : "Right"} sling.`
    };
  }

  return state;
};

const award = (state: GameState, points: number): GameState => ({
  ...state,
  score: state.score + points
});

const drainBall = (state: GameState, quickDrain = false): GameState => {
  if (quickDrain && state.ballSaveAvailable) {
    return {
      ...state,
      bonus: 0,
      plungerCharge: 0,
      skillShotOpen: true,
      ballSaveAvailable: false,
      message: `Ball ${state.ball} saved. Launch again.`
    };
  }

  const bonus = state.tilted ? 0 : state.bonus;
  if (state.ball >= maxBalls) {
    return {
      ...state,
      phase: "gameOver",
      score: state.score + bonus,
      bonus: 0,
      plungerCharge: 0,
      ballSaveAvailable: false,
      message: `Game over. Final score ${state.score + bonus}.`
    };
  }

  return {
    ...state,
    score: state.score + bonus,
    ball: state.ball + 1,
    bonus: 0,
    tilted: false,
    tiltWarnings: 0,
    plungerCharge: 0,
    skillShotOpen: true,
    lockedBalls: state.lockedBalls,
    ballSaveAvailable: true,
    message: `Ball ${state.ball + 1} ready.`
  };
};

export const toHudState = (state: GameState) => ({
  phase: state.phase,
  score: state.score,
  ball: state.ball,
  message: state.message,
  targets: state.targets,
  locks: state.locks,
  tiltWarnings: state.tiltWarnings,
  plungerCharge: state.plungerCharge
});
