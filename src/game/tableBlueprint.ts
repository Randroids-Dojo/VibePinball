export interface TableScale {
  inchesPerUnit: number;
  playfieldWidth: number;
  playfieldLength: number;
  ballRadius: number;
}

export interface Segment {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  kind: "metal" | "rubber" | "wood" | "plastic" | "wire";
}

export interface Post {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "rubber" | "metal";
}

export interface SensorZone {
  id: string;
  x: number;
  z: number;
  radius: number;
}

export interface PopBumperDevice extends SensorZone {
  capRadius: number;
  skirtRadius: number;
  capColor: number;
}

export interface TargetDevice extends SensorZone {
  label: string;
  angle: number;
  rearStop: Segment;
  decalColor: number;
}

export interface LaneDevice extends SensorZone {
  label: string;
  clearance: number;
  side: "left" | "right" | "top";
}

export interface SlingDevice {
  id: string;
  side: "left" | "right";
  x: number;
  z: number;
  angle: number;
  width: number;
  depth: number;
  triangle: {
    outerX: number;
    outerZ: number;
    innerX: number;
    innerZ: number;
    noseX: number;
    noseZ: number;
  };
  rubberFace: Segment;
  lamp: LampInsert;
  impulseNormalX: number;
  impulseNormalZ: number;
  postIds: string[];
}

export interface FlipperDevice {
  id: string;
  side: "left" | "right";
  x: number;
  z: number;
  restAngle: number;
  activeAngle: number;
  length: number;
  batRadius: number;
  pivotRadius: number;
  rubberWidth: number;
}

export interface SaucerDevice extends SensorZone {
  label: string;
  holdX: number;
  holdZ: number;
  ejectX: number;
  ejectZ: number;
  ejectStrength: number;
  walls: Segment[];
  posts: Post[];
}

export interface RampPath {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle: number;
  startY: number;
  endY: number;
  floorThickness: number;
  sideRailHeight: number;
  sideRailOffset: number;
  entranceLip: Segment;
  supports: RampSupport[];
  entry: SensorZone;
  exit: SensorZone;
  returnSide: "left" | "right";
}

export interface RampSupport {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  kind: "metal";
}

export const rampSidePoint = (ramp: RampPath, offset: number) => ({
  x: ramp.x + Math.cos(ramp.angle) * offset,
  z: ramp.z - Math.sin(ramp.angle) * offset
});

export interface HandoffDevice {
  id: string;
  label: string;
  segments: Segment[];
}

export interface WireformPath {
  id: string;
  label: string;
  railY: number;
  railHeight: number;
  railOffset: number;
  tieWidth: number;
  segments: Segment[];
  supports: WireformSupport[];
  exit: SensorZone;
}

export interface WireformSupport {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  kind: "metal";
}

export interface OrbitPath {
  id: string;
  label: string;
  entry: SensorZone;
  exit: SensorZone;
  wallIds: string[];
  returnWireformId: string;
}

export interface DrainDevice extends SensorZone {
  troughX: number;
  troughZ: number;
  apron: Segment;
  drainGuides: Segment[];
  trough: TroughDevice;
}

export interface TroughDevice {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  ballSlots: SensorZone[];
  walls: Segment[];
  feedGuide: Segment;
}

export interface PlasticCover {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  color: number;
  layerY: number;
}

export interface LampInsert {
  id: string;
  label: string;
  x: number;
  z: number;
  radius: number;
  color: number;
  shape: "circle" | "arrow" | "bar";
}

export interface PlungerDevice {
  id: string;
  rodX: number;
  rodZ: number;
  rodLength: number;
  springZ: number;
  gate: Segment;
}

export interface ShotPath {
  id: string;
  label: string;
  primaryFlipper: "left" | "right" | "plunger" | "either";
  deviceIds: string[];
}

export interface TableBlueprint {
  id: "silverball-social-v1";
  scale: TableScale;
  boundaries: Segment[];
  laneWalls: Segment[];
  rolloverWires: Segment[];
  flipperStops: Segment[];
  posts: Post[];
  lanes: LaneDevice[];
  flippers: FlipperDevice[];
  slings: SlingDevice[];
  bumpers: PopBumperDevice[];
  targets: TargetDevice[];
  saucers: SaucerDevice[];
  ramps: RampPath[];
  handoffs: HandoffDevice[];
  wireforms: WireformPath[];
  orbits: OrbitPath[];
  drain: DrainDevice;
  plastics: PlasticCover[];
  lampInserts: LampInsert[];
  plunger: PlungerDevice;
  shots: ShotPath[];
}

export const silverballSocialBlueprint: TableBlueprint = {
  id: "silverball-social-v1",
  scale: {
    inchesPerUnit: 2.5,
    playfieldWidth: 8.1,
    playfieldLength: 16.8,
    ballRadius: 0.2125
  },
  boundaries: [
    { id: "boundary.left-wall", x: -4.05, z: 0, width: 0.18, depth: 7.9, kind: "metal" },
    { id: "boundary.right-wall", x: 4.05, z: 0, width: 0.18, depth: 7.9, kind: "metal" },
    { id: "boundary.top-arch.left-curve", x: -2.46, z: -6.86, width: 0.16, depth: 1.42, angle: 0.58, kind: "metal" },
    { id: "boundary.top-arch.center", x: 0, z: -7.18, width: 3.1, depth: 0.16, kind: "metal" },
    { id: "boundary.top-arch.right-curve", x: 2.24, z: -6.88, width: 0.16, depth: 1.36, angle: -0.52, kind: "metal" },
    { id: "boundary.shooter-arch.lower", x: 3.5, z: 0.95, width: 0.14, depth: 2.2, angle: -0.18, kind: "metal" },
    { id: "boundary.shooter-arch.mid", x: 3.64, z: -2.25, width: 0.14, depth: 2.36, angle: 0.04, kind: "metal" },
    { id: "boundary.shooter-arch.top", x: 3.18, z: -5.22, width: 0.14, depth: 1.62, angle: 0.46, kind: "metal" },
    { id: "boundary.left-apron", x: -2.42, z: 6.22, width: 1.22, depth: 0.2, angle: -0.36, kind: "metal" },
    { id: "boundary.right-apron", x: 2.42, z: 6.22, width: 1.22, depth: 0.2, angle: 0.36, kind: "metal" },
    { id: "boundary.apron-left-guide", x: -1.02, z: 6.95, width: 1.85, depth: 0.18, angle: 0.2, kind: "metal" },
    { id: "boundary.apron-right-guide", x: 1.02, z: 6.95, width: 1.85, depth: 0.18, angle: -0.2, kind: "metal" },
    { id: "boundary.trough-back", x: 0, z: 7.38, width: 1.3, depth: 0.14, kind: "metal" },
    { id: "boundary.shooter-divider", x: 2.72, z: 4.38, width: 0.12, depth: 2.72, kind: "metal" },
    { id: "boundary.plunger-stop", x: 3.2, z: 6.55, width: 0.68, depth: 0.16, angle: -0.18, kind: "rubber" }
  ],
  laneWalls: [
    { id: "lane.lower.left-out.outer", x: -3.55, z: 4.7, width: 0.1, depth: 1.55, angle: -0.12, kind: "rubber" },
    { id: "lane.lower.left-out.inner", x: -2.86, z: 4.86, width: 0.1, depth: 1.18, angle: 0.22, kind: "rubber" },
    { id: "lane.lower.left-in.outer", x: -2.3, z: 5.08, width: 0.1, depth: 1.0, angle: -0.28, kind: "rubber" },
    { id: "lane.lower.left-in.inner", x: -1.67, z: 5.0, width: 0.1, depth: 0.96, angle: 0.22, kind: "rubber" },
    { id: "lane.lower.right-in.inner", x: 1.67, z: 5.0, width: 0.1, depth: 0.96, angle: -0.22, kind: "rubber" },
    { id: "lane.lower.right-in.outer", x: 2.3, z: 5.08, width: 0.1, depth: 1.0, angle: 0.28, kind: "rubber" },
    { id: "lane.lower.right-out.inner", x: 2.86, z: 4.86, width: 0.1, depth: 1.18, angle: -0.22, kind: "rubber" },
    { id: "lane.lower.right-out.outer", x: 3.55, z: 4.7, width: 0.1, depth: 1.55, angle: 0.12, kind: "rubber" },
    { id: "orbit.left.outer.lower", x: -3.62, z: 0.02, width: 0.1, depth: 2.22, angle: -0.18, kind: "metal" },
    { id: "orbit.left.outer.mid", x: -3.48, z: -2.32, width: 0.1, depth: 2.28, angle: -0.04, kind: "metal" },
    { id: "orbit.left.outer.upper", x: -3.06, z: -5.34, width: 0.1, depth: 1.55, angle: 0.34, kind: "metal" },
    { id: "orbit.left.inner.lower", x: -2.82, z: 0.1, width: 0.1, depth: 1.82, angle: -0.08, kind: "metal" },
    { id: "orbit.left.inner.mid", x: -2.5, z: -2.46, width: 0.1, depth: 1.86, angle: 0.18, kind: "metal" },
    { id: "orbit.left.inner.upper", x: -2.02, z: -4.9, width: 0.1, depth: 1.28, angle: 0.46, kind: "metal" },
    { id: "orbit.right.inner.lower", x: 2.82, z: 0.1, width: 0.1, depth: 1.82, angle: 0.08, kind: "metal" },
    { id: "orbit.right.inner.mid", x: 2.5, z: -2.46, width: 0.1, depth: 1.86, angle: -0.18, kind: "metal" },
    { id: "orbit.right.inner.upper", x: 2.02, z: -4.9, width: 0.1, depth: 1.28, angle: -0.46, kind: "metal" },
    { id: "orbit.right.outer.lower", x: 3.62, z: 0.02, width: 0.1, depth: 2.22, angle: 0.18, kind: "metal" },
    { id: "orbit.right.outer.mid", x: 3.48, z: -2.32, width: 0.1, depth: 2.28, angle: 0.04, kind: "metal" },
    { id: "orbit.right.outer.upper", x: 3.06, z: -5.34, width: 0.1, depth: 1.55, angle: -0.34, kind: "metal" },
    { id: "lane.top.left.outer", x: -1.48, z: -6.52, width: 0.08, depth: 0.96, angle: -0.05, kind: "metal" },
    { id: "lane.top.left.inner", x: -0.62, z: -6.56, width: 0.08, depth: 0.98, angle: 0.04, kind: "metal" },
    { id: "lane.top.center.inner-left", x: -0.34, z: -6.7, width: 0.08, depth: 0.92, angle: -0.02, kind: "metal" },
    { id: "lane.top.center.inner-right", x: 0.34, z: -6.7, width: 0.08, depth: 0.92, angle: 0.02, kind: "metal" },
    { id: "lane.top.right.inner", x: 0.62, z: -6.56, width: 0.08, depth: 0.98, angle: -0.04, kind: "metal" },
    { id: "lane.top.right.outer", x: 1.48, z: -6.52, width: 0.08, depth: 0.96, angle: 0.05, kind: "metal" },
    { id: "lane.shooter.skill.outer", x: 2.7, z: -6.42, width: 0.08, depth: 0.98, angle: -0.06, kind: "metal" },
    { id: "lane.shooter.skill.inner", x: 3.42, z: -6.32, width: 0.08, depth: 1.1, angle: 0.08, kind: "metal" }
  ],
  rolloverWires: [
    { id: "rollover.lower.left-out", x: -3.2, z: 5.1, width: 0.48, depth: 0.035, angle: -0.12, kind: "wire" },
    { id: "rollover.lower.left-in", x: -1.98, z: 5.18, width: 0.48, depth: 0.035, angle: 0.1, kind: "wire" },
    { id: "rollover.lower.right-in", x: 1.98, z: 5.18, width: 0.48, depth: 0.035, angle: -0.1, kind: "wire" },
    { id: "rollover.lower.right-out", x: 3.2, z: 5.1, width: 0.48, depth: 0.035, angle: 0.12, kind: "wire" },
    { id: "rollover.top.left", x: -1.05, z: -6.48, width: 0.5, depth: 0.035, angle: -0.04, kind: "wire" },
    { id: "rollover.top.center", x: 0, z: -6.62, width: 0.5, depth: 0.035, kind: "wire" },
    { id: "rollover.top.right", x: 1.05, z: -6.48, width: 0.5, depth: 0.035, angle: 0.04, kind: "wire" },
    { id: "rollover.shooter.skill", x: 3.05, z: -6.35, width: 0.48, depth: 0.035, angle: 0.08, kind: "wire" }
  ],
  flipperStops: [
    { id: "flipper.left.return-stop", x: -0.66, z: 4.42, width: 0.38, depth: 0.1, angle: 0.28, kind: "rubber" },
    { id: "flipper.left.end-rubber", x: -1.93, z: 4.5, width: 0.32, depth: 0.1, angle: -0.34, kind: "rubber" },
    { id: "flipper.right.return-stop", x: 0.66, z: 4.42, width: 0.38, depth: 0.1, angle: -0.28, kind: "rubber" },
    { id: "flipper.right.end-rubber", x: 1.93, z: 4.5, width: 0.32, depth: 0.1, angle: 0.34, kind: "rubber" }
  ],
  posts: [
    { id: "post.left-out-top", x: -3.18, z: 3.92, radius: 0.13, kind: "rubber" },
    { id: "post.left-in-top", x: -2.02, z: 4.18, radius: 0.13, kind: "rubber" },
    { id: "post.left-sling-a", x: -2.55, z: 3.25, radius: 0.15, kind: "rubber" },
    { id: "post.left-sling-b", x: -1.18, z: 3.72, radius: 0.15, kind: "rubber" },
    { id: "post.right-sling-a", x: 2.55, z: 3.25, radius: 0.15, kind: "rubber" },
    { id: "post.right-sling-b", x: 1.18, z: 3.72, radius: 0.15, kind: "rubber" },
    { id: "post.right-in-top", x: 2.02, z: 4.18, radius: 0.13, kind: "rubber" },
    { id: "post.right-out-top", x: 3.18, z: 3.92, radius: 0.13, kind: "rubber" },
    { id: "post.center-left", x: -0.75, z: 1.6, radius: 0.12, kind: "rubber" },
    { id: "post.center-right", x: 0.75, z: 1.6, radius: 0.12, kind: "rubber" },
    { id: "post.upper-left", x: -2.15, z: -2.55, radius: 0.12, kind: "rubber" },
    { id: "post.upper-right", x: 2.15, z: -2.55, radius: 0.12, kind: "rubber" },
    { id: "post.top-lane-left", x: -1.8, z: -6.05, radius: 0.1, kind: "rubber" },
    { id: "post.top-lane-right", x: 1.8, z: -6.05, radius: 0.1, kind: "rubber" },
    { id: "post.drain-left", x: -0.52, z: 6.66, radius: 0.13, kind: "rubber" },
    { id: "post.drain-right", x: 0.52, z: 6.66, radius: 0.13, kind: "rubber" }
  ],
  lanes: [
    { id: "lane.lower.left-out", label: "Left outlane", x: -3.2, z: 5.1, radius: 0.32, clearance: 0.66, side: "left" },
    { id: "lane.lower.left-in", label: "Left inlane", x: -1.98, z: 5.18, radius: 0.32, clearance: 0.63, side: "left" },
    { id: "lane.lower.right-in", label: "Right inlane", x: 1.98, z: 5.18, radius: 0.32, clearance: 0.63, side: "right" },
    { id: "lane.lower.right-out", label: "Right outlane", x: 3.2, z: 5.1, radius: 0.32, clearance: 0.66, side: "right" },
    { id: "lane.top.left", label: "Top left rollover", x: -1.05, z: -6.48, radius: 0.36, clearance: 0.7, side: "top" },
    { id: "lane.top.center", label: "Top center rollover", x: 0, z: -6.62, radius: 0.36, clearance: 0.7, side: "top" },
    { id: "lane.top.right", label: "Top right rollover", x: 1.05, z: -6.48, radius: 0.36, clearance: 0.7, side: "top" },
    { id: "lane.shooter.skill", label: "Skill shot lane", x: 3.05, z: -6.35, radius: 0.34, clearance: 0.68, side: "top" }
  ],
  flippers: [
    {
      id: "flipper.left",
      side: "left",
      x: -1.35,
      z: 4.72,
      restAngle: -0.22,
      activeAngle: 0.58,
      length: 1.2,
      batRadius: 0.17,
      pivotRadius: 0.2,
      rubberWidth: 0.13
    },
    {
      id: "flipper.right",
      side: "right",
      x: 1.35,
      z: 4.72,
      restAngle: 0.22,
      activeAngle: -0.58,
      length: 1.2,
      batRadius: 0.17,
      pivotRadius: 0.2,
      rubberWidth: 0.13
    }
  ],
  slings: [
    {
      id: "sling.left",
      side: "left",
      x: -2.02,
      z: 3.62,
      angle: -0.52,
      width: 1.22,
      depth: 0.18,
      triangle: {
        outerX: -2.64,
        outerZ: 3.14,
        innerX: -1.14,
        innerZ: 3.72,
        noseX: -2.12,
        noseZ: 4.02
      },
      rubberFace: { id: "sling.left.rubber-face", x: -1.82, z: 3.48, width: 1.34, depth: 0.1, angle: -0.48, kind: "rubber" },
      lamp: { id: "insert.sling.left", label: "Left sling", x: -2.06, z: 3.62, radius: 0.18, color: 0xffe08a, shape: "circle" },
      impulseNormalX: 0.64,
      impulseNormalZ: -0.77,
      postIds: ["post.left-sling-a", "post.left-sling-b"]
    },
    {
      id: "sling.right",
      side: "right",
      x: 2.02,
      z: 3.62,
      angle: 0.52,
      width: 1.22,
      depth: 0.18,
      triangle: {
        outerX: 2.64,
        outerZ: 3.14,
        innerX: 1.14,
        innerZ: 3.72,
        noseX: 2.12,
        noseZ: 4.02
      },
      rubberFace: { id: "sling.right.rubber-face", x: 1.82, z: 3.48, width: 1.34, depth: 0.1, angle: 0.48, kind: "rubber" },
      lamp: { id: "insert.sling.right", label: "Right sling", x: 2.06, z: 3.62, radius: 0.18, color: 0xffe08a, shape: "circle" },
      impulseNormalX: -0.64,
      impulseNormalZ: -0.77,
      postIds: ["post.right-sling-a", "post.right-sling-b"]
    }
  ],
  bumpers: [
    { id: "pop-a", x: -1.25, z: -4.95, radius: 0.68, capRadius: 0.45, skirtRadius: 0.58, capColor: 0xd74b3f },
    { id: "pop-b", x: 1.15, z: -5.16, radius: 0.68, capRadius: 0.45, skirtRadius: 0.58, capColor: 0xd74b3f },
    { id: "pop-c", x: -0.05, z: -3.86, radius: 0.64, capRadius: 0.42, skirtRadius: 0.55, capColor: 0xf1c453 }
  ],
  targets: [
    {
      id: "target-bank-1",
      label: "S",
      x: -1.28,
      z: -2.44,
      radius: 0.35,
      angle: 0.18,
      decalColor: 0xffd56f,
      rearStop: { id: "target-bank-1.rear-stop", x: -1.28, z: -2.72, width: 0.42, depth: 0.08, angle: 0.18, kind: "rubber" }
    },
    {
      id: "target-bank-2",
      label: "O",
      x: -0.64,
      z: -2.6,
      radius: 0.35,
      angle: 0.08,
      decalColor: 0xffd56f,
      rearStop: { id: "target-bank-2.rear-stop", x: -0.64, z: -2.88, width: 0.42, depth: 0.08, angle: 0.08, kind: "rubber" }
    },
    {
      id: "target-bank-3",
      label: "C",
      x: 0,
      z: -2.68,
      radius: 0.35,
      angle: 0,
      decalColor: 0xffd56f,
      rearStop: { id: "target-bank-3.rear-stop", x: 0, z: -2.96, width: 0.42, depth: 0.08, kind: "rubber" }
    },
    {
      id: "target-bank-4",
      label: "I",
      x: 0.64,
      z: -2.6,
      radius: 0.35,
      angle: -0.08,
      decalColor: 0xffd56f,
      rearStop: { id: "target-bank-4.rear-stop", x: 0.64, z: -2.88, width: 0.42, depth: 0.08, angle: -0.08, kind: "rubber" }
    },
    {
      id: "target-bank-5",
      label: "A",
      x: 1.28,
      z: -2.44,
      radius: 0.35,
      angle: -0.18,
      decalColor: 0xffd56f,
      rearStop: { id: "target-bank-5.rear-stop", x: 1.28, z: -2.72, width: 0.42, depth: 0.08, angle: -0.18, kind: "rubber" }
    }
  ],
  saucers: [
    {
      id: "lock.saucer",
      label: "Lock",
      x: 0.92,
      z: -3.42,
      radius: 0.48,
      holdX: 0.92,
      holdZ: -3.42,
      ejectX: 1.8,
      ejectZ: 2.4,
      ejectStrength: 1.85,
      walls: [
        { id: "lock.saucer.back-wall", x: 0.92, z: -3.76, width: 0.82, depth: 0.06, kind: "metal" },
        { id: "lock.saucer.left-entry-wall", x: 0.54, z: -3.36, width: 0.06, depth: 0.52, angle: -0.28, kind: "metal" },
        { id: "lock.saucer.right-entry-wall", x: 1.3, z: -3.28, width: 0.06, depth: 0.54, angle: 0.34, kind: "metal" },
        { id: "lock.saucer.eject-guide", x: 1.42, z: -2.96, width: 0.06, depth: 0.72, angle: -0.62, kind: "wire" }
      ],
      posts: [
        { id: "lock.saucer.left-post", x: 0.5, z: -3.08, radius: 0.1, kind: "metal" },
        { id: "lock.saucer.right-post", x: 1.34, z: -3.02, radius: 0.1, kind: "metal" }
      ]
    }
  ],
  ramps: [
    {
      id: "ramp.left",
      label: "Left ramp",
      x: -2.22,
      z: -0.72,
      width: 0.92,
      depth: 4.55,
      angle: -0.2,
      startY: 0.28,
      endY: 0.95,
      floorThickness: 0.08,
      sideRailHeight: 0.42,
      sideRailOffset: 0.52,
      entranceLip: { id: "ramp.left.entrance-lip", x: -2.02, z: 1.38, width: 0.94, depth: 0.08, angle: -0.2, kind: "metal" },
      supports: [
        { id: "ramp.left.support.entry", x: -1.92, z: 1.02, height: 0.36, radius: 0.045, kind: "metal" },
        { id: "ramp.left.support.lower", x: -2.1, z: -0.08, height: 0.52, radius: 0.045, kind: "metal" },
        { id: "ramp.left.support.mid", x: -2.34, z: -1.18, height: 0.74, radius: 0.045, kind: "metal" },
        { id: "ramp.left.support.crest", x: -2.56, z: -2.28, height: 0.94, radius: 0.045, kind: "metal" }
      ],
      entry: { id: "ramp.left.entry", x: -2.08, z: 1.42, radius: 0.48 },
      exit: { id: "ramp.left.exit", x: -2.48, z: 4.72, radius: 0.42 },
      returnSide: "left"
    }
  ],
  handoffs: [
    {
      id: "handoff.ramp-left-entry",
      label: "Left ramp entry flap",
      segments: [
        { id: "handoff.ramp-left-entry.flap", x: -1.78, z: 1.63, width: 0.74, depth: 0.06, angle: -0.2, kind: "metal" },
        { id: "handoff.ramp-left-entry.left-guide", x: -2.6, z: 1.14, width: 0.07, depth: 0.86, angle: -0.36, kind: "wire" },
        { id: "handoff.ramp-left-entry.right-guide", x: -1.58, z: 1.06, width: 0.07, depth: 0.84, angle: -0.06, kind: "wire" }
      ]
    },
    {
      id: "handoff.ramp-left-exit",
      label: "Left wireform to inlane handoff",
      segments: [
        { id: "handoff.ramp-left-exit.left-guide", x: -2.38, z: 4.45, width: 0.06, depth: 0.78, angle: -0.22, kind: "wire" },
        { id: "handoff.ramp-left-exit.right-guide", x: -1.8, z: 4.56, width: 0.06, depth: 0.76, angle: 0.18, kind: "wire" }
      ]
    },
    {
      id: "handoff.right-orbit-exit",
      label: "Right orbit return handoff",
      segments: [
        { id: "handoff.right-orbit-exit.left-guide", x: 1.82, z: 4.52, width: 0.06, depth: 0.78, angle: -0.18, kind: "wire" },
        { id: "handoff.right-orbit-exit.right-guide", x: 2.38, z: 4.42, width: 0.06, depth: 0.74, angle: 0.22, kind: "wire" }
      ]
    },
    {
      id: "handoff.upper-orbit-gates",
      label: "Upper orbit gates",
      segments: [
        { id: "handoff.upper-orbit-gates.left", x: -2.06, z: -5.86, width: 0.58, depth: 0.06, angle: 0.38, kind: "metal" },
        { id: "handoff.upper-orbit-gates.right", x: 2.12, z: -5.82, width: 0.58, depth: 0.06, angle: -0.38, kind: "metal" }
      ]
    }
  ],
  wireforms: [
    {
      id: "wireform.left-return",
      label: "Left ramp return",
      railY: 1.08,
      railHeight: 0.22,
      railOffset: 0.25,
      tieWidth: 0.56,
      exit: { id: "wireform.left-return.exit", x: -2.18, z: 4.86, radius: 0.4 },
      segments: [
        { id: "wireform.left-return.upper", x: -2.72, z: -1.4, width: 0.08, depth: 2.9, angle: -0.2, kind: "wire" },
        { id: "wireform.left-return.lower", x: -2.44, z: 2.28, width: 0.08, depth: 3.5, angle: 0.08, kind: "wire" }
      ],
      supports: [
        { id: "wireform.left-return.support.upper", x: -2.54, z: -2.42, height: 1.02, radius: 0.04, kind: "metal" },
        { id: "wireform.left-return.support.mid", x: -2.62, z: 0.12, height: 1.04, radius: 0.04, kind: "metal" },
        { id: "wireform.left-return.support.exit", x: -2.24, z: 3.86, height: 0.98, radius: 0.04, kind: "metal" }
      ]
    },
    {
      id: "wireform.right-orbit-return",
      label: "Right orbit return",
      railY: 1.16,
      railHeight: 0.24,
      railOffset: 0.26,
      tieWidth: 0.58,
      exit: { id: "wireform.right-orbit-return.exit", x: 2.18, z: 4.86, radius: 0.4 },
      segments: [
        { id: "wireform.right-orbit-return.upper", x: 2.88, z: -3.2, width: 0.08, depth: 3.3, angle: 0.22, kind: "wire" },
        { id: "wireform.right-orbit-return.lower", x: 2.5, z: 1.15, width: 0.08, depth: 4.4, angle: -0.08, kind: "wire" }
      ],
      supports: [
        { id: "wireform.right-orbit-return.support.upper", x: 2.78, z: -4.42, height: 1.1, radius: 0.04, kind: "metal" },
        { id: "wireform.right-orbit-return.support.mid", x: 2.72, z: -1.08, height: 1.12, radius: 0.04, kind: "metal" },
        { id: "wireform.right-orbit-return.support.exit", x: 2.28, z: 3.78, height: 1.02, radius: 0.04, kind: "metal" }
      ]
    }
  ],
  orbits: [
    {
      id: "orbit.left",
      label: "Left orbit",
      entry: { id: "orbit.left.entry", x: -3.02, z: 1.1, radius: 0.42 },
      exit: { id: "orbit.left.exit", x: -1.05, z: -6.48, radius: 0.36 },
      wallIds: [
        "orbit.left.outer.lower",
        "orbit.left.outer.mid",
        "orbit.left.outer.upper",
        "orbit.left.inner.lower",
        "orbit.left.inner.mid",
        "orbit.left.inner.upper"
      ],
      returnWireformId: "wireform.left-return"
    },
    {
      id: "orbit.right",
      label: "Right orbit",
      entry: { id: "orbit.right.entry", x: 3.02, z: 1.1, radius: 0.42 },
      exit: { id: "orbit.right.exit", x: 2.74, z: -5.35, radius: 0.4 },
      wallIds: [
        "orbit.right.outer.lower",
        "orbit.right.outer.mid",
        "orbit.right.outer.upper",
        "orbit.right.inner.lower",
        "orbit.right.inner.mid",
        "orbit.right.inner.upper"
      ],
      returnWireformId: "wireform.right-orbit-return"
    }
  ],
  drain: {
    id: "drain.center",
    x: 0,
    z: 7.18,
    radius: 0.62,
    troughX: 0,
    troughZ: 7.55,
    apron: { id: "apron.lower-card", x: 0, z: 7.0, width: 5.25, depth: 1.04, kind: "wood" },
    drainGuides: [
      { id: "drain.left-guide", x: -0.82, z: 6.58, width: 0.08, depth: 0.92, angle: -0.42, kind: "rubber" },
      { id: "drain.right-guide", x: 0.82, z: 6.58, width: 0.08, depth: 0.92, angle: 0.42, kind: "rubber" },
      { id: "drain.center-mouth", x: 0, z: 6.92, width: 1.08, depth: 0.08, kind: "metal" }
    ],
    trough: {
      id: "trough.ball-return",
      x: 0,
      z: 7.55,
      width: 1.82,
      depth: 0.36,
      ballSlots: [
        { id: "trough.slot-1", x: -0.52, z: 7.54, radius: 0.18 },
        { id: "trough.slot-2", x: 0, z: 7.54, radius: 0.18 },
        { id: "trough.slot-3", x: 0.52, z: 7.54, radius: 0.18 }
      ],
      walls: [
        { id: "trough.left-wall", x: -0.96, z: 7.55, width: 0.06, depth: 0.44, kind: "metal" },
        { id: "trough.right-wall", x: 0.96, z: 7.55, width: 0.06, depth: 0.44, kind: "metal" },
        { id: "trough.back-wall", x: 0, z: 7.76, width: 1.92, depth: 0.06, kind: "metal" }
      ],
      feedGuide: { id: "trough.shooter-feed-guide", x: 1.62, z: 7.34, width: 0.08, depth: 0.86, angle: -0.58, kind: "metal" }
    }
  },
  plastics: [
    { id: "plastic.left-lane-cover", x: -2.72, z: 3.72, width: 1.42, depth: 1.05, angle: -0.36, color: 0xf6d174, layerY: 0.62 },
    { id: "plastic.right-lane-cover", x: 2.72, z: 3.72, width: 1.42, depth: 1.05, angle: 0.36, color: 0xf6d174, layerY: 0.62 },
    { id: "plastic.left-sling-cover", x: -1.92, z: 3.34, width: 1.32, depth: 0.72, angle: -0.5, color: 0xffe6ac, layerY: 0.58 },
    { id: "plastic.right-sling-cover", x: 1.92, z: 3.34, width: 1.32, depth: 0.72, angle: 0.5, color: 0xffe6ac, layerY: 0.58 },
    { id: "plastic.bumper-nest-cover", x: 0, z: -4.8, width: 3.4, depth: 1.72, color: 0xf3cf6e, layerY: 0.78 },
    { id: "plastic.shooter-arch-cover", x: 2.9, z: -5.75, width: 1.2, depth: 1.55, angle: 0.18, color: 0x9fd0ff, layerY: 0.68 }
  ],
  lampInserts: [
    { id: "insert.bonus-1", label: "Bonus 1", x: -0.66, z: 2.72, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.bonus-2", label: "Bonus 2", x: 0, z: 2.55, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.bonus-3", label: "Bonus 3", x: 0.66, z: 2.72, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.left-ramp-arrow", label: "Ramp", x: -1.72, z: 0.74, radius: 0.2, color: 0x9fd0ff, shape: "arrow" },
    { id: "insert.left-orbit-arrow", label: "Orbit", x: -2.82, z: 0.42, radius: 0.2, color: 0x76ff8f, shape: "arrow" },
    { id: "insert.right-orbit-arrow", label: "Orbit", x: 2.82, z: 0.42, radius: 0.2, color: 0x76ff8f, shape: "arrow" },
    { id: "insert.lock-ready", label: "Lock", x: 0.9, z: -2.92, radius: 0.18, color: 0xff4b4b, shape: "bar" },
    { id: "insert.jackpot", label: "Jackpot", x: 0, z: -1.42, radius: 0.22, color: 0xf4d35e, shape: "bar" },
    { id: "insert.skill-shot", label: "Skill", x: 3.04, z: -5.78, radius: 0.18, color: 0x5fd4ff, shape: "arrow" },
    { id: "insert.social-s", label: "S", x: -1.28, z: -1.98, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-o", label: "O", x: -0.64, z: -2.14, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-c", label: "C", x: 0, z: -2.22, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-i", label: "I", x: 0.64, z: -2.14, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-a", label: "A", x: 1.28, z: -1.98, radius: 0.12, color: 0xffd56f, shape: "bar" }
  ],
  plunger: {
    id: "shooter.plunger",
    rodX: 3.42,
    rodZ: 5.92,
    rodLength: 1.28,
    springZ: 6.18,
    gate: { id: "shooter.one-way-gate", x: 3.06, z: -5.78, width: 0.66, depth: 0.08, angle: 0.34, kind: "metal" }
  },
  shots: [
    { id: "shot.left-orbit", label: "Left orbit", primaryFlipper: "right", deviceIds: ["orbit.left.entry", "orbit.left.exit", "handoff.upper-orbit-gates.left", "lane.top.left", "pop-a"] },
    { id: "shot.left-ramp", label: "Left ramp", primaryFlipper: "right", deviceIds: ["ramp.left.entry", "ramp.left.exit", "wireform.left-return.exit"] },
    { id: "shot.center-bank", label: "Center target bank", primaryFlipper: "either", deviceIds: ["target-bank-1", "target-bank-1.rear-stop", "target-bank-2", "target-bank-2.rear-stop", "target-bank-3", "target-bank-3.rear-stop", "target-bank-4", "target-bank-4.rear-stop", "target-bank-5", "target-bank-5.rear-stop"] },
    { id: "shot.lock-saucer", label: "Lock saucer", primaryFlipper: "left", deviceIds: ["lock.saucer", "lock.saucer.back-wall", "lock.saucer.left-entry-wall", "lock.saucer.right-entry-wall", "lock.saucer.eject-guide"] },
    { id: "shot.right-orbit", label: "Right orbit", primaryFlipper: "left", deviceIds: ["orbit.right.entry", "orbit.right.exit", "handoff.upper-orbit-gates.right", "wireform.right-orbit-return.exit"] },
    { id: "shot.skill-shot", label: "Skill shot", primaryFlipper: "plunger", deviceIds: ["trough.shooter-feed-guide", "boundary.shooter-arch.top", "boundary.top-arch.right-curve", "lane.shooter.skill", "rollover.shooter.skill"] }
  ]
};

export const targetBankSize = silverballSocialBlueprint.targets.length;
