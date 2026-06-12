/**
 * Renders a top-down SVG of every physical collider in the table blueprint.
 * Usage: pnpm exec vitest run scripts/plot-blueprint.ts (writes board-plot.svg at repo root)
 */
import { writeFileSync } from "node:fs";
import { it } from "vitest";
import { silverballSocialBlueprint as bp } from "../src/game/tableBlueprint";
import {
  saucerCupRimColliderSegments,
  targetBankColliderSegments
} from "../src/game/physics";

const SCALE = 80;
const PAD = 60;
const W = bp.playfield.width * SCALE + PAD * 2;
const H = (bp.playfield.depth + 1.6) * SCALE + PAD * 2;

const px = (x: number) => x * SCALE + W / 2;
const pz = (z: number) => z * SCALE + H / 2;

interface SegmentLike {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
}

const parts: string[] = [];

const rect = (seg: SegmentLike, fill: string, opacity = 0.9) => {
  const angle = ((seg.angle ?? 0) * 180) / Math.PI;
  parts.push(
    `<g transform="translate(${px(seg.x)},${pz(seg.z)}) rotate(${angle})">` +
      `<rect x="${(-seg.width * SCALE) / 2}" y="${(-seg.depth * SCALE) / 2}" width="${seg.width * SCALE}" height="${seg.depth * SCALE}" fill="${fill}" opacity="${opacity}"><title>${seg.id}</title></rect></g>`
  );
};

const circle = (id: string, x: number, z: number, radius: number, fill: string, opacity = 0.9) => {
  parts.push(
    `<circle cx="${px(x)}" cy="${pz(z)}" r="${radius * SCALE}" fill="${fill}" opacity="${opacity}"><title>${id}</title></circle>`
  );
};

const label = (text: string, x: number, z: number, size = 9, fill = "#444") => {
  parts.push(`<text x="${px(x)}" y="${pz(z)}" font-size="${size}" fill="${fill}" text-anchor="middle">${text}</text>`);
};

rect({ id: bp.playfield.id, x: bp.playfield.x, z: bp.playfield.z, width: bp.playfield.width, depth: bp.playfield.depth }, "#f2ead8", 1);

bp.boundaries.forEach((seg) => rect(seg, "#445"));
bp.laneWalls.forEach((seg) => rect(seg, "#667"));
bp.rubberBands.forEach((seg) => rect(seg, "#a33"));
bp.rolloverWires.forEach((seg) => rect(seg, "#3a3", 0.6));
bp.flipperStops.forEach((seg) => rect(seg, "#a63"));
bp.drain.drainGuides.forEach((seg) => rect(seg, "#445"));
bp.drain.trough.walls.forEach((seg) => rect(seg, "#445"));
rect(bp.drain.trough.feedGuide, "#445");
bp.plunger.lowerGuides.forEach((seg) => rect(seg, "#445"));
rect(bp.plunger.gate, "#c83");
bp.handoffs.flatMap((handoff) => handoff.segments).forEach((seg) => rect(seg, "#88a"));
targetBankColliderSegments().forEach((seg) => rect(seg, "#955"));
saucerCupRimColliderSegments().forEach((seg) => rect(seg, "#599"));
bp.slings.forEach((sling) => rect(sling.rubberFace, "#a33"));
bp.targets.forEach((target) => rect({ id: target.face.id, x: target.face.x, z: target.face.z, width: target.face.width, depth: target.face.thickness, angle: target.face.angle }, "#d44"));

bp.posts.forEach((post) => circle(post.id, post.x, post.z, post.radius, "#222"));
bp.handoffs.flatMap((handoff) => handoff.posts ?? []).forEach((post) => circle(post.id, post.x, post.z, post.radius, "#222"));
bp.targetBank.posts.forEach((post) => circle(post.id, post.x, post.z, post.radius, "#222"));
bp.bumpers.forEach((bumper) => {
  circle(bumper.id, bumper.x, bumper.z, bumper.skirtRadius, "#d66", 0.7);
  bumper.guardSegments.forEach((seg) => rect(seg, "#a63"));
});
bp.saucers.forEach((saucer) => {
  circle(saucer.id, saucer.x, saucer.z, saucer.radius, "#5cc", 0.4);
  saucer.posts.forEach((post) => circle(post.id, post.x, post.z, post.radius, "#222"));
  saucer.walls.forEach((seg) => rect(seg, "#445"));
});
bp.ramps.forEach((ramp) => {
  rect({ id: ramp.id, x: ramp.x, z: ramp.z, width: ramp.width, depth: ramp.depth, angle: ramp.angle }, "#7af", 0.35);
  rect(ramp.entranceLip, "#36c");
  ramp.supports.forEach((support) => circle(support.id, support.x, support.z, support.radius, "#36c"));
});
bp.wireforms.forEach((wireform) => {
  wireform.rails.forEach((rail) => rect({ id: rail.id, x: rail.x, z: rail.z, width: rail.width, depth: rail.depth, angle: rail.angle }, "#fa3", 0.7));
  wireform.supports.forEach((support) => circle(support.id, support.x, support.z, support.radius, "#fa3"));
});
bp.lanes.forEach((lane) => {
  circle(lane.id, lane.x, lane.z, lane.radius, "#9c6", 0.3);
  label(lane.id.replace("lane.", ""), lane.x, lane.z, 8);
});
bp.flippers.forEach((flipper) => {
  circle(`${flipper.id}.pivot`, flipper.x, flipper.z, flipper.pivotRadius, "#06c");
  const reach = flipper.side === "left" ? flipper.length : -flipper.length;
  parts.push(
    `<line x1="${px(flipper.x)}" y1="${pz(flipper.z)}" x2="${px(flipper.x + Math.cos(flipper.restAngle) * reach)}" y2="${pz(flipper.z + Math.sin(flipper.restAngle) * (flipper.side === "left" ? 1 : 1) * Math.abs(reach) * 0)}" stroke="#06c" stroke-width="${0.34 * SCALE}" stroke-linecap="round" opacity="0.8"/>`
  );
});
circle("drain.mouth", bp.drain.x, bp.drain.z, bp.drain.radius, "#000", 0.5);
circle("ball.start", 3.18, 5.55, bp.scale.ballRadius, "#c0c", 1);
circle("plunger.rod", bp.plunger.rodX, bp.plunger.rodZ, 0.08, "#c0c", 1);

for (let gx = -4; gx <= 4; gx += 1) {
  parts.push(`<line x1="${px(gx)}" y1="${pz(-7.6)}" x2="${px(gx)}" y2="${pz(8.2)}" stroke="#ccc" stroke-width="0.5"/>`);
  label(String(gx), gx, -7.7, 11, "#888");
}
for (let gz = -7; gz <= 8; gz += 1) {
  parts.push(`<line x1="${px(-4.2)}" y1="${pz(gz)}" x2="${px(4.2)}" y2="${pz(gz)}" stroke="#ccc" stroke-width="0.5"/>`);
  label(String(gz), -4.35, gz, 11, "#888");
}

it("writes the blueprint plot", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#fff"/>${parts.join("\n")}</svg>`;
  writeFileSync("board-plot.svg", svg);
});
