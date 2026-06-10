import { describe, expect, it } from "vitest";
import { silverballSocialBlueprint } from "../src/game/tableBlueprint";

const blueprint = silverballSocialBlueprint;

describe("Silverball Social physical board blueprint", () => {
  it("uses the measured real-machine scale from the GDD", () => {
    expect(blueprint.scale.inchesPerUnit).toBe(2.5);
    expect(blueprint.scale.playfieldWidth).toBeCloseTo(8.1);
    expect(blueprint.scale.playfieldLength).toBeCloseTo(16.8);
    expect(blueprint.scale.ballRadius).toBeCloseTo(0.2125);
  });

  it("contains the lower playfield devices required by the reference-board acceptance criteria", () => {
    expect(blueprint.flippers).toHaveLength(2);
    expect(blueprint.slings).toHaveLength(2);
    expect(blueprint.lanes.filter((lane) => lane.id.includes("lower"))).toHaveLength(4);
    expect(blueprint.laneWalls.filter((segment) => segment.id.includes("lane.lower"))).toHaveLength(8);
  });

  it("includes rollover wire switches and flipper return hardware", () => {
    expect(blueprint.rolloverWires).toHaveLength(blueprint.lanes.length);
    expect(blueprint.rolloverWires.every((wire) => wire.kind === "wire")).toBe(true);
    expect(blueprint.flipperStops.map((stop) => stop.id)).toEqual(
      expect.arrayContaining([
        "flipper.left.return-stop",
        "flipper.left.end-rubber",
        "flipper.right.return-stop",
        "flipper.right.end-rubber"
      ])
    );
    expect(blueprint.flipperStops.every((stop) => stop.kind === "rubber")).toBe(true);
  });

  it("models slingshots as triangular rubber assemblies with lit inserts and active normals", () => {
    const postIds = new Set(blueprint.posts.map((post) => post.id));

    for (const sling of blueprint.slings) {
      const triangleArea = Math.abs(
        (sling.triangle.outerX * (sling.triangle.innerZ - sling.triangle.noseZ)
          + sling.triangle.innerX * (sling.triangle.noseZ - sling.triangle.outerZ)
          + sling.triangle.noseX * (sling.triangle.outerZ - sling.triangle.innerZ)) / 2
      );
      const normalLength = Math.hypot(sling.impulseNormalX, sling.impulseNormalZ);

      expect(triangleArea).toBeGreaterThan(0.35);
      expect(sling.rubberFace.id).toBe(`${sling.id}.rubber-face`);
      expect(sling.rubberFace.kind).toBe("rubber");
      expect(sling.lamp.id).toBe(`insert.${sling.id}`);
      expect(sling.lamp.shape).toBe("circle");
      expect(normalLength).toBeCloseTo(1, 1);
      expect(sling.impulseNormalZ).toBeLessThan(0);
      for (const id of sling.postIds) {
        expect(postIds.has(id), id).toBe(true);
      }
    }
  });

  it("contains three top lanes, three pop bumpers, five targets, lock saucer, ramp, and orbit return", () => {
    expect(blueprint.lanes.filter((lane) => lane.id.startsWith("lane.top"))).toHaveLength(3);
    expect(blueprint.laneWalls.filter((segment) => segment.id.startsWith("lane.top"))).toHaveLength(6);
    expect(blueprint.bumpers).toHaveLength(3);
    expect(blueprint.targets).toHaveLength(5);
    expect(blueprint.saucers.map((saucer) => saucer.id)).toContain("lock.saucer");
    expect(blueprint.ramps.map((ramp) => ramp.id)).toContain("ramp.left");
    expect(blueprint.orbits.map((orbit) => orbit.id)).toEqual(["orbit.left", "orbit.right"]);
    expect(blueprint.wireforms.map((wireform) => wireform.id)).toContain("wireform.right-orbit-return");
  });

  it("uses segmented orbit wall chains and upper gates for the orbit paths", () => {
    for (const orbit of blueprint.orbits) {
      expect(orbit.wallIds.length).toBeGreaterThanOrEqual(6);
      for (const wallId of orbit.wallIds) {
        expect(blueprint.laneWalls.some((segment) => segment.id === wallId), wallId).toBe(true);
      }
    }

    expect(blueprint.handoffs.map((handoff) => handoff.id)).toContain("handoff.upper-orbit-gates");
  });

  it("models pop bumpers with separate skirts and caps", () => {
    for (const bumper of blueprint.bumpers) {
      expect(bumper.skirtRadius).toBeGreaterThan(bumper.capRadius);
      expect(bumper.radius).toBeGreaterThanOrEqual(bumper.skirtRadius);
    }
  });

  it("models each standup target with a rear stop and face decal color", () => {
    for (const target of blueprint.targets) {
      expect(target.rearStop.id).toBe(`${target.id}.rear-stop`);
      expect(target.rearStop.kind).toBe("rubber");
      expect(target.rearStop.depth).toBeGreaterThan(0);
      expect(target.decalColor).toBeGreaterThan(0);
    }
  });

  it("defines drain, trough, and orbit sensors as real physical devices", () => {
    expect(blueprint.drain.id).toBe("drain.center");
    expect(blueprint.drain.radius).toBeGreaterThan(blueprint.scale.ballRadius * 2);

    for (const orbit of blueprint.orbits) {
      expect(orbit.entry.id).toContain("entry");
      expect(orbit.exit.id).toContain("exit");
      expect(orbit.wallIds.length).toBeGreaterThanOrEqual(6);
      expect(blueprint.wireforms.some((wireform) => wireform.id === orbit.returnWireformId)).toBe(true);
    }
  });

  it("includes layered plastics and shooter hardware from the physical reference", () => {
    expect(blueprint.plastics.length).toBeGreaterThanOrEqual(6);
    expect(blueprint.plastics.every((cover) => cover.layerY >= 0.45)).toBe(true);
    expect(blueprint.plunger.id).toBe("shooter.plunger");
    expect(blueprint.plunger.rodLength).toBeGreaterThan(1);
    expect(blueprint.plunger.gate.id).toBe("shooter.one-way-gate");
  });

  it("models the lock saucer with bowl walls, entry posts, hold point, and eject vector", () => {
    const saucer = blueprint.saucers.find((item) => item.id === "lock.saucer");
    expect(saucer).toBeDefined();
    expect(saucer?.walls.length).toBeGreaterThanOrEqual(4);
    expect(saucer?.posts.length).toBeGreaterThanOrEqual(2);
    expect(saucer?.holdX).toBeCloseTo(saucer?.x ?? 0);
    expect(saucer?.holdZ).toBeCloseTo(saucer?.z ?? 0);
    expect(saucer?.ejectStrength).toBeGreaterThan(1);
  });

  it("defines lamp inserts and ramp handoff hardware as authored board details", () => {
    expect(blueprint.lampInserts.length).toBeGreaterThanOrEqual(12);
    expect(blueprint.lampInserts.map((insert) => insert.id)).toEqual(
      expect.arrayContaining([
        "insert.left-ramp-arrow",
        "insert.right-orbit-arrow",
        "insert.lock-ready",
        "insert.skill-shot"
      ])
    );
    expect(blueprint.handoffs.map((handoff) => handoff.id)).toEqual(
      expect.arrayContaining([
        "handoff.ramp-left-entry",
        "handoff.ramp-left-exit",
        "handoff.right-orbit-exit"
      ])
    );
    expect(blueprint.handoffs.flatMap((handoff) => handoff.segments).every((segment) => segment.kind !== "plastic")).toBe(true);
  });

  it("keeps lane clearances compatible with the physical ball radius", () => {
    const minClearance = blueprint.scale.ballRadius * 2 * 1.35;
    const maxClearance = blueprint.scale.ballRadius * 2 * 2.5;

    for (const lane of blueprint.lanes) {
      expect(lane.clearance).toBeGreaterThanOrEqual(minClearance);
      expect(lane.clearance).toBeLessThanOrEqual(maxClearance);
    }
  });

  it("defines shot paths with stable device ids present in the blueprint", () => {
    const deviceIds = new Set([
      ...blueprint.boundaries.map((item) => item.id),
      ...blueprint.laneWalls.map((item) => item.id),
      ...blueprint.rolloverWires.map((item) => item.id),
      ...blueprint.flipperStops.map((item) => item.id),
      ...blueprint.lanes.map((item) => item.id),
      ...blueprint.targets.map((item) => item.id),
      ...blueprint.targets.map((item) => item.rearStop.id),
      ...blueprint.saucers.map((item) => item.id),
      ...blueprint.saucers.flatMap((saucer) => [
        ...saucer.walls.map((segment) => segment.id),
        ...saucer.posts.map((post) => post.id)
      ]),
      ...blueprint.ramps.flatMap((ramp) => [ramp.id, ramp.entry.id, ramp.exit.id]),
      ...blueprint.handoffs.flatMap((handoff) => [handoff.id, ...handoff.segments.map((segment) => segment.id)]),
      ...blueprint.wireforms.flatMap((wireform) => [wireform.id, wireform.exit.id]),
      ...blueprint.orbits.flatMap((orbit) => [orbit.id, orbit.entry.id, orbit.exit.id]),
      ...blueprint.plastics.map((item) => item.id),
      ...blueprint.lampInserts.map((item) => item.id),
      blueprint.plunger.id,
      blueprint.plunger.gate.id,
      ...blueprint.bumpers.map((item) => item.id)
    ]);

    for (const shot of blueprint.shots) {
      expect(shot.deviceIds.length).toBeGreaterThan(0);
      for (const id of shot.deviceIds) {
        expect(deviceIds.has(id), `${shot.id} references ${id}`).toBe(true);
      }
    }
  });
});
