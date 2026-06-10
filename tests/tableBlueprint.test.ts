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

  it("models cabinet rails, glass rim, and lockdown bar as authored hardware", () => {
    expect(blueprint.cabinet.body.id).toBe("cabinet.body");
    expect(blueprint.cabinet.backbox.id).toBe("cabinet.backbox");
    expect(blueprint.cabinet.sideRails.map((rail) => rail.id)).toEqual(
      expect.arrayContaining(["cabinet.left-side-rail", "cabinet.right-side-rail"])
    );
    expect(blueprint.cabinet.glassRims.map((rim) => rim.id)).toEqual(
      expect.arrayContaining(["cabinet.left-glass-rim", "cabinet.right-glass-rim"])
    );
    expect(blueprint.cabinet.lockdownBar.id).toBe("cabinet.lockdown-bar");
    expect(blueprint.cabinet.sideRails.every((rail) => rail.depth > blueprint.scale.playfieldLength * 0.9)).toBe(true);
    expect(blueprint.cabinet.glassRims.every((rim) => rim.depth > blueprint.scale.playfieldLength * 0.85)).toBe(true);
    expect(blueprint.cabinet.lockdownBar.width).toBeGreaterThan(blueprint.scale.playfieldWidth * 0.55);
    expect(blueprint.cabinet.dmdPanel.id).toBe("cabinet.dmd-panel");
    expect(blueprint.cabinet.dmdPanel.label).toBe("SILVERBALL SOCIAL");
    expect(blueprint.cabinet.speakerGrilles.map((grille) => grille.id)).toEqual(
      expect.arrayContaining(["cabinet.left-speaker-grille", "cabinet.right-speaker-grille"])
    );
    expect(blueprint.cabinet.speakerGrilles.every((grille) => grille.holeCount >= 6)).toBe(true);
  });

  it("contains the lower playfield devices required by the reference-board acceptance criteria", () => {
    expect(blueprint.flippers).toHaveLength(2);
    expect(blueprint.slings).toHaveLength(2);
    expect(blueprint.lanes.filter((lane) => lane.id.includes("lower"))).toHaveLength(4);
    expect(blueprint.laneWalls.filter((segment) => segment.id.includes("lane.lower"))).toHaveLength(8);
  });

  it("ties the lower inlanes and outlanes to authored rubber guide posts", () => {
    const postById = new Map(blueprint.posts.map((post) => [post.id, post]));
    const lowerLanes = blueprint.lanes.filter((lane) => lane.id.startsWith("lane.lower"));

    for (const lane of lowerLanes) {
      expect(lane.guidePostIds?.length, lane.id).toBeGreaterThanOrEqual(2);

      for (const id of lane.guidePostIds ?? []) {
        const post = postById.get(id);
        expect(post, `${lane.id} references ${id}`).toBeDefined();
        expect(post?.kind).toBe("rubber");
        expect(Math.abs((post?.z ?? 0) - lane.z)).toBeLessThan(1.6);
      }
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

  it("models flippers as blueprint-authored capsule-like bat hardware", () => {
    for (const flipper of blueprint.flippers) {
      expect(flipper.length).toBeCloseTo(1.2);
      expect(flipper.batRadius).toBeGreaterThan(blueprint.scale.ballRadius * 0.65);
      expect(flipper.batRadius).toBeLessThan(blueprint.scale.ballRadius);
      expect(flipper.pivotRadius).toBeGreaterThanOrEqual(flipper.batRadius);
      expect(flipper.rubberWidth).toBeGreaterThan(0.08);
      expect(flipper.rubberWidth).toBeLessThan(flipper.batRadius);
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
    expect(skillShot?.deviceIds).toEqual(
      expect.arrayContaining(["boundary.shooter-arch.top", "boundary.top-arch.right-curve"])
    );
  });

  it("ties the top rollover lanes to authored rubber guide posts", () => {
    const postById = new Map(blueprint.posts.map((post) => [post.id, post]));
    const topLanes = blueprint.lanes.filter((lane) => lane.side === "top");

    for (const lane of topLanes) {
      expect(lane.guidePostIds?.length, lane.id).toBeGreaterThanOrEqual(2);

      for (const id of lane.guidePostIds ?? []) {
        const post = postById.get(id);
        expect(post, `${lane.id} references ${id}`).toBeDefined();
        expect(post?.kind).toBe("rubber");
        expect(Math.abs((post?.z ?? 0) - lane.z)).toBeLessThan(0.8);
      }
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
    expect(ramp?.entranceLip.id).toBe("ramp.left.entrance-lip");
    expect(ramp?.entranceLip.kind).toBe("metal");
    expect(ramp?.supports).toHaveLength(4);
    expect(ramp?.supports.every((support) => support.kind === "metal")).toBe(true);
    expect(ramp?.supports.every((support) => support.height >= (ramp?.startY ?? 0))).toBe(true);
    expect(ramp?.supports.every((support) => support.height <= (ramp?.endY ?? 0))).toBe(true);
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
      expect(wireform.supports.length).toBeGreaterThanOrEqual(3);
      expect(wireform.supports.every((support) => support.kind === "metal")).toBe(true);
      expect(wireform.supports.every((support) => support.height <= wireform.railY)).toBe(true);
      expect(wireform.supports.every((support) => support.height >= 0.85)).toBe(true);
    }

    expect(blueprint.orbits.find((orbit) => orbit.id === "orbit.left")?.returnWireformId).toBe("wireform.left-return");
    expect(blueprint.orbits.find((orbit) => orbit.id === "orbit.right")?.returnWireformId).toBe(
      "wireform.right-orbit-return"
    );
  });

  it("models pop bumpers with separate skirts and caps", () => {
    for (const bumper of blueprint.bumpers) {
      expect(bumper.skirtRadius).toBeGreaterThan(bumper.capRadius);
      expect(bumper.radius).toBeGreaterThanOrEqual(bumper.skirtRadius);
    }
  });

  it("models the pop bumper nest with authored ring posts and rubber guards", () => {
    const postIds = new Set(blueprint.posts.map((post) => post.id));

    for (const bumper of blueprint.bumpers) {
      expect(bumper.ringPostIds).toHaveLength(3);
      expect(bumper.guardSegments.length).toBeGreaterThanOrEqual(2);
      expect(bumper.guardSegments.every((segment) => segment.id.startsWith(`${bumper.id}.`))).toBe(true);
      expect(bumper.guardSegments.every((segment) => segment.kind === "rubber")).toBe(true);

      for (const id of bumper.ringPostIds) {
        expect(postIds.has(id), id).toBe(true);
      }
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
        "target-bank.frame-right-cheek"
      ])
    );
    expect(blueprint.targetBank.posts).toHaveLength(4);
    expect(blueprint.targetBank.frameSegments.every((segment) => segment.kind === "metal")).toBe(true);
    expect(blueprint.targetBank.posts.every((post) => post.kind === "metal")).toBe(true);
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
    expect(blueprint.drain.apronFasteners).toHaveLength(8);
    expect(blueprint.drain.apronFasteners.every((fastener) => fastener.kind === "metal")).toBe(true);
    expect(blueprint.drain.drainGuides.map((guide) => guide.id)).toEqual(
      expect.arrayContaining(["drain.left-guide", "drain.right-guide", "drain.center-mouth"])
    );
    expect(blueprint.drain.drainGuides.every((guide) => guide.kind === "rubber" || guide.kind === "metal")).toBe(true);

    expect(blueprint.drain.trough.id).toBe("trough.ball-return");
    expect(blueprint.drain.trough.ballSlots).toHaveLength(3);
    expect(blueprint.drain.trough.walls.map((wall) => wall.id)).toEqual(
      expect.arrayContaining(["trough.left-wall", "trough.right-wall", "trough.back-wall"])
    );
    expect(blueprint.drain.trough.feedGuide.id).toBe("trough.shooter-feed-guide");
    expect(blueprint.drain.trough.feedGuide.kind).toBe("metal");
    expect(blueprint.drain.trough.width).toBeGreaterThan(blueprint.scale.ballRadius * 6);
  });

  it("includes layered plastics and shooter hardware from the physical reference", () => {
    expect(blueprint.plastics.length).toBeGreaterThanOrEqual(6);
    expect(blueprint.plastics.every((cover) => cover.layerY >= 0.45)).toBe(true);
    expect(blueprint.plastics.every((cover) => cover.layerY <= 0.75)).toBe(true);
    expect(blueprint.plunger.id).toBe("shooter.plunger");
    expect(blueprint.plunger.rodLength).toBeGreaterThan(1);
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
    expect(blueprint.plunger.lowerGuides.map((guide) => guide.id)).toEqual(
      expect.arrayContaining(["shooter.lower-left-guide", "shooter.lower-right-guide"])
    );
    expect(blueprint.plunger.lowerGuides.every((guide) => guide.kind === "metal")).toBe(true);
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
      blueprint.drain.id,
      blueprint.drain.apron.id,
      ...blueprint.drain.drainGuides.map((item) => item.id),
      ...blueprint.drain.apronCards.map((item) => item.id),
      ...blueprint.drain.apronFasteners.map((item) => item.id),
      blueprint.cabinet.body.id,
      blueprint.cabinet.backbox.id,
      blueprint.cabinet.dmdPanel.id,
      ...blueprint.cabinet.sideRails.map((item) => item.id),
      ...blueprint.cabinet.glassRims.map((item) => item.id),
      blueprint.cabinet.lockdownBar.id,
      ...blueprint.cabinet.speakerGrilles.map((item) => item.id),
      blueprint.drain.trough.id,
      ...blueprint.drain.trough.ballSlots.map((item) => item.id),
      ...blueprint.drain.trough.walls.map((item) => item.id),
      blueprint.drain.trough.feedGuide.id,
      ...blueprint.boundaries.map((item) => item.id),
      ...blueprint.laneWalls.map((item) => item.id),
      ...blueprint.rolloverWires.map((item) => item.id),
      ...blueprint.flipperStops.map((item) => item.id),
      ...blueprint.posts.map((item) => item.id),
      ...blueprint.posts.flatMap((item) => item.cap ? [item.cap.id] : []),
      ...blueprint.lanes.map((item) => item.id),
      ...blueprint.flippers.map((item) => item.id),
      ...blueprint.slings.flatMap((sling) => [
        sling.id,
        sling.rubberFace.id,
        sling.lamp.id,
        ...sling.postIds
      ]),
      ...blueprint.targets.map((item) => item.id),
      ...blueprint.targets.map((item) => item.rearStop.id),
      blueprint.targetBank.id,
      ...blueprint.targetBank.frameSegments.map((item) => item.id),
      ...blueprint.targetBank.posts.map((item) => item.id),
      ...blueprint.saucers.map((item) => item.id),
      ...blueprint.saucers.flatMap((saucer) => [
        ...saucer.walls.map((segment) => segment.id),
        ...saucer.posts.map((post) => post.id)
      ]),
      ...blueprint.ramps.flatMap((ramp) => [
        ramp.id,
        ramp.entry.id,
        ramp.exit.id,
        ramp.entranceLip.id,
        ...ramp.supports.map((support) => support.id)
      ]),
      ...blueprint.handoffs.flatMap((handoff) => [handoff.id, ...handoff.segments.map((segment) => segment.id)]),
      ...blueprint.wireforms.flatMap((wireform) => [
        wireform.id,
        wireform.exit.id,
        ...wireform.segments.map((segment) => segment.id),
        ...wireform.supports.map((support) => support.id)
      ]),
      ...blueprint.orbits.flatMap((orbit) => [orbit.id, orbit.entry.id, orbit.exit.id]),
      ...blueprint.plastics.map((item) => item.id),
      ...blueprint.plastics.flatMap((item) => item.standoffs.map((standoff) => standoff.id)),
      ...blueprint.lampInserts.map((item) => item.id),
      blueprint.plunger.id,
      blueprint.plunger.laneGroove.id,
      blueprint.plunger.housing.id,
      ...blueprint.plunger.lowerGuides.map((guide) => guide.id),
      blueprint.plunger.gate.id,
      ...blueprint.bumpers.flatMap((item) => [
        item.id,
        ...item.ringPostIds,
        ...item.guardSegments.map((segment) => segment.id)
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
