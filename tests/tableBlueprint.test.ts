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

  it("models the playfield deck slope and gravity as authored physical attributes", () => {
    expect(blueprint.playfield.id).toBe("playfield.deck");
    expect(blueprint.playfield.width).toBeGreaterThanOrEqual(blueprint.scale.playfieldWidth);
    expect(blueprint.playfield.width).toBeLessThanOrEqual(blueprint.scale.playfieldWidth + 0.2);
    expect(blueprint.playfield.depth).toBeGreaterThan(blueprint.scale.playfieldLength * 0.85);
    expect(blueprint.playfield.depth).toBeLessThanOrEqual(blueprint.scale.playfieldLength);
    expect(blueprint.playfield.thickness).toBeGreaterThan(0.1);
    expect(blueprint.playfield.surfaceY).toBe(0);
    expect(blueprint.playfield.slopeAngle).toBeGreaterThan(0.04);
    expect(blueprint.playfield.slopeAngle).toBeLessThan(0.12);
    expect(blueprint.playfield.gravity.z).toBeGreaterThan(0);
    expect(blueprint.playfield.gravity.y).toBe(0);
    expect(Math.hypot(blueprint.playfield.gravity.x, blueprint.playfield.gravity.z)).toBeGreaterThan(8);
    expect(blueprint.playfield.woodColor).toBeGreaterThan(0);
  });

  it("models playfield boundary rails as mounted hardware", () => {
    expect(blueprint.boundaries).toHaveLength(15);
    expect(blueprint.boundaries.every((segment) => segment.fasteners.length === 2)).toBe(true);

    for (const segment of blueprint.boundaries) {
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.032), segment.id).toBe(true);
      for (const fastener of segment.fasteners) {
        expect(
          Math.hypot(fastener.x - segment.x, fastener.z - segment.z),
          fastener.id
        ).toBeLessThanOrEqual(Math.max(segment.width, segment.depth) / 2);
      }
    }
  });

  it("models cabinet rails, glass rim, and lockdown bar as authored hardware", () => {
    expect(blueprint.cabinet.body.id).toBe("cabinet.body");
    expect(blueprint.cabinet.backbox.id).toBe("cabinet.backbox");
    expect(blueprint.cabinet.sideRails.map((rail) => rail.id)).toEqual(
      expect.arrayContaining(["cabinet.left-side-rail", "cabinet.right-side-rail"])
    );
    expect(blueprint.cabinet.glassRims.map((rim) => rim.id)).toEqual(
      expect.arrayContaining(["cabinet.left-glass-rim", "cabinet.right-glass-rim"])
    );
    expect(blueprint.cabinet.glassPanel.id).toBe("cabinet.playfield-glass");
    expect(blueprint.cabinet.glassPanel.kind).toBe("glass");
    expect(blueprint.cabinet.glassPanel.width).toBeGreaterThan(blueprint.scale.playfieldWidth * 0.88);
    expect(blueprint.cabinet.glassPanel.depth).toBeGreaterThan(blueprint.scale.playfieldLength * 0.85);
    expect(blueprint.cabinet.glassPanel.y).toBeGreaterThan(0.8);
    expect(blueprint.cabinet.glassPanel.opacity).toBeLessThanOrEqual(0.05);
    expect(blueprint.cabinet.lockdownBar.id).toBe("cabinet.lockdown-bar");
    expect(blueprint.cabinet.sideRails.every((rail) => rail.depth > blueprint.scale.playfieldLength * 0.9)).toBe(true);
    expect(blueprint.cabinet.glassRims.every((rim) => rim.depth > blueprint.scale.playfieldLength * 0.85)).toBe(true);
    expect(blueprint.cabinet.lockdownBar.width).toBeGreaterThan(blueprint.scale.playfieldWidth * 0.55);
    expect(blueprint.cabinet.fasteners).toHaveLength(18);
    expect(blueprint.cabinet.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.cabinet.fasteners.every((fastener) => fastener.radius > 0.03)).toBe(true);
    expect(blueprint.cabinet.fasteners.filter((fastener) => fastener.targetId.endsWith("side-rail"))).toHaveLength(8);
    expect(blueprint.cabinet.fasteners.filter((fastener) => fastener.targetId.endsWith("glass-rim"))).toHaveLength(6);
    expect(blueprint.cabinet.fasteners.filter((fastener) => fastener.targetId === "cabinet.lockdown-bar")).toHaveLength(4);
    expect(new Set(blueprint.cabinet.fasteners.map((fastener) => fastener.targetId))).toEqual(
      new Set([
        "cabinet.left-side-rail",
        "cabinet.right-side-rail",
        "cabinet.left-glass-rim",
        "cabinet.right-glass-rim",
        "cabinet.lockdown-bar"
      ])
    );
    expect(blueprint.cabinet.fasteners.every((fastener) => fastener.y > 0.6 && fastener.y < 0.95)).toBe(true);
    expect(blueprint.cabinet.dmdPanel.id).toBe("cabinet.dmd-panel");
    expect(blueprint.cabinet.dmdPanel.label).toBe("SILVERBALL SOCIAL");
    expect(blueprint.cabinet.speakerGrilles.map((grille) => grille.id)).toEqual(
      expect.arrayContaining(["cabinet.left-speaker-grille", "cabinet.right-speaker-grille"])
    );
    expect(blueprint.cabinet.speakerGrilles.every((grille) => grille.holeCount >= 6)).toBe(true);
    expect(blueprint.cabinet.speakerGrilles.every((grille) => grille.fasteners.length === 4)).toBe(true);
    for (const grille of blueprint.cabinet.speakerGrilles) {
      expect(grille.fasteners.every((fastener) => fastener.id.startsWith(`${grille.id}.screw-`)), grille.id).toBe(true);
      expect(grille.fasteners.every((fastener) => fastener.targetId === grille.id), grille.id).toBe(true);
      expect(grille.fasteners.every((fastener) => fastener.kind === "metal"), grille.id).toBe(true);
      expect(grille.fasteners.every((fastener) => fastener.radius >= 0.035), grille.id).toBe(true);
      for (const fastener of grille.fasteners) {
        expect(Math.abs(fastener.x - grille.x), fastener.id).toBeLessThanOrEqual(grille.width / 2);
        expect(Math.abs(fastener.y - grille.y), fastener.id).toBeLessThanOrEqual(grille.height / 2);
        expect(fastener.z, fastener.id).toBeGreaterThan(grille.z);
      }
    }
  });

  it("contains the lower playfield devices required by the reference-board acceptance criteria", () => {
    expect(blueprint.flippers).toHaveLength(2);
    expect(blueprint.slings).toHaveLength(2);
    expect(blueprint.lanes.filter((lane) => lane.id.includes("lower"))).toHaveLength(4);
    expect(blueprint.laneWalls.filter((segment) => segment.id.includes("lane.lower"))).toHaveLength(8);
    expect(blueprint.rubberBands.filter((band) => band.id.includes("lane.lower"))).toHaveLength(4);
  });

  it("models lane wall rails as mounted hardware", () => {
    expect(blueprint.laneWalls).toHaveLength(28);
    expect(blueprint.laneWalls.every((segment) => segment.fasteners.length === 2)).toBe(true);
    expect(blueprint.laneWalls.filter((segment) => segment.kind === "rubber")).toHaveLength(8);
    expect(blueprint.laneWalls.filter((segment) => segment.kind === "metal")).toHaveLength(20);

    for (const segment of blueprint.laneWalls) {
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.028), segment.id).toBe(true);
      for (const fastener of segment.fasteners) {
        expect(
          Math.hypot(fastener.x - segment.x, fastener.z - segment.z),
          fastener.id
        ).toBeLessThanOrEqual(Math.max(segment.width, segment.depth) / 2);
      }
    }
  });

  it("ties the lower inlanes and outlanes to authored rubber guide posts and bands", () => {
    const postById = new Map(blueprint.posts.map((post) => [post.id, post]));
    const bandById = new Map(blueprint.rubberBands.map((band) => [band.id, band]));
    const lowerLanes = blueprint.lanes.filter((lane) => lane.id.startsWith("lane.lower"));

    for (const lane of lowerLanes) {
      expect(lane.guidePostIds?.length, lane.id).toBeGreaterThanOrEqual(2);
      expect(lane.rubberBandIds, lane.id).toHaveLength(1);

      for (const id of lane.guidePostIds ?? []) {
        const post = postById.get(id);
        expect(post, `${lane.id} references ${id}`).toBeDefined();
        expect(post?.kind).toBe("rubber");
        expect(Math.abs((post?.z ?? 0) - lane.z)).toBeLessThan(1.6);
      }

      for (const id of lane.rubberBandIds ?? []) {
        const band = bandById.get(id);
        expect(band, `${lane.id} references ${id}`).toBeDefined();
        expect(band?.kind).toBe("rubber");
        expect(lane.guidePostIds).toContain(band?.startPostId);
        expect(lane.guidePostIds).toContain(band?.endPostId);
        expect(band?.width).toBeLessThanOrEqual(0.08);
        expect(band?.depth).toBeGreaterThan(blueprint.scale.ballRadius * 2.5);
      }
    }
  });

  it("models each lower lane mouth with an authored plastic guide cover", () => {
    const lowerLanes = blueprint.lanes.filter((lane) => lane.id.startsWith("lane.lower"));

    expect(lowerLanes).toHaveLength(4);

    for (const lane of lowerLanes) {
      const cover = lane.guideCover;

      expect(cover?.id).toBe(`${lane.id}.guide-cover`);
      expect(cover?.width).toBeGreaterThan(0.5);
      expect(cover?.depth).toBeGreaterThan(0.7);
      expect(cover?.layerY).toBeGreaterThan(0.45);
      expect(cover?.layerY).toBeLessThanOrEqual(0.62);
      expect(Math.abs((cover?.x ?? 0) - lane.x)).toBeLessThan(0.18);
      expect(Math.abs((cover?.z ?? 0) - lane.z)).toBeLessThan(0.7);
      expect(cover?.fasteners).toHaveLength(2);
      expect(cover?.fasteners.every((fastener) => fastener.id.startsWith(`${lane.id}.guide-cover.screw-`))).toBe(true);
      expect(cover?.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(cover?.fasteners.every((fastener) => fastener.radius > 0)).toBe(true);
    }
  });

  it("models exposed rubber posts with metal washer caps", () => {
    const rubberPosts = blueprint.posts.filter((post) => post.kind === "rubber");

    expect(rubberPosts.length).toBeGreaterThan(20);

    for (const post of rubberPosts) {
      expect(post.cap?.id).toBe(`${post.id}.cap`);
      expect(post.cap?.kind).toBe("metal");
      expect(post.cap?.radius).toBeGreaterThan(post.radius);
      expect(post.cap?.height).toBeGreaterThan(0);
    }
  });

  it("includes rollover wire switches and flipper return hardware", () => {
    expect(blueprint.rolloverWires).toHaveLength(blueprint.lanes.length);
    expect(blueprint.rolloverWires.every((wire) => wire.kind === "wire")).toBe(true);
    expect(blueprint.rolloverWires.every((wire) => wire.fasteners.length === 2)).toBe(true);
    for (const wire of blueprint.rolloverWires) {
      expect(wire.fasteners.every((fastener) => fastener.id.startsWith(`${wire.id}.screw-`)), wire.id).toBe(true);
      expect(wire.fasteners.every((fastener) => fastener.targetId === wire.id), wire.id).toBe(true);
      expect(wire.fasteners.every((fastener) => fastener.kind === "metal"), wire.id).toBe(true);
      expect(wire.fasteners.every((fastener) => fastener.radius >= 0.028), wire.id).toBe(true);
      for (const fastener of wire.fasteners) {
        expect(Math.hypot(fastener.x - wire.x, fastener.z - wire.z), fastener.id).toBeLessThanOrEqual(wire.width / 2);
      }
    }
    expect(blueprint.flipperStops.map((stop) => stop.id)).toEqual(
      expect.arrayContaining([
        "flipper.left.return-stop",
        "flipper.left.end-rubber",
        "flipper.right.return-stop",
        "flipper.right.end-rubber"
      ])
    );
    expect(blueprint.flipperStops.every((stop) => stop.kind === "rubber")).toBe(true);
    expect(blueprint.flipperStops.every((stop) => stop.fasteners.length === 2)).toBe(true);
    for (const stop of blueprint.flipperStops) {
      expect(stop.fasteners.every((fastener) => fastener.id.startsWith(`${stop.id}.screw-`)), stop.id).toBe(true);
      expect(stop.fasteners.every((fastener) => fastener.targetId === stop.id), stop.id).toBe(true);
      expect(stop.fasteners.every((fastener) => fastener.kind === "metal"), stop.id).toBe(true);
      expect(stop.fasteners.every((fastener) => fastener.radius >= 0.03), stop.id).toBe(true);
      for (const fastener of stop.fasteners) {
        expect(Math.hypot(fastener.x - stop.x, fastener.z - stop.z), fastener.id).toBeLessThan(0.18);
      }
    }
  });

  it("models flippers as blueprint-authored capsule-like bat hardware", () => {
    for (const flipper of blueprint.flippers) {
      expect(flipper.length).toBeCloseTo(1.2);
      expect(flipper.batRadius).toBeGreaterThan(blueprint.scale.ballRadius * 0.65);
      expect(flipper.batRadius).toBeLessThan(blueprint.scale.ballRadius);
      expect(flipper.pivotRadius).toBeGreaterThanOrEqual(flipper.batRadius);
      expect(flipper.rubberWidth).toBeGreaterThan(0.08);
      expect(flipper.rubberWidth).toBeLessThan(flipper.batRadius);
      expect(flipper.rubberSleeve.id).toBe(`${flipper.id}.rubber-sleeve`);
      expect(flipper.rubberSleeve.kind).toBe("rubber");
      expect(flipper.rubberSleeve.radius).toBeCloseTo(flipper.batRadius);
      expect(flipper.rubberSleeve.length).toBeCloseTo(flipper.length);
      expect(flipper.rubberSleeve.thickness).toBeCloseTo(flipper.rubberWidth);
      expect(flipper.rubberSleeve.localX).toBeCloseTo(flipper.length / 2);
      expect(flipper.rubberSleeve.color).toBeGreaterThan(0);
      expect(flipper.pivotCap.id).toBe(`${flipper.id}.pivot-cap`);
      expect(flipper.pivotCap.kind).toBe("metal");
      expect(flipper.pivotCap.radius).toBeGreaterThan(flipper.pivotRadius);
      expect(flipper.pivotCap.height).toBeGreaterThan(0);
      expect(flipper.batFasteners).toHaveLength(2);
      expect(flipper.batFasteners.every((fastener) => fastener.id.startsWith(`${flipper.id}.bat-screw-`))).toBe(true);
      expect(flipper.batFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(flipper.batFasteners.every((fastener) => fastener.radius > 0.03)).toBe(true);
      expect(flipper.batFasteners.every((fastener) => fastener.localX > flipper.pivotRadius)).toBe(true);
      expect(flipper.batFasteners.every((fastener) => fastener.localX < flipper.length)).toBe(true);
      expect(flipper.batFasteners.every((fastener) => Math.abs(fastener.localZ) < flipper.batRadius)).toBe(true);
      expect(Math.abs(flipper.activeAngle - flipper.restAngle)).toBeGreaterThan(0.7);
    }

    expect(blueprint.flippers.find((flipper) => flipper.side === "left")?.activeAngle).toBeGreaterThan(0);
    expect(blueprint.flippers.find((flipper) => flipper.side === "right")?.activeAngle).toBeLessThan(0);
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
      expect(sling.topPlastic.id).toBe(`${sling.id}.top-plastic`);
      expect(sling.topPlastic.layerY).toBeGreaterThan(0.58);
      expect(sling.topPlastic.thickness).toBeGreaterThan(0.03);
      expect(sling.topPlastic.color).toBe(0xffe6ac);
      expect(sling.topPlastic.fasteners).toHaveLength(3);
      expect(sling.lamp.id).toBe(`insert.${sling.id}`);
      expect(sling.lamp.shape).toBe("circle");
      expect(sling.lamp.lens.id).toBe(`${sling.lamp.id}.lens`);
      expect(sling.lamp.lens.targetId).toBe(sling.lamp.id);
      expect(sling.lamp.lens.kind).toBe("plastic");
      expect(sling.lamp.lens.radius).toBeGreaterThan(sling.lamp.radius);
      expect(normalLength).toBeCloseTo(1, 1);
      expect(sling.impulseNormalZ).toBeLessThan(0);
      for (const fastener of sling.topPlastic.fasteners) {
        expect(fastener.id.startsWith(`${sling.id}.top-plastic.screw-`), fastener.id).toBe(true);
        expect(fastener.kind).toBe("metal");
        expect(fastener.radius).toBeGreaterThanOrEqual(0.035);
        expect(Math.abs(fastener.z - sling.z), fastener.id).toBeLessThan(0.55);
      }
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

  it("uses segmented top arch and shooter wrap guides instead of one straight arch", () => {
    const topArchSegments = blueprint.boundaries.filter((segment) => segment.id.startsWith("boundary.top-arch"));
    const shooterArchSegments = blueprint.boundaries.filter((segment) =>
      segment.id.startsWith("boundary.shooter-arch")
    );
    const skillShot = blueprint.shots.find((shot) => shot.id === "shot.skill-shot");

    expect(topArchSegments).toHaveLength(3);
    expect(topArchSegments.some((segment) => segment.id === "boundary.top-arch.center")).toBe(true);
    expect(topArchSegments.filter((segment) => segment.angle !== undefined)).toHaveLength(2);
    expect(shooterArchSegments).toHaveLength(3);
    expect(shooterArchSegments.every((segment) => segment.kind === "metal")).toBe(true);
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-orbit")?.deviceIds).toEqual(
      expect.arrayContaining([
        "boundary.top-arch.left-curve",
        "boundary.top-arch.center",
        "boundary.top-arch.right-curve"
      ])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.right-orbit")?.deviceIds).toEqual(
      expect.arrayContaining([
        "boundary.top-arch.left-curve",
        "boundary.top-arch.center",
        "boundary.top-arch.right-curve"
      ])
    );
    expect(skillShot?.deviceIds).toEqual(
      expect.arrayContaining([
        "boundary.shooter-arch.top",
        "boundary.top-arch.right-curve",
        "lane.top.right",
        "rollover.top.right",
        "lane.top.right.guide-cover",
        "lane.top.right.rubber-band",
        "lane.shooter.skill.guide-cover",
        "lane.shooter.skill.rubber-band",
        "insert.skill-shot"
      ])
    );
  });

  it("ties the top rollover lanes to authored rubber guide posts and bands", () => {
    const postById = new Map(blueprint.posts.map((post) => [post.id, post]));
    const bandById = new Map(blueprint.rubberBands.map((band) => [band.id, band]));
    const topLanes = blueprint.lanes.filter((lane) => lane.side === "top");

    for (const lane of topLanes) {
      expect(lane.guidePostIds?.length, lane.id).toBeGreaterThanOrEqual(2);
      expect(lane.rubberBandIds, lane.id).toHaveLength(1);

      for (const id of lane.guidePostIds ?? []) {
        const post = postById.get(id);
        expect(post, `${lane.id} references ${id}`).toBeDefined();
        expect(post?.kind).toBe("rubber");
        expect(Math.abs((post?.z ?? 0) - lane.z)).toBeLessThan(0.8);
      }

      for (const id of lane.rubberBandIds ?? []) {
        const band = bandById.get(id);
        expect(band, `${lane.id} references ${id}`).toBeDefined();
        expect(band?.kind).toBe("rubber");
        expect(lane.guidePostIds).toContain(band?.startPostId);
        expect(lane.guidePostIds).toContain(band?.endPostId);
        expect(band?.width).toBeLessThanOrEqual(0.06);
        expect(band?.depth).toBeGreaterThan(blueprint.scale.ballRadius * 2.5);
      }
    }

    expect(blueprint.shots.find((shot) => shot.id === "shot.left-orbit")?.deviceIds).toEqual(
      expect.arrayContaining([
        "lane.top.left",
        "rollover.top.left",
        "lane.top.left.guide-cover",
        "lane.top.left.rubber-band"
      ])
    );
  });

  it("models each upper rollover and skill lane with an authored plastic guide cover", () => {
    const topLanes = blueprint.lanes.filter((lane) => lane.side === "top");

    expect(topLanes).toHaveLength(4);

    for (const lane of topLanes) {
      const cover = lane.guideCover;

      expect(cover?.id).toBe(`${lane.id}.guide-cover`);
      expect(cover?.width).toBeGreaterThan(0.5);
      expect(cover?.depth).toBeGreaterThan(0.4);
      expect(cover?.layerY).toBeGreaterThanOrEqual(0.64);
      expect(cover?.layerY).toBeLessThanOrEqual(0.68);
      expect(Math.abs((cover?.x ?? 0) - lane.x)).toBeLessThan(0.04);
      expect(Math.abs((cover?.z ?? 0) - lane.z)).toBeLessThan(0.5);
      expect(cover?.fasteners).toHaveLength(2);
      expect(cover?.fasteners.every((fastener) => fastener.id.startsWith(`${lane.id}.guide-cover.screw-`))).toBe(true);
      expect(cover?.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(cover?.fasteners.every((fastener) => fastener.radius > 0)).toBe(true);
    }
  });

  it("models the left ramp as raised hardware with rails, lip, and supports", () => {
    const ramp = blueprint.ramps.find((item) => item.id === "ramp.left");
    expect(ramp).toBeDefined();
    expect(ramp?.width).toBeGreaterThanOrEqual(0.85);
    expect(ramp?.width).toBeLessThanOrEqual(1.06);
    expect(ramp?.startY).toBeGreaterThanOrEqual(0.18);
    expect(ramp?.endY).toBeGreaterThan(ramp?.startY ?? 0);
    expect(ramp?.endY).toBeLessThanOrEqual(1.05);
    expect(ramp?.floorThickness).toBeGreaterThan(0);
    expect(ramp?.sideRailHeight).toBeGreaterThan(blueprint.scale.ballRadius * 1.5);
    expect(ramp?.sideRailOffset).toBeGreaterThan((ramp?.width ?? 0) / 2);
    expect(ramp?.sideWalls.map((wall) => wall.id)).toEqual([
      "ramp.left.side-wall.left",
      "ramp.left.side-wall.right"
    ]);
    for (const wall of ramp?.sideWalls ?? []) {
      expect(wall.targetId).toBe(ramp?.id);
      expect(wall.kind).toBe("plastic");
      expect(wall.width).toBeLessThan(0.08);
      expect(wall.depth).toBeGreaterThan((ramp?.depth ?? 0) * 0.9);
      expect(wall.height).toBeGreaterThan(blueprint.scale.ballRadius);
      expect(wall.height).toBeLessThan(ramp?.sideRailHeight ?? 1);
      expect(wall.startY).toBeGreaterThan(ramp?.startY ?? 0);
      expect(wall.endY).toBeGreaterThan(wall.startY);
      expect(wall.fasteners).toHaveLength(3);
      expect(wall.fasteners.every((fastener) => fastener.id.startsWith(`${wall.id}.rivet-`))).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.targetId === wall.id)).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.radius >= 0.022)).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.y > wall.startY)).toBe(true);
    }
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["ramp.left.side-wall.left", "ramp.left.side-wall.right"])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining((ramp?.sideWalls ?? []).flatMap((wall) => wall.fasteners.map((fastener) => fastener.id)))
    );
    expect(ramp?.sideRails.map((rail) => rail.id)).toEqual([
      "ramp.left.side-rail.left",
      "ramp.left.side-rail.right"
    ]);
    for (const rail of ramp?.sideRails ?? []) {
      expect(rail.targetId).toBe(ramp?.id);
      expect(rail.kind).toBe("metal");
      expect(rail.width).toBeGreaterThan(0.06);
      expect(rail.depth).toBeGreaterThan(ramp?.depth ?? 0);
      expect(rail.height).toBe(ramp?.sideRailHeight);
      expect(rail.startY).toBeGreaterThan(ramp?.startY ?? 0);
      expect(rail.endY).toBeGreaterThan(rail.startY);
      expect(rail.fasteners).toHaveLength(3);
      expect(rail.fasteners.every((fastener) => fastener.id.startsWith(`${rail.id}.clamp-`))).toBe(true);
      expect(rail.fasteners.every((fastener) => fastener.targetId === rail.id)).toBe(true);
      expect(rail.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(rail.fasteners.every((fastener) => fastener.radius >= 0.026)).toBe(true);
      expect(rail.fasteners.every((fastener) => fastener.y > rail.startY)).toBe(true);
      expect(rail.fasteners.every((fastener) => fastener.y > rail.endY || fastener.y < rail.endY + rail.height + 0.04)).toBe(true);
    }
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["ramp.left.side-rail.left", "ramp.left.side-rail.right"])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining((ramp?.sideRails ?? []).flatMap((rail) => rail.fasteners.map((fastener) => fastener.id)))
    );
    expect(ramp?.crossBraces).toHaveLength(3);
    expect(ramp?.crossBraces.map((brace) => brace.id)).toEqual([
      "ramp.left.cross-brace.lower",
      "ramp.left.cross-brace.mid",
      "ramp.left.cross-brace.upper"
    ]);
    for (const brace of ramp?.crossBraces ?? []) {
      expect(brace.targetId).toBe(ramp?.id);
      expect(brace.kind).toBe("metal");
      expect(brace.width).toBeGreaterThan((ramp?.width ?? 0));
      expect(brace.depth).toBeLessThan(0.12);
      expect(brace.y).toBeGreaterThanOrEqual(ramp?.startY ?? 0);
      expect(brace.y).toBeLessThanOrEqual((ramp?.endY ?? 0) + 0.08);
      expect(brace.pitch).toBeGreaterThan(0);
      expect(brace.fasteners).toHaveLength(2);
      expect(brace.fasteners.every((fastener) => fastener.id.startsWith(`${brace.id}.screw-`)), brace.id).toBe(true);
      expect(brace.fasteners.every((fastener) => fastener.targetId === brace.id), brace.id).toBe(true);
      expect(brace.fasteners.every((fastener) => fastener.kind === "metal"), brace.id).toBe(true);
      expect(brace.fasteners.every((fastener) => fastener.radius >= 0.024), brace.id).toBe(true);
      for (const fastener of brace.fasteners) {
        expect(Math.hypot(fastener.x - brace.x, fastener.z - brace.z), fastener.id).toBeLessThanOrEqual(brace.width / 2);
        expect(fastener.y, fastener.id).toBeGreaterThan(brace.y);
      }
    }
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["ramp.left.cross-brace.lower", "ramp.left.cross-brace.mid", "ramp.left.cross-brace.upper"])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining((ramp?.crossBraces ?? []).flatMap((brace) => brace.fasteners.map((fastener) => fastener.id)))
    );
    expect(ramp?.entranceLip.id).toBe("ramp.left.entrance-lip");
    expect(ramp?.entranceLip.kind).toBe("metal");
    expect(ramp?.entranceLip.fasteners).toHaveLength(2);
    expect(ramp?.entranceLip.fasteners.every((fastener) => fastener.id.startsWith(`${ramp?.entranceLip.id}.screw-`))).toBe(true);
    expect(ramp?.entranceLip.fasteners.every((fastener) => fastener.targetId === ramp?.entranceLip.id)).toBe(true);
    expect(ramp?.entranceLip.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(ramp?.entranceLip.fasteners.every((fastener) => fastener.radius >= 0.032)).toBe(true);
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["ramp.left", "ramp.left.entrance-lip"])
    );
    for (const fastener of ramp?.entranceLip.fasteners ?? []) {
      expect(
        Math.hypot(fastener.x - (ramp?.entranceLip.x ?? 0), fastener.z - (ramp?.entranceLip.z ?? 0)),
        fastener.id
      ).toBeLessThanOrEqual(Math.max(ramp?.entranceLip.width ?? 0, ramp?.entranceLip.depth ?? 0) / 2);
    }
    expect(ramp?.supports).toHaveLength(4);
    expect(ramp?.supports.every((support) => support.kind === "metal")).toBe(true);
    expect(ramp?.supports.every((support) => support.height >= (ramp?.startY ?? 0))).toBe(true);
    expect(ramp?.supports.every((support) => support.height <= (ramp?.endY ?? 0))).toBe(true);
    for (const support of ramp?.supports ?? []) {
      expect(support.cap.id).toBe(`${support.id}.cap`);
      expect(support.cap.kind).toBe("metal");
      expect(support.cap.radius).toBeGreaterThan(support.radius);
      expect(support.cap.height).toBeGreaterThan(0);
      expect(support.foot.id).toBe(`${support.id}.foot`);
      expect(support.foot.targetId).toBe(support.id);
      expect(support.foot.kind).toBe("metal");
      expect(support.foot.radius).toBeGreaterThan(support.radius * 2);
      expect(support.foot.height).toBeGreaterThan(0);
      expect(support.foot.fasteners).toHaveLength(2);
      expect(support.foot.fasteners.every((fastener) => fastener.id.startsWith(`${support.foot.id}.screw-`))).toBe(true);
      expect(support.foot.fasteners.every((fastener) => fastener.targetId === support.foot.id)).toBe(true);
      expect(support.foot.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(support.foot.fasteners.every((fastener) => fastener.radius >= 0.026)).toBe(true);
      expect(support.collar.id).toBe(`${support.id}.collar`);
      expect(support.collar.targetId).toBe(support.id);
      expect(support.collar.kind).toBe("metal");
      expect(support.collar.radius).toBeGreaterThan(support.radius);
      expect(support.collar.height).toBeGreaterThan(0);
      expect(support.collar.y).toBeGreaterThan(support.height - 0.08);
      expect(support.collar.y).toBeLessThanOrEqual(support.height);
      expect(support.saddle.id).toBe(`${support.id}.saddle`);
      expect(support.saddle.targetId).toBe(support.id);
      expect(support.saddle.kind).toBe("metal");
      expect(support.saddle.width).toBeGreaterThan(support.radius * 4);
      expect(support.saddle.depth).toBeGreaterThan(support.radius);
      expect(support.saddle.height).toBeGreaterThan(0);
      expect(support.saddle.y).toBeGreaterThanOrEqual(support.height);
      expect(support.saddle.fasteners).toHaveLength(2);
      expect(support.saddle.fasteners.every((fastener) => fastener.id.startsWith(`${support.saddle.id}.screw-`))).toBe(true);
      expect(support.saddle.fasteners.every((fastener) => fastener.targetId === support.saddle.id)).toBe(true);
      expect(support.saddle.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(support.saddle.fasteners.every((fastener) => fastener.radius >= 0.022)).toBe(true);
    }
  });

  it("uses segmented orbit wall chains and upper gates for the orbit paths", () => {
    for (const orbit of blueprint.orbits) {
      expect(orbit.wallIds.length).toBeGreaterThanOrEqual(6);
      for (const wallId of orbit.wallIds) {
        expect(blueprint.laneWalls.some((segment) => segment.id === wallId), wallId).toBe(true);
      }
    }

    const upperGates = blueprint.handoffs.find((handoff) => handoff.id === "handoff.upper-orbit-gates");
    expect(upperGates).toBeDefined();
    expect(upperGates?.segments).toHaveLength(2);
    expect(upperGates?.posts).toHaveLength(4);
    expect(upperGates?.posts?.every((post) => post.kind === "metal")).toBe(true);
    expect(upperGates?.posts?.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);
    expect(upperGates?.posts?.filter((post) => post.id.includes("hinge-post"))).toHaveLength(2);
    expect(upperGates?.posts?.filter((post) => post.id.includes("stop-post"))).toHaveLength(2);
    for (const segment of upperGates?.segments ?? []) {
      const gatePosts = (upperGates?.posts ?? []).filter((post) => post.id.startsWith(segment.id));
      expect(gatePosts, segment.id).toHaveLength(2);
      expect(gatePosts.some((post) => post.id.endsWith("hinge-post")), segment.id).toBe(true);
      expect(gatePosts.some((post) => post.id.endsWith("stop-post")), segment.id).toBe(true);
      expect(gatePosts.every((post) => Math.hypot(post.x - segment.x, post.z - segment.z) < 0.4), segment.id).toBe(true);
      expect(segment.fasteners).toHaveLength(2);
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.032), segment.id).toBe(true);
    }
  });

  it("models wireform returns as elevated rail pairs with supports", () => {
    const ballDiameter = blueprint.scale.ballRadius * 2;
    const railHalfWidth = 0.025;

    expect(blueprint.wireforms.map((wireform) => wireform.id)).toEqual(
      expect.arrayContaining(["wireform.left-return", "wireform.right-orbit-return"])
    );

    for (const wireform of blueprint.wireforms) {
      expect(wireform.railY).toBeGreaterThanOrEqual(0.85);
      expect(wireform.railY).toBeLessThanOrEqual(1.45);
      expect(wireform.railHeight).toBeGreaterThan(0);
      expect(wireform.railOffset).toBeGreaterThan(blueprint.scale.ballRadius + railHalfWidth);
      expect(wireform.railOffset * 2 - railHalfWidth * 2).toBeGreaterThan(ballDiameter);
      expect(wireform.tieWidth).toBeGreaterThan(wireform.railOffset * 2);
      expect(wireform.segments.length).toBeGreaterThanOrEqual(2);
      expect(wireform.rails).toHaveLength(wireform.segments.length * 2);
      expect(new Set(wireform.rails.map((rail) => rail.sourceSegmentId))).toEqual(
        new Set(wireform.segments.map((segment) => segment.id))
      );
      for (const rail of wireform.rails) {
        expect(rail.id, rail.id).toBe(`${rail.sourceSegmentId}.rail-${rail.side}`);
        expect(rail.targetId, rail.id).toBe(wireform.id);
        expect(rail.kind, rail.id).toBe("wire");
        expect(rail.y, rail.id).toBe(wireform.railY);
        expect(rail.height, rail.id).toBe(wireform.railHeight);
        expect(rail.width, rail.id).toBeGreaterThanOrEqual(railHalfWidth * 2);
        expect(rail.depth, rail.id).toBeGreaterThan(0);
        expect(rail.fasteners, rail.id).toHaveLength(3);
        expect(rail.fasteners.every((fastener) => fastener.id.startsWith(`${rail.id}.clamp-`)), rail.id).toBe(true);
        expect(rail.fasteners.every((fastener) => fastener.targetId === rail.id), rail.id).toBe(true);
        expect(rail.fasteners.every((fastener) => fastener.kind === "metal"), rail.id).toBe(true);
        expect(rail.fasteners.every((fastener) => fastener.radius >= 0.024), rail.id).toBe(true);
        expect(rail.fasteners.every((fastener) => fastener.y > wireform.railY), rail.id).toBe(true);
      }
      expect(wireform.ties.length).toBeGreaterThanOrEqual(wireform.segments.length * 3);
      expect(wireform.ties.every((tie) => tie.id.startsWith(`${wireform.id}.tie-`))).toBe(true);
      expect(wireform.ties.every((tie) => tie.kind === "wire")).toBe(true);
      expect(wireform.ties.every((tie) => tie.width >= wireform.tieWidth)).toBe(true);
      expect(wireform.ties.every((tie) => tie.depth > 0)).toBe(true);
      expect(wireform.ties.every((tie) => tie.fasteners.length === 2)).toBe(true);
      for (const tie of wireform.ties) {
        expect(tie.fasteners.every((fastener) => fastener.id.startsWith(`${tie.id}.screw-`)), tie.id).toBe(true);
        expect(tie.fasteners.every((fastener) => fastener.targetId === tie.id), tie.id).toBe(true);
        expect(tie.fasteners.every((fastener) => fastener.kind === "metal"), tie.id).toBe(true);
        expect(tie.fasteners.every((fastener) => fastener.radius >= 0.024), tie.id).toBe(true);
        expect(tie.fasteners.every((fastener) => fastener.y > wireform.railY), tie.id).toBe(true);
      }
      expect(wireform.supports.length).toBeGreaterThanOrEqual(3);
      expect(wireform.supports.every((support) => support.kind === "metal")).toBe(true);
      expect(wireform.supports.every((support) => support.height <= wireform.railY)).toBe(true);
      expect(wireform.supports.every((support) => support.height >= 0.85)).toBe(true);
      for (const support of wireform.supports) {
        expect(support.cap.id).toBe(`${support.id}.cap`);
        expect(support.cap.kind).toBe("metal");
        expect(support.cap.radius).toBeGreaterThan(support.radius);
        expect(support.cap.height).toBeGreaterThan(0);
        expect(support.foot.id).toBe(`${support.id}.foot`);
        expect(support.foot.targetId).toBe(support.id);
        expect(support.foot.kind).toBe("metal");
        expect(support.foot.radius).toBeGreaterThan(support.radius * 2);
        expect(support.foot.height).toBeGreaterThan(0);
        expect(support.foot.fasteners).toHaveLength(2);
        expect(support.foot.fasteners.every((fastener) => fastener.id.startsWith(`${support.foot.id}.screw-`)), support.id).toBe(true);
        expect(support.foot.fasteners.every((fastener) => fastener.targetId === support.foot.id), support.id).toBe(true);
        expect(support.foot.fasteners.every((fastener) => fastener.kind === "metal"), support.id).toBe(true);
        expect(support.foot.fasteners.every((fastener) => fastener.radius >= 0.026), support.id).toBe(true);
        expect(support.collar.id).toBe(`${support.id}.collar`);
        expect(support.collar.targetId).toBe(support.id);
        expect(support.collar.kind).toBe("metal");
        expect(support.collar.radius).toBeGreaterThan(support.radius);
        expect(support.collar.height).toBeGreaterThan(0);
        expect(support.collar.y).toBeGreaterThan(support.height - 0.08);
        expect(support.collar.y).toBeLessThanOrEqual(support.height);
        expect(support.saddle.id).toBe(`${support.id}.saddle`);
        expect(support.saddle.targetId).toBe(support.id);
        expect(support.saddle.kind).toBe("metal");
        expect(support.saddle.width).toBeGreaterThan(support.radius * 4);
        expect(support.saddle.depth).toBeGreaterThan(support.radius);
        expect(support.saddle.height).toBeGreaterThan(0);
        expect(support.saddle.y).toBeGreaterThanOrEqual(support.height);
        expect(support.saddle.fasteners).toHaveLength(2);
        expect(support.saddle.fasteners.every((fastener) => fastener.id.startsWith(`${support.saddle.id}.screw-`)), support.id).toBe(true);
        expect(support.saddle.fasteners.every((fastener) => fastener.targetId === support.saddle.id), support.id).toBe(true);
        expect(support.saddle.fasteners.every((fastener) => fastener.kind === "metal"), support.id).toBe(true);
        expect(support.saddle.fasteners.every((fastener) => fastener.radius >= 0.022), support.id).toBe(true);
        expect(support.height + support.cap.height).toBeLessThanOrEqual(wireform.railY + wireform.railHeight);
      }
    }

    expect(blueprint.orbits.find((orbit) => orbit.id === "orbit.left")?.returnWireformId).toBe("wireform.left-return");
    expect(blueprint.orbits.find((orbit) => orbit.id === "orbit.right")?.returnWireformId).toBe(
      "wireform.right-orbit-return"
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["wireform.left-return.upper.rail-left", "wireform.left-return.lower.rail-right"])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.right-orbit")?.deviceIds).toEqual(
      expect.arrayContaining(["wireform.right-orbit-return.upper.rail-left", "wireform.right-orbit-return.lower.rail-right"])
    );
  });

  it("models pop bumpers with separate skirts and caps", () => {
    for (const bumper of blueprint.bumpers) {
      expect(bumper.skirtRadius).toBeGreaterThan(bumper.capRadius);
      expect(bumper.radius).toBeGreaterThanOrEqual(bumper.skirtRadius);
      expect(bumper.chromeRing.id).toBe(`${bumper.id}.chrome-ring`);
      expect(bumper.chromeRing.kind).toBe("metal");
      expect(bumper.chromeRing.radius).toBeCloseTo(bumper.radius);
      expect(bumper.chromeRing.radius).toBeGreaterThan(bumper.skirtRadius);
      expect(bumper.chromeRing.tubeRadius).toBeGreaterThan(0);
      expect(bumper.lampLens.id).toBe(`${bumper.id}.lamp-lens`);
      expect(bumper.lampLens.kind).toBe("clear-plastic");
      expect(bumper.lampLens.x).toBeCloseTo(bumper.x);
      expect(bumper.lampLens.z).toBeCloseTo(bumper.z);
      expect(bumper.lampLens.radius).toBeGreaterThan(0.12);
      expect(bumper.lampLens.radius).toBeLessThan(bumper.capRadius);
      expect(bumper.lampLens.height).toBeGreaterThan(0);
      expect(bumper.lampLens.color).toBeGreaterThan(0);
      expect(bumper.capFasteners).toHaveLength(3);
      for (const fastener of bumper.capFasteners) {
        expect(fastener.id.startsWith(`${bumper.id}.cap-screw-`), fastener.id).toBe(true);
        expect(fastener.kind).toBe("metal");
        expect(fastener.radius).toBeGreaterThanOrEqual(0.03);
        expect(Math.hypot(fastener.x - bumper.x, fastener.z - bumper.z), fastener.id).toBeLessThan(
          bumper.capRadius
        );
      }
    }
  });

  it("models the pop bumper nest with authored ring posts and rubber guards", () => {
    const postIds = new Set(blueprint.posts.map((post) => post.id));

    for (const bumper of blueprint.bumpers) {
      expect(bumper.ringPostIds).toHaveLength(3);
      expect(bumper.guardSegments.length).toBeGreaterThanOrEqual(2);
      expect(bumper.guardSegments.every((segment) => segment.id.startsWith(`${bumper.id}.`))).toBe(true);
      expect(bumper.guardSegments.every((segment) => segment.kind === "rubber")).toBe(true);
      expect(bumper.guardSegments.every((segment) => segment.fasteners.length === 2)).toBe(true);
      for (const segment of bumper.guardSegments) {
        expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.radius >= 0.026), segment.id).toBe(true);
        for (const fastener of segment.fasteners) {
          expect(Math.hypot(fastener.x - segment.x, fastener.z - segment.z), fastener.id)
            .toBeLessThanOrEqual(Math.max(segment.width, segment.depth) / 2);
        }
      }

      for (const id of bumper.ringPostIds) {
        expect(postIds.has(id), id).toBe(true);
      }
    }
  });

  it("models each standup target with a rear stop and face decal color", () => {
    const centerBankShot = blueprint.shots.find((shot) => shot.id === "shot.center-bank");
    const insertById = new Map(blueprint.lampInserts.map((insert) => [insert.id, insert]));
    const expectedInsertIds = ["insert.social-s", "insert.social-o", "insert.social-c", "insert.social-i", "insert.social-a"];

    for (const [index, target] of blueprint.targets.entries()) {
      expect(target.face.id).toBe(`${target.id}.face`);
      expect(target.face.kind).toBe("plastic");
      expect(target.face.x).toBeCloseTo(target.x);
      expect(target.face.z).toBeCloseTo(target.z);
      expect(target.face.angle ?? 0).toBeCloseTo(target.angle);
      expect(target.face.width).toBeGreaterThan(0.3);
      expect(target.face.height).toBeGreaterThan(0.65);
      expect(target.face.thickness).toBeGreaterThan(0.1);
      expect(target.face.color).toBeGreaterThan(0);
      expect(target.rearStop.id).toBe(`${target.id}.rear-stop`);
      expect(target.rearStop.kind).toBe("rubber");
      expect(target.rearStop.depth).toBeGreaterThan(0);
      expect(target.mountPlate.id).toBe(`${target.id}.mount-plate`);
      expect(target.mountPlate.kind).toBe("metal");
      expect(target.mountPlate.width).toBeGreaterThan(0.4);
      expect(target.mountPlate.depth).toBeGreaterThan(0.06);
      expect(target.mountPlate.z).toBeGreaterThan(target.rearStop.z);
      expect(target.mountFasteners).toHaveLength(2);
      expect(target.mountFasteners.every((fastener) => fastener.id.startsWith(`${target.id}.mount-screw-`))).toBe(true);
      expect(target.mountFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
      expect(target.mountFasteners.every((fastener) => fastener.radius > 0.025)).toBe(true);
      expect(centerBankShot?.deviceIds).toEqual(
        expect.arrayContaining(target.mountFasteners.map((fastener) => fastener.id))
      );
      expect(target.decalColor).toBeGreaterThan(0);
      expect(centerBankShot?.deviceIds).toContain(target.face.id);
      expect(target.lampInsertId).toBe(expectedInsertIds[index]);
      expect(centerBankShot?.deviceIds).toContain(target.lampInsertId);

      const insert = insertById.get(target.lampInsertId);
      expect(insert, target.lampInsertId).toBeDefined();
      expect(insert?.label).toBe(target.label);
      expect(insert?.x).toBeCloseTo(target.x);
      expect(insert?.z ?? 0).toBeGreaterThan(target.z);
      expect(insert?.lens.targetId).toBe(target.lampInsertId);
    }
  });

  it("models the target bank as one framed physical assembly", () => {
    const targetXs = blueprint.targets.map((target) => target.x);
    const minTargetX = Math.min(...targetXs);
    const maxTargetX = Math.max(...targetXs);
    const frameIds = blueprint.targetBank.frameSegments.map((segment) => segment.id);

    expect(blueprint.targetBank.id).toBe("target-bank.social");
    expect(blueprint.targetBank.label).toBe("SOCIAL");
    expect(frameIds).toEqual(
      expect.arrayContaining([
        "target-bank.frame-top-rail",
        "target-bank.frame-bottom-rail",
        "target-bank.frame-left-cheek",
        "target-bank.frame-right-cheek",
        "target-bank.divider-1",
        "target-bank.divider-2",
        "target-bank.divider-3",
        "target-bank.divider-4"
      ])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.center-bank")?.deviceIds).toEqual(
      expect.arrayContaining(frameIds)
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.center-bank")?.deviceIds).toEqual(
      expect.arrayContaining(blueprint.targetBank.frameSegments.flatMap((segment) => segment.fasteners.map((fastener) => fastener.id)))
    );
    expect(blueprint.targetBank.posts).toHaveLength(4);
    expect(blueprint.shots.find((shot) => shot.id === "shot.center-bank")?.deviceIds).toEqual(
      expect.arrayContaining(blueprint.targetBank.posts.map((post) => post.id))
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.center-bank")?.deviceIds).toEqual(
      expect.arrayContaining(blueprint.targetBank.posts.flatMap((post) => post.cap ? [post.cap.id] : []))
    );
    expect(blueprint.targetBank.frameSegments.every((segment) => segment.kind === "metal")).toBe(true);
    expect(blueprint.targetBank.frameSegments.every((segment) => segment.fasteners.length === 2)).toBe(true);
    for (const segment of blueprint.targetBank.frameSegments) {
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.028), segment.id).toBe(true);
      for (const fastener of segment.fasteners) {
        expect(
          Math.hypot(fastener.x - segment.x, fastener.z - segment.z),
          fastener.id
        ).toBeLessThanOrEqual(Math.max(segment.width, segment.depth) / 2);
      }
    }
    expect(blueprint.targetBank.posts.every((post) => post.kind === "metal")).toBe(true);
    expect(blueprint.targetBank.posts.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);
    expect(blueprint.targetBank.posts.every((post) => (post.cap?.radius ?? 0) > post.radius)).toBe(true);
    expect(blueprint.targetBank.posts.every((post) => (post.cap?.height ?? 0) > 0)).toBe(true);
    expect(blueprint.targetBank.frameSegments.filter((segment) => segment.id.startsWith("target-bank.divider-"))).toHaveLength(4);
    expect(blueprint.targetBank.frameSegments.find((segment) => segment.id === "target-bank.frame-top-rail")?.width).toBeGreaterThan(maxTargetX - minTargetX);
    expect(blueprint.targetBank.frameSegments.find((segment) => segment.id === "target-bank.frame-bottom-rail")?.width).toBeGreaterThan(maxTargetX - minTargetX);
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

  it("models the apron, drain mouth, trough, and shooter feed as authored hardware", () => {
    expect(blueprint.drain.apron.id).toBe("apron.lower-card");
    expect(blueprint.drain.apron.width).toBeGreaterThan(5);
    expect(blueprint.drain.apronCards.map((card) => card.id)).toEqual(
      expect.arrayContaining(["apron.card-left", "apron.card-right"])
    );
    expect(blueprint.drain.apronCards.every((card) => card.width > 1)).toBe(true);
    expect(blueprint.drain.apronCards.every((card) => card.protector.id === `${card.id}.protector`)).toBe(true);
    expect(blueprint.drain.apronCards.every((card) => card.protector.kind === "clear-plastic")).toBe(true);
    expect(blueprint.drain.apronCards.every((card) => card.protector.width > card.width)).toBe(true);
    expect(blueprint.drain.apronCards.every((card) => card.protector.depth > card.depth)).toBe(true);
    expect(blueprint.drain.apronCards.every((card) => card.protector.thickness > 0)).toBe(true);
    expect(blueprint.drain.apronFasteners).toHaveLength(8);
    expect(blueprint.drain.apronFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.drain.drainGuides.map((guide) => guide.id)).toEqual(
      expect.arrayContaining(["drain.left-guide", "drain.right-guide", "drain.center-mouth"])
    );
    expect(blueprint.drain.drainGuides.every((guide) => guide.kind === "rubber" || guide.kind === "metal")).toBe(true);
    expect(blueprint.drain.drainGuides.every((guide) => guide.fasteners.length === 2)).toBe(true);
    for (const guide of blueprint.drain.drainGuides) {
      expect(guide.fasteners.every((fastener) => fastener.id.startsWith(`${guide.id}.screw-`)), guide.id).toBe(true);
      expect(guide.fasteners.every((fastener) => fastener.targetId === guide.id), guide.id).toBe(true);
      expect(guide.fasteners.every((fastener) => fastener.kind === "metal"), guide.id).toBe(true);
      expect(guide.fasteners.every((fastener) => fastener.radius > 0.03), guide.id).toBe(true);
      for (const fastener of guide.fasteners) {
        expect(Math.hypot(fastener.x - guide.x, fastener.z - guide.z), fastener.id).toBeLessThan(0.55);
      }
    }

    expect(blueprint.drain.trough.id).toBe("trough.ball-return");
    expect(blueprint.drain.trough.ballSlots).toHaveLength(3);
    expect(blueprint.drain.trough.slotRims).toHaveLength(3);
    expect(blueprint.drain.trough.slotRims.map((rim) => rim.id)).toEqual(
      expect.arrayContaining(["trough.slot-1.rim", "trough.slot-2.rim", "trough.slot-3.rim"])
    );
    blueprint.drain.trough.slotRims.forEach((rim) => {
      const slot = blueprint.drain.trough.ballSlots.find((candidate) => candidate.id === rim.slotId);
      expect(slot).toBeDefined();
      expect(rim.kind).toBe("metal");
      expect(rim.innerRadius).toBeCloseTo(slot?.radius ?? 0);
      expect(rim.outerRadius).toBeGreaterThan(rim.innerRadius);
      expect(rim.height).toBeGreaterThan(0.03);
      expect(rim.x).toBeCloseTo(slot?.x ?? 0);
      expect(rim.z).toBeCloseTo(slot?.z ?? 0);
    });
    expect(blueprint.drain.trough.walls.map((wall) => wall.id)).toEqual(
      expect.arrayContaining(["trough.left-wall", "trough.right-wall", "trough.back-wall"])
    );
    expect(blueprint.drain.trough.feedGuide.id).toBe("trough.shooter-feed-guide");
    expect(blueprint.drain.trough.feedGuide.kind).toBe("metal");
    expect(blueprint.drain.trough.fasteners).toHaveLength(8);
    expect(blueprint.drain.trough.fasteners.every((fastener) => fastener.id.startsWith(`${fastener.targetId}.screw-`))).toBe(true);
    expect(blueprint.drain.trough.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.drain.trough.fasteners.every((fastener) => fastener.radius > 0.03)).toBe(true);
    expect(new Set(blueprint.drain.trough.fasteners.map((fastener) => fastener.targetId))).toEqual(
      new Set(["trough.left-wall", "trough.right-wall", "trough.back-wall", "trough.shooter-feed-guide"])
    );
    expect(blueprint.drain.trough.width).toBeGreaterThan(blueprint.scale.ballRadius * 6);
  });

  it("includes layered plastics and shooter hardware from the physical reference", () => {
    expect(blueprint.plastics.length).toBeGreaterThanOrEqual(6);
    expect(blueprint.plastics.every((cover) => cover.layerY >= 0.45)).toBe(true);
    expect(blueprint.plastics.every((cover) => cover.layerY <= 0.75)).toBe(true);
    expect(blueprint.plunger.id).toBe("shooter.plunger");
    expect(blueprint.plunger.rodLength).toBeGreaterThan(1);
    expect(blueprint.plunger.spring.id).toBe("shooter.plunger-spring");
    expect(blueprint.plunger.spring.kind).toBe("metal");
    expect(blueprint.plunger.spring.radius).toBeGreaterThan(blueprint.plunger.spring.tubeRadius);
    expect(blueprint.plunger.knob.id).toBe("shooter.plunger-knob");
    expect(blueprint.plunger.knob.kind).toBe("plastic");
    expect(blueprint.plunger.knob.radius).toBeGreaterThan(blueprint.plunger.spring.radius);
    expect(blueprint.plunger.gate.id).toBe("shooter.one-way-gate");
  });

  it("mounts every plastic cover on authored metal standoffs", () => {
    for (const cover of blueprint.plastics) {
      expect(cover.standoffs.length, cover.id).toBeGreaterThanOrEqual(2);

      for (const standoff of cover.standoffs) {
        expect(standoff.id.startsWith(`${cover.id}.standoff.`), standoff.id).toBe(true);
        expect(standoff.kind).toBe("metal");
        expect(standoff.height).toBeGreaterThan(0.45);
        expect(standoff.height).toBeLessThanOrEqual(cover.layerY);
        expect(standoff.radius).toBeGreaterThan(0.025);
        expect(standoff.radius).toBeLessThanOrEqual(0.05);
        expect(standoff.capRadius).toBeGreaterThan(standoff.radius);
      }
    }
  });

  it("models the shooter lane groove, housing, and lower guide hardware", () => {
    expect(blueprint.plunger.laneGroove.id).toBe("shooter.lane-groove");
    expect(blueprint.plunger.laneGroove.depth).toBeGreaterThan(4);
    expect(blueprint.plunger.laneGroove.width).toBeGreaterThan(blueprint.scale.ballRadius * 2);
    expect(blueprint.plunger.housing.id).toBe("shooter.plunger-housing");
    expect(blueprint.plunger.housing.kind).toBe("metal");
    expect(blueprint.plunger.housingFasteners).toHaveLength(4);
    expect(blueprint.plunger.housingFasteners.every((fastener) => fastener.id.startsWith(`${fastener.targetId}.screw-`))).toBe(true);
    expect(blueprint.plunger.housingFasteners.every((fastener) => fastener.targetId === blueprint.plunger.housing.id)).toBe(true);
    expect(blueprint.plunger.housingFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.plunger.housingFasteners.every((fastener) => fastener.radius > 0)).toBe(true);
    expect(blueprint.plunger.lowerGuides.map((guide) => guide.id)).toEqual(
      expect.arrayContaining(["shooter.lower-left-guide", "shooter.lower-right-guide"])
    );
    expect(blueprint.plunger.lowerGuides.every((guide) => guide.kind === "metal")).toBe(true);
    expect(blueprint.plunger.guideFasteners).toHaveLength(4);
    expect(blueprint.plunger.guideFasteners.every((fastener) => fastener.id.startsWith(`${fastener.targetId}.screw-`))).toBe(true);
    expect(blueprint.plunger.guideFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.plunger.guideFasteners.every((fastener) => fastener.radius > 0)).toBe(true);
    expect(new Set(blueprint.plunger.guideFasteners.map((fastener) => fastener.targetId))).toEqual(
      new Set(["shooter.lower-left-guide", "shooter.lower-right-guide"])
    );
  });

  it("models the shooter one-way gate as hinged physical hardware", () => {
    const gate = blueprint.plunger.gate;
    const hinge = blueprint.plunger.gateHingePost;
    const stop = blueprint.plunger.gateStopPost;

    expect(gate.id).toBe("shooter.one-way-gate");
    expect(gate.kind).toBe("metal");
    expect(gate.width).toBeGreaterThan(blueprint.scale.ballRadius * 2.5);
    expect(gate.depth).toBeLessThan(blueprint.scale.ballRadius);
    expect(hinge.id).toBe("shooter.one-way-gate.hinge-post");
    expect(stop.id).toBe("shooter.one-way-gate.stop-post");
    expect(hinge.kind).toBe("metal");
    expect(stop.kind).toBe("metal");
    expect(hinge.radius).toBeGreaterThanOrEqual(0.06);
    expect(stop.radius).toBeGreaterThanOrEqual(0.05);
    expect(hinge.cap?.id).toBe(`${hinge.id}.cap`);
    expect(stop.cap?.id).toBe(`${stop.id}.cap`);
    expect(hinge.cap?.kind).toBe("metal");
    expect(stop.cap?.kind).toBe("metal");
    expect(hinge.cap?.radius).toBeGreaterThan(hinge.radius);
    expect(stop.cap?.radius).toBeGreaterThan(stop.radius);
    expect(hinge.cap?.height).toBeGreaterThan(0);
    expect(stop.cap?.height).toBeGreaterThan(0);
    expect(hinge.x).toBeLessThan(gate.x);
    expect(stop.x).toBeGreaterThan(gate.x);
    expect(Math.abs(hinge.z - gate.z)).toBeLessThan(0.2);
    expect(Math.abs(stop.z - gate.z)).toBeLessThan(0.25);
  });

  it("models the lock saucer with bowl walls, entry posts, hold point, and eject vector", () => {
    const saucer = blueprint.saucers.find((item) => item.id === "lock.saucer");
    expect(saucer).toBeDefined();
    expect(saucer?.cup.id).toBe("lock.saucer.cup");
    expect(saucer?.cup.kind).toBe("metal");
    expect(saucer?.cup.innerRadius).toBeGreaterThan(blueprint.scale.ballRadius);
    expect(saucer?.cup.outerRadius).toBeGreaterThan(saucer?.cup.innerRadius ?? 0);
    expect(saucer?.cup.height).toBeGreaterThan(0);
    expect(saucer?.cup.fasteners).toHaveLength(3);
    expect(saucer?.cup.fasteners.every((fastener) => fastener.id.startsWith(`${saucer?.cup.id}.screw-`))).toBe(true);
    expect(saucer?.cup.fasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(saucer?.cup.fasteners.every((fastener) => fastener.radius > 0)).toBe(true);
    for (const fastener of saucer?.cup.fasteners ?? []) {
      const offset = Math.hypot(fastener.x - (saucer?.x ?? 0), fastener.z - (saucer?.z ?? 0));
      expect(offset).toBeGreaterThan(saucer?.cup.innerRadius ?? 0);
      expect(offset).toBeLessThanOrEqual((saucer?.cup.outerRadius ?? 0) + fastener.radius);
    }
    expect(saucer?.walls.length).toBeGreaterThanOrEqual(4);
    expect(saucer?.walls.every((wall) => wall.fasteners.length === 2)).toBe(true);
    for (const wall of saucer?.walls ?? []) {
      expect(wall.fasteners.every((fastener) => fastener.id.startsWith(`${wall.id}.screw-`)), wall.id).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.targetId === wall.id), wall.id).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.kind === "metal"), wall.id).toBe(true);
      expect(wall.fasteners.every((fastener) => fastener.radius >= 0.028), wall.id).toBe(true);
      for (const fastener of wall.fasteners) {
        expect(Math.hypot(fastener.x - wall.x, fastener.z - wall.z), fastener.id)
          .toBeLessThanOrEqual(Math.max(wall.width, wall.depth) / 2);
      }
    }
    expect(saucer?.posts.length).toBeGreaterThanOrEqual(2);
    expect(blueprint.shots.find((shot) => shot.id === "shot.lock-saucer")?.deviceIds).toEqual(
      expect.arrayContaining(["lock.saucer.left-post", "lock.saucer.right-post"])
    );
    for (const post of saucer?.posts ?? []) {
      expect(post.kind).toBe("metal");
      expect(post.cap?.id).toBe(`${post.id}.cap`);
      expect(post.cap?.kind).toBe("metal");
      expect(post.cap?.radius).toBeGreaterThan(post.radius);
      expect(post.cap?.height).toBeGreaterThan(0);
    }
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
        "insert.skill-shot",
        "insert.social-s",
        "insert.social-o",
        "insert.social-c",
        "insert.social-i",
        "insert.social-a"
      ])
    );
    for (const insert of blueprint.lampInserts) {
      expect(insert.lens.id).toBe(`${insert.id}.lens`);
      expect(insert.lens.targetId).toBe(insert.id);
      expect(insert.lens.kind).toBe("plastic");
      expect(insert.lens.shape).toBe(insert.shape);
      expect(insert.lens.color).toBe(insert.color);
      expect(insert.lens.x).toBe(insert.x);
      expect(insert.lens.z).toBe(insert.z);
      expect(insert.lens.radius).toBeGreaterThan(insert.radius);
      expect(insert.lens.height).toBeGreaterThan(0);
      expect(insert.lens.width).toBeGreaterThan(insert.radius);
      expect(insert.lens.depth).toBeGreaterThan(insert.radius);
    }
    expect(blueprint.handoffs.map((handoff) => handoff.id)).toEqual(
      expect.arrayContaining([
        "handoff.ramp-left-entry",
        "handoff.ramp-left-exit",
        "handoff.left-orbit-entry",
        "handoff.right-orbit-entry",
        "handoff.right-orbit-exit"
      ])
    );
    expect(blueprint.handoffs.flatMap((handoff) => handoff.segments).every((segment) => segment.kind === "metal" || segment.kind === "wire")).toBe(true);
  });

  it("mounts the ramp entry flap and guide wires on capped metal posts", () => {
    const entryHandoff = blueprint.handoffs.find((handoff) => handoff.id === "handoff.ramp-left-entry");

    expect(entryHandoff).toBeDefined();
    expect(entryHandoff?.segments).toHaveLength(3);
    expect(entryHandoff?.posts).toHaveLength(6);
    expect(entryHandoff?.posts?.every((post) => post.kind === "metal")).toBe(true);
    expect(entryHandoff?.posts?.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);

    for (const segment of entryHandoff?.segments ?? []) {
      const segmentPosts = entryHandoff?.posts?.filter((post) => post.id.startsWith(segment.id)) ?? [];
      expect(segmentPosts, segment.id).toHaveLength(2);
      expect(segmentPosts.every((post) => Math.hypot(post.x - segment.x, post.z - segment.z) < 0.5), segment.id).toBe(true);
      expect(segment.fasteners).toHaveLength(2);
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= (segment.kind === "wire" ? 0.026 : 0.032)), segment.id).toBe(true);
    }

    const leftRampShot = blueprint.shots.find((shot) => shot.id === "shot.left-ramp");
    expect(leftRampShot?.deviceIds).toEqual(
      expect.arrayContaining([
        "handoff.ramp-left-entry.flap",
        "handoff.ramp-left-entry.left-guide",
        "handoff.ramp-left-entry.right-guide"
      ])
    );
  });

  it("mounts the left orbit entry guides on capped metal posts", () => {
    const entryHandoff = blueprint.handoffs.find((handoff) => handoff.id === "handoff.left-orbit-entry");

    expect(entryHandoff).toBeDefined();
    expect(entryHandoff?.segments).toHaveLength(2);
    expect(entryHandoff?.posts).toHaveLength(4);
    expect(entryHandoff?.segments.every((segment) => segment.kind === "wire")).toBe(true);
    expect(entryHandoff?.posts?.every((post) => post.kind === "metal")).toBe(true);
    expect(entryHandoff?.posts?.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);

    for (const segment of entryHandoff?.segments ?? []) {
      const segmentPosts = entryHandoff?.posts?.filter((post) => post.id.startsWith(segment.id)) ?? [];
      expect(segmentPosts, segment.id).toHaveLength(2);
      expect(segmentPosts.some((post) => post.id.endsWith("upper-post")), segment.id).toBe(true);
      expect(segmentPosts.some((post) => post.id.endsWith("lower-post")), segment.id).toBe(true);
      expect(segmentPosts.every((post) => Math.hypot(post.x - segment.x, post.z - segment.z) < 0.5), segment.id).toBe(true);
      expect(segment.fasteners).toHaveLength(2);
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.026), segment.id).toBe(true);
    }

    expect(blueprint.shots.find((shot) => shot.id === "shot.left-orbit")?.deviceIds).toEqual(
      expect.arrayContaining([
        "handoff.left-orbit-entry.inner-guide",
        "handoff.left-orbit-entry.outer-guide",
        "orbit.left.outer.lower",
        "orbit.left.inner.lower",
        "orbit.left.outer.mid",
        "orbit.left.inner.mid",
        "orbit.left.outer.upper",
        "orbit.left.inner.upper"
      ])
    );
  });

  it("mounts the right orbit entry guides on capped metal posts", () => {
    const entryHandoff = blueprint.handoffs.find((handoff) => handoff.id === "handoff.right-orbit-entry");

    expect(entryHandoff).toBeDefined();
    expect(entryHandoff?.segments).toHaveLength(2);
    expect(entryHandoff?.posts).toHaveLength(4);
    expect(entryHandoff?.segments.every((segment) => segment.kind === "wire")).toBe(true);
    expect(entryHandoff?.posts?.every((post) => post.kind === "metal")).toBe(true);
    expect(entryHandoff?.posts?.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);

    for (const segment of entryHandoff?.segments ?? []) {
      const segmentPosts = entryHandoff?.posts?.filter((post) => post.id.startsWith(segment.id)) ?? [];
      expect(segmentPosts, segment.id).toHaveLength(2);
      expect(segmentPosts.some((post) => post.id.endsWith("upper-post")), segment.id).toBe(true);
      expect(segmentPosts.some((post) => post.id.endsWith("lower-post")), segment.id).toBe(true);
      expect(segmentPosts.every((post) => Math.hypot(post.x - segment.x, post.z - segment.z) < 0.5), segment.id).toBe(true);
      expect(segment.fasteners).toHaveLength(2);
      expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
      expect(segment.fasteners.every((fastener) => fastener.radius >= 0.026), segment.id).toBe(true);
    }

    expect(blueprint.shots.find((shot) => shot.id === "shot.right-orbit")?.deviceIds).toEqual(
      expect.arrayContaining([
        "handoff.right-orbit-entry.inner-guide",
        "handoff.right-orbit-entry.outer-guide",
        "orbit.right.outer.lower",
        "orbit.right.inner.lower",
        "orbit.right.outer.mid",
        "orbit.right.inner.mid",
        "orbit.right.outer.upper",
        "orbit.right.inner.upper"
      ])
    );
  });

  it("mounts return handoff guides on capped metal posts", () => {
    const returnHandoffs = blueprint.handoffs.filter((handoff) =>
      handoff.id === "handoff.ramp-left-exit" || handoff.id === "handoff.right-orbit-exit"
    );

    expect(returnHandoffs).toHaveLength(2);
    for (const handoff of returnHandoffs) {
      expect(handoff.segments).toHaveLength(2);
      expect(handoff.posts).toHaveLength(4);
      expect(handoff.posts?.every((post) => post.kind === "metal")).toBe(true);
      expect(handoff.posts?.every((post) => post.cap?.id === `${post.id}.cap`)).toBe(true);
      for (const segment of handoff.segments) {
        const segmentPosts = handoff.posts?.filter((post) => post.id.startsWith(segment.id)) ?? [];
        expect(segmentPosts, segment.id).toHaveLength(2);
        expect(segmentPosts.some((post) => post.id.endsWith("upper-post")), segment.id).toBe(true);
        expect(segmentPosts.some((post) => post.id.endsWith("lower-post")), segment.id).toBe(true);
        expect(segmentPosts.every((post) => Math.hypot(post.x - segment.x, post.z - segment.z) < 0.5), segment.id).toBe(true);
        expect(segment.fasteners).toHaveLength(2);
        expect(segment.fasteners.every((fastener) => fastener.id.startsWith(`${segment.id}.screw-`)), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.targetId === segment.id), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.kind === "metal"), segment.id).toBe(true);
        expect(segment.fasteners.every((fastener) => fastener.radius >= 0.026), segment.id).toBe(true);
      }
    }

    expect(blueprint.shots.find((shot) => shot.id === "shot.left-ramp")?.deviceIds).toEqual(
      expect.arrayContaining(["handoff.ramp-left-exit.left-guide", "handoff.ramp-left-exit.right-guide"])
    );
    expect(blueprint.shots.find((shot) => shot.id === "shot.right-orbit")?.deviceIds).toEqual(
      expect.arrayContaining(["handoff.right-orbit-exit.left-guide", "handoff.right-orbit-exit.right-guide"])
    );
  });

  it("models the painted playfield deck and major shot decals as authored board details", () => {
    const artById = new Map(blueprint.playfieldArt.map((item) => [item.id, item]));

    expect(artById.get("playfield.art.base-teal")?.kind).toBe("zone");
    expect(artById.get("playfield.art.base-teal")?.width).toBeGreaterThan(blueprint.scale.playfieldWidth * 0.85);
    expect(artById.get("playfield.art.base-teal")?.depth).toBeGreaterThan(blueprint.scale.playfieldLength * 0.8);
    expect(artById.get("playfield.art.bumper-burst")?.kind).toBe("zone");
    expect(artById.get("playfield.art.left-lane-stripe")?.kind).toBe("stripe");
    expect(artById.get("playfield.art.right-lane-stripe")?.kind).toBe("stripe");
    expect(artById.get("playfield.art.left-ramp-arrow")?.kind).toBe("arrow");
    expect(artById.get("playfield.art.left-orbit-arrow")?.kind).toBe("arrow");
    expect(artById.get("playfield.art.right-orbit-arrow")?.kind).toBe("arrow");
    expect(artById.get("playfield.art.lock-label")?.label).toBe("LOCK");
    expect(artById.get("playfield.art.social-sweep")?.label).toBe("SOCIAL");

    for (const art of blueprint.playfieldArt) {
      expect(Math.abs(art.x) + art.width / 2, art.id).toBeLessThanOrEqual(blueprint.scale.playfieldWidth / 2);
      expect(Math.abs(art.z) + art.depth / 2, art.id).toBeLessThanOrEqual(blueprint.scale.playfieldLength / 2);
      expect(art.layerY, art.id).toBeGreaterThanOrEqual(0);
      expect(art.layerY, art.id).toBeLessThanOrEqual(0.06);
      expect(art.color, art.id).toBeGreaterThan(0);
    }
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
      blueprint.drain.id,
      blueprint.drain.apron.id,
      ...blueprint.drain.drainGuides.map((item) => item.id),
      ...blueprint.drain.drainGuides.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.drain.apronCards.map((item) => item.id),
      ...blueprint.drain.apronCards.map((item) => item.protector.id),
      ...blueprint.drain.apronFasteners.map((item) => item.id),
      blueprint.cabinet.body.id,
      blueprint.cabinet.backbox.id,
      blueprint.cabinet.dmdPanel.id,
      ...blueprint.cabinet.sideRails.map((item) => item.id),
      ...blueprint.cabinet.glassRims.map((item) => item.id),
      blueprint.cabinet.glassPanel.id,
      blueprint.cabinet.lockdownBar.id,
      ...blueprint.cabinet.fasteners.map((item) => item.id),
      ...blueprint.cabinet.speakerGrilles.map((item) => item.id),
      ...blueprint.cabinet.speakerGrilles.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      blueprint.drain.trough.id,
      ...blueprint.drain.trough.ballSlots.map((item) => item.id),
      ...blueprint.drain.trough.slotRims.map((item) => item.id),
      ...blueprint.drain.trough.walls.map((item) => item.id),
      blueprint.drain.trough.feedGuide.id,
      ...blueprint.drain.trough.fasteners.map((item) => item.id),
      ...blueprint.boundaries.map((item) => item.id),
      ...blueprint.boundaries.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.laneWalls.map((item) => item.id),
      ...blueprint.laneWalls.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.rubberBands.map((item) => item.id),
      ...blueprint.rolloverWires.map((item) => item.id),
      ...blueprint.rolloverWires.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.flipperStops.map((item) => item.id),
      ...blueprint.flipperStops.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.posts.map((item) => item.id),
      ...blueprint.posts.flatMap((item) => item.cap ? [item.cap.id] : []),
      ...blueprint.lanes.map((item) => item.id),
      ...blueprint.lanes.flatMap((item) => item.guideCover
        ? [item.guideCover.id, ...item.guideCover.fasteners.map((fastener) => fastener.id)]
        : []),
      ...blueprint.flippers.map((item) => item.id),
      ...blueprint.flippers.map((item) => item.rubberSleeve.id),
      ...blueprint.flippers.map((item) => item.pivotCap.id),
      ...blueprint.flippers.flatMap((item) => item.batFasteners.map((fastener) => fastener.id)),
      ...blueprint.slings.flatMap((sling) => [
        sling.id,
        sling.rubberFace.id,
        sling.topPlastic.id,
        ...sling.topPlastic.fasteners.map((fastener) => fastener.id),
        sling.lamp.id,
        sling.lamp.lens.id,
        ...sling.postIds
      ]),
      ...blueprint.targets.map((item) => item.id),
      ...blueprint.targets.map((item) => item.face.id),
      ...blueprint.targets.map((item) => item.rearStop.id),
      ...blueprint.targets.map((item) => item.mountPlate.id),
      ...blueprint.targets.flatMap((item) => item.mountFasteners.map((fastener) => fastener.id)),
      blueprint.targetBank.id,
      ...blueprint.targetBank.frameSegments.map((item) => item.id),
      ...blueprint.targetBank.frameSegments.flatMap((item) => item.fasteners.map((fastener) => fastener.id)),
      ...blueprint.targetBank.posts.map((item) => item.id),
      ...blueprint.targetBank.posts.flatMap((item) => item.cap ? [item.cap.id] : []),
      ...blueprint.saucers.map((item) => item.id),
      ...blueprint.saucers.flatMap((saucer) => [
        saucer.cup.id,
        ...saucer.cup.fasteners.map((fastener) => fastener.id),
        ...saucer.walls.map((segment) => segment.id),
        ...saucer.walls.flatMap((segment) => segment.fasteners.map((fastener) => fastener.id)),
        ...saucer.posts.flatMap((post) => post.cap ? [post.id, post.cap.id] : [post.id])
      ]),
      ...blueprint.ramps.flatMap((ramp) => [
        ramp.id,
        ramp.entry.id,
        ramp.exit.id,
        ...ramp.sideWalls.map((wall) => wall.id),
        ...ramp.sideWalls.flatMap((wall) => wall.fasteners.map((fastener) => fastener.id)),
        ...ramp.sideRails.map((rail) => rail.id),
        ...ramp.sideRails.flatMap((rail) => rail.fasteners.map((fastener) => fastener.id)),
        ...ramp.crossBraces.map((brace) => brace.id),
        ...ramp.crossBraces.flatMap((brace) => brace.fasteners.map((fastener) => fastener.id)),
        ramp.entranceLip.id,
        ...ramp.entranceLip.fasteners.map((fastener) => fastener.id),
        ...ramp.supports.flatMap((support) => [
          support.id,
          support.cap.id,
          support.foot.id,
          support.collar.id,
          support.saddle.id,
          ...support.foot.fasteners.map((fastener) => fastener.id),
          ...support.saddle.fasteners.map((fastener) => fastener.id)
        ])
      ]),
      ...blueprint.handoffs.flatMap((handoff) => [
        handoff.id,
        ...handoff.segments.map((segment) => segment.id),
        ...handoff.segments.flatMap((segment) => segment.fasteners.map((fastener) => fastener.id))
      ]),
      ...blueprint.handoffs.flatMap((handoff) => (handoff.posts ?? []).flatMap((post) => post.cap ? [post.id, post.cap.id] : [post.id])),
      ...blueprint.wireforms.flatMap((wireform) => [
        wireform.id,
        wireform.exit.id,
        ...wireform.segments.map((segment) => segment.id),
        ...wireform.rails.map((rail) => rail.id),
        ...wireform.rails.flatMap((rail) => rail.fasteners.map((fastener) => fastener.id)),
        ...wireform.ties.map((tie) => tie.id),
        ...wireform.ties.flatMap((tie) => tie.fasteners.map((fastener) => fastener.id)),
        ...wireform.supports.flatMap((support) => [
          support.id,
          support.cap.id,
          support.foot.id,
          support.collar.id,
          support.saddle.id,
          ...support.foot.fasteners.map((fastener) => fastener.id),
          ...support.saddle.fasteners.map((fastener) => fastener.id)
        ])
      ]),
      ...blueprint.orbits.flatMap((orbit) => [orbit.id, orbit.entry.id, orbit.exit.id]),
      ...blueprint.plastics.map((item) => item.id),
      ...blueprint.plastics.flatMap((item) => item.standoffs.map((standoff) => standoff.id)),
      ...blueprint.playfieldArt.map((item) => item.id),
      ...blueprint.lampInserts.map((item) => item.id),
      ...blueprint.lampInserts.map((item) => item.lens.id),
      blueprint.plunger.id,
      blueprint.plunger.laneGroove.id,
      blueprint.plunger.housing.id,
      ...blueprint.plunger.housingFasteners.map((fastener) => fastener.id),
      blueprint.plunger.spring.id,
      blueprint.plunger.knob.id,
      ...blueprint.plunger.lowerGuides.map((guide) => guide.id),
      ...blueprint.plunger.guideFasteners.map((fastener) => fastener.id),
      blueprint.plunger.gate.id,
      blueprint.plunger.gateHingePost.id,
      blueprint.plunger.gateStopPost.id,
      ...blueprint.bumpers.flatMap((item) => [
        item.id,
        item.chromeRing.id,
        item.lampLens.id,
        ...item.capFasteners.map((fastener) => fastener.id),
        ...item.ringPostIds,
        ...item.guardSegments.map((segment) => segment.id),
        ...item.guardSegments.flatMap((segment) => segment.fasteners.map((fastener) => fastener.id))
      ])
    ]);

    for (const shot of blueprint.shots) {
      expect(shot.deviceIds.length).toBeGreaterThan(0);
      for (const id of shot.deviceIds) {
        expect(deviceIds.has(id), `${shot.id} references ${id}`).toBe(true);
      }
    }
  });
});
