"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent
} from "react";
import { createPinballScene, type PinballScene } from "./render";
import { PinballPhysics, type PhysicsSnapshot } from "./physics";
import {
  actionForKey,
  emptyActionState,
  setAction,
  shouldPreventBrowserDefault
} from "./input";
import {
  applyTableEvent,
  createInitialGameState,
  setPlungerCharge,
  startGame,
  toHudState
} from "./rules";
import type { ActionState, GameAction, GameState, HudState } from "./types";

export function VibePinballGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<PinballScene | null>(null);
  const physicsRef = useRef<PinballPhysics | null>(null);
  const actionsRef = useRef<ActionState>(emptyActionState());
  const stateRef = useRef<GameState>(createInitialGameState());
  const lastSnapshotRef = useRef<PhysicsSnapshot | null>(null);
  const [hud, setHud] = useState<HudState>(toHudState(stateRef.current));
  const [actions, setActionsView] = useState<ActionState>(actionsRef.current);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let frame = 0;
    let lastTime = performance.now();
    let mounted = true;
    const scene = createPinballScene(canvas);
    sceneRef.current = scene;

    const resize = () => scene.resize();
    window.addEventListener("resize", resize);

    PinballPhysics.create().then((physics) => {
      if (!mounted) {
        return;
      }

      physicsRef.current = physics;
      lastSnapshotRef.current = physics.step(actionsRef.current, 0, true);

      const loop = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        const current = stateRef.current;
        const snapshot = physics.step(
          actionsRef.current,
          current.phase === "playing" ? dt : 0,
          current.phase === "playing" && !current.tilted
        );
        lastSnapshotRef.current = snapshot;

        if (current.phase === "playing") {
          let nextState = setPlungerCharge(current, snapshot.plungerCharge);
          for (const event of snapshot.events) {
            nextState = applyTableEvent(nextState, event);
          }
          stateRef.current = nextState;
          setHud(toHudState(nextState));
        }

        scene.render(snapshot);
        frame = requestAnimationFrame(loop);
      };

      frame = requestAnimationFrame(loop);
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    const setPressed = (event: KeyboardEvent, pressed: boolean) => {
      const action = actionForKey(event.code);
      if (shouldPreventBrowserDefault(event.code)) {
        event.preventDefault();
      }

      if (!action) {
        if (pressed && event.code === "Enter") {
          startOrRestart();
        }
        return;
      }

      updateAction(action, pressed);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.repeat) {
        setPressed(event, true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => setPressed(event, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  const updateAction = (action: GameAction, pressed: boolean) => {
    actionsRef.current = setAction(actionsRef.current, action, pressed);
    setActionsView(actionsRef.current);
  };

  const startOrRestart = () => {
    stateRef.current = startGame();
    setHud(toHudState(stateRef.current));
    physicsRef.current?.resetBall();
  };

  const bindHold = (action: GameAction) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      updateAction(action, true);
    },
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.releasePointerCapture(event.pointerId);
      updateAction(action, false);
    },
    onPointerCancel: () => updateAction(action, false),
    onPointerLeave: () => updateAction(action, false),
    onMouseDown: (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      updateAction(action, true);
    },
    onMouseUp: () => updateAction(action, false),
    onTouchStart: (event: TouchEvent<HTMLButtonElement>) => {
      event.preventDefault();
      updateAction(action, true);
    },
    onTouchEnd: () => updateAction(action, false),
    onTouchCancel: () => updateAction(action, false)
  });

  return (
    <main className="game-shell" aria-label="Silverball Social pinball table">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        data-testid="pinball-canvas"
        aria-label="3D Silverball Social playfield"
      />

      <section className="hud" aria-live="polite">
        <div className="dmd">
          <p className="score">{hud.score.toLocaleString("en-US")}</p>
          <div className="message">{hud.message}</div>
        </div>
        <div className="status-grid" aria-label="Game status">
          <div className="status-pill">
            <span>Ball</span>
            {hud.ball}/3
          </div>
          <div className="status-pill">
            <span>Targets</span>
            {hud.targets}/3
          </div>
          <div className="status-pill">
            <span>Tilt</span>
            {hud.tiltWarnings}/2
          </div>
          <div className="status-pill">
            <span>Launch</span>
            {Math.round(hud.plungerCharge * 100)}%
          </div>
        </div>
      </section>

      <div className="keyboard-help">
        Shift or A/L for flippers. Hold Space for plunger. Arrow keys nudge. Enter starts or restarts.
      </div>

      <section className="controls" aria-label="Pinball controls">
        <button
          className="control-button flipper"
          type="button"
          aria-pressed={actions.leftFlipper}
          {...bindHold("leftFlipper")}
        >
          Left
        </button>
        <button
          className="control-button"
          type="button"
          aria-pressed={actions.nudgeLeft}
          {...bindHold("nudgeLeft")}
        >
          Nudge L
        </button>
        <button
          className="start-button"
          type="button"
          onClick={startOrRestart}
        >
          {hud.phase === "gameOver" ? "Restart" : "Start"}
        </button>
        <button
          className="control-button"
          type="button"
          aria-pressed={actions.plunger}
          {...bindHold("plunger")}
        >
          Launch
        </button>
        <button
          className="control-button flipper"
          type="button"
          aria-pressed={actions.rightFlipper}
          {...bindHold("rightFlipper")}
        >
          Right
        </button>
      </section>
    </main>
  );
}
