export interface TableScale {
  inchesPerUnit: number;
  playfieldWidth: number;
  playfieldLength: number;
  ballRadius: number;
}

export interface PlayfieldDeck {
  id: "playfield.deck";
  x: number;
  z: number;
  width: number;
  depth: number;
  thickness: number;
  surfaceY: number;
  slopeAngle: number;
  woodColor: number;
  gravity: {
    x: number;
    y: number;
    z: number;
  };
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

export interface BoundarySegment extends Segment {
  kind: "metal" | "rubber";
  fasteners: BoundaryFastener[];
}

export interface BoundaryFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface RolloverWire extends Segment {
  kind: "wire";
  fasteners: RolloverWireFastener[];
}

export interface RolloverWireFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface LaneWallSegment extends Segment {
  kind: "metal" | "rubber";
  fasteners: LaneWallFastener[];
}

export interface LaneWallFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface FlipperStop extends Segment {
  kind: "rubber";
  fasteners: FlipperStopFastener[];
}

export interface FlipperStopFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface CabinetHardware {
  body: CabinetBox;
  backbox: CabinetBox;
  legs: CabinetLeg[];
  sideArtPanels: CabinetSideArtPanel[];
  controlButtons: CabinetControlButton[];
  sideRails: Segment[];
  glassRims: Segment[];
  glassPanel: CabinetGlassPanel;
  lockdownBar: Segment;
  fasteners: CabinetFastener[];
  dmdPanel: CabinetDisplayPanel;
  speakerGrilles: SpeakerGrille[];
  headerPanel: CabinetHeaderPanel;
  topperLights: CabinetTopperLight[];
}

export interface CabinetBox {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
}

export interface CabinetLeg {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  tiltX: number;
  tiltZ: number;
  color: number;
  leveler: CabinetLevelerFoot;
  kind: "metal";
}

export interface CabinetLevelerFoot {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
  kind: "metal";
}

export interface CabinetSideArtPanel {
  id: string;
  side: "left" | "right";
  label: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  emissive: number;
  fasteners: CabinetSideArtFastener[];
}

export interface CabinetSideArtFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface CabinetControlButton {
  id: string;
  action: "left-flipper" | "right-flipper" | "start";
  label: string;
  side: "left" | "right" | "front";
  x: number;
  y: number;
  z: number;
  radius: number;
  depth: number;
  color: number;
  emissive: number;
  bezelRadius: number;
  bezelDepth: number;
  kind: "button";
}

export interface CabinetDisplayPanel {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  emissive: number;
}

export interface CabinetGlassPanel {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  thickness: number;
  color: number;
  opacity: number;
  kind: "glass";
}

export interface CabinetFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface SpeakerGrille {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  holeCount: number;
  color: number;
  fasteners: SpeakerGrilleFastener[];
}

export interface SpeakerGrilleFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface CabinetHeaderPanel {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  emissive: number;
  fasteners: CabinetHeaderFastener[];
}

export interface CabinetHeaderFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface CabinetTopperLight {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
  color: number;
  emissive: number;
  kind: "lamp";
}

export interface ArcadeHallContext {
  floor: ArcadeHallFloor;
  backWall: ArcadeHallPanel[];
  sideMachines: ArcadeHallMachine[];
  overheadLights: ArcadeHallLight[];
}

export interface ArcadeHallFloor {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  color: number;
}

export interface ArcadeHallPanel {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  emissive?: number;
}

export interface ArcadeHallMachine {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  angle: number;
  cabinetColor: number;
  screenColor: number;
}

export interface ArcadeHallLight {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: number;
  intensity: number;
}

export interface Post {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "rubber" | "metal";
  cap?: PostCap;
}

export interface PostCap {
  id: string;
  radius: number;
  height: number;
  kind: "metal";
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
  skirt: PopBumperSkirt;
  chromeRing: PopBumperChromeRing;
  lampLens: PopBumperLampLens;
  capFasteners: PopBumperCapFastener[];
  ringPostIds: string[];
  guardSegments: PopBumperGuardSegment[];
}

export interface PopBumperSkirt {
  id: string;
  x: number;
  z: number;
  radius: number;
  height: number;
  color: number;
  kind: "switch-skirt";
}

export interface PopBumperLampLens {
  id: string;
  x: number;
  z: number;
  radius: number;
  height: number;
  color: number;
  kind: "clear-plastic";
}

export interface PopBumperChromeRing {
  id: string;
  radius: number;
  tubeRadius: number;
  kind: "metal";
}

export interface PopBumperCapFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface PopBumperGuardSegment extends Segment {
  kind: "rubber";
  fasteners: PopBumperGuardFastener[];
}

export interface PopBumperGuardFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface TargetDevice extends SensorZone {
  label: string;
  angle: number;
  face: TargetFace;
  lampInsertId: string;
  rearStop: Segment;
  mountPlate: TargetMountPlate;
  mountFasteners: TargetMountFastener[];
  decalColor: number;
}

export interface TargetFace {
  id: string;
  x: number;
  z: number;
  width: number;
  height: number;
  thickness: number;
  angle?: number;
  color: number;
  kind: "plastic";
}

export interface TargetMountPlate extends Segment {
  kind: "metal";
}

export interface TargetMountFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface TargetBankFrameSegment extends Segment {
  kind: "metal";
  fasteners: TargetBankFrameFastener[];
}

export interface TargetBankFrameFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface TargetBankHardware {
  id: string;
  label: string;
  frameSegments: TargetBankFrameSegment[];
  posts: Post[];
}

export interface LaneDevice extends SensorZone {
  label: string;
  clearance: number;
  side: "left" | "right" | "top";
  guidePostIds?: string[];
  rubberBandIds?: string[];
  guideCover?: LaneGuideCover;
  lampInsertId?: string;
}

export interface RubberBand extends Segment {
  kind: "rubber";
  startPostId: string;
  endPostId: string;
}

export interface LaneGuideCover {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  color: number;
  layerY: number;
  fasteners: LaneGuideCoverFastener[];
}

export interface LaneGuideCoverFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
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
  topPlastic: SlingTopPlastic;
  lamp: LampInsert;
  impulseNormalX: number;
  impulseNormalZ: number;
  postIds: string[];
}

export interface SlingTopPlastic {
  id: string;
  layerY: number;
  thickness: number;
  color: number;
  fasteners: SlingTopPlasticFastener[];
}

export interface SlingTopPlasticFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
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
  rubberSleeve: FlipperRubberSleeve;
  pivotCap: FlipperPivotCap;
  batFasteners: FlipperBatFastener[];
}

export interface FlipperRubberSleeve {
  id: string;
  localX: number;
  length: number;
  radius: number;
  thickness: number;
  color: number;
  kind: "rubber";
}

export interface FlipperPivotCap {
  id: string;
  radius: number;
  height: number;
  kind: "metal";
}

export interface FlipperBatFastener {
  id: string;
  localX: number;
  localZ: number;
  radius: number;
  kind: "metal";
}

export interface SaucerDevice extends SensorZone {
  label: string;
  cup: SaucerCup;
  captureSensor: SaucerCaptureSensor;
  heldBallMarker: SaucerHoldMarker;
  holdX: number;
  holdZ: number;
  ejectX: number;
  ejectZ: number;
  ejectStrength: number;
  walls: SaucerWallSegment[];
  posts: Post[];
}

export interface SaucerWallSegment extends Segment {
  kind: "metal" | "wire";
  fasteners: SaucerWallFastener[];
}

export interface SaucerCup {
  id: string;
  innerRadius: number;
  outerRadius: number;
  height: number;
  fasteners: SaucerCupFastener[];
  kind: "metal";
}

export interface SaucerCaptureSensor {
  id: string;
  x: number;
  z: number;
  radius: number;
  height: number;
  color: number;
  kind: "capture-sensor";
}

export interface SaucerHoldMarker {
  id: string;
  x: number;
  z: number;
  radius: number;
  color: number;
  kind: "locked-ball-marker";
}

export interface SaucerCupFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface SaucerWallFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
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
  sideWalls: RampSideWall[];
  sideRails: RampSideRail[];
  crossBraces: RampCrossBrace[];
  entranceLip: RampEntranceLip;
  supports: RampSupport[];
  entry: SensorZone;
  exit: SensorZone;
  returnSide: "left" | "right";
}

export interface RampSideWall {
  id: string;
  targetId: string;
  side: "left" | "right";
  x: number;
  z: number;
  width: number;
  depth: number;
  angle: number;
  pitch: number;
  startY: number;
  endY: number;
  height: number;
  fasteners: RampSideWallFastener[];
  kind: "plastic";
}

export interface RampSideWallFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface RampSideRail {
  id: string;
  targetId: string;
  side: "left" | "right";
  x: number;
  z: number;
  width: number;
  depth: number;
  angle: number;
  pitch: number;
  startY: number;
  endY: number;
  height: number;
  fasteners: RampSideRailFastener[];
  kind: "metal";
}

export interface RampSideRailFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface RampCrossBrace extends Segment {
  targetId: string;
  y: number;
  pitch: number;
  fasteners: RampCrossBraceFastener[];
  kind: "metal";
}

export interface RampCrossBraceFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface RampEntranceLip extends Segment {
  kind: "metal";
  fasteners: RampEntranceLipFastener[];
}

export interface RampEntranceLipFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface RampSupport {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  cap: RampSupportCap;
  foot: ElevatedSupportFoot;
  collar: ElevatedSupportCollar;
  saddle: ElevatedSupportSaddle;
  kind: "metal";
}

export interface RampSupportCap {
  id: string;
  radius: number;
  height: number;
  kind: "metal";
}

export interface ElevatedSupportFoot {
  id: string;
  targetId: string;
  radius: number;
  height: number;
  fasteners: ElevatedSupportFootFastener[];
  kind: "metal";
}

export interface ElevatedSupportFootFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface ElevatedSupportCollar {
  id: string;
  targetId: string;
  y: number;
  radius: number;
  height: number;
  kind: "metal";
}

export interface ElevatedSupportSaddle {
  id: string;
  targetId: string;
  y: number;
  width: number;
  depth: number;
  height: number;
  angle: number;
  fasteners: ElevatedSupportSaddleFastener[];
  kind: "metal";
}

export interface ElevatedSupportSaddleFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export const rampSidePoint = (ramp: Pick<RampPath, "x" | "z" | "angle">, offset: number) => ({
  x: ramp.x + Math.cos(ramp.angle) * offset,
  z: ramp.z - Math.sin(ramp.angle) * offset
});

const withElevatedSupportMounts = <Support extends { id: string; x: number; z: number; height: number; radius: number }>(
  support: Support
): Support & { foot: ElevatedSupportFoot; collar: ElevatedSupportCollar; saddle: ElevatedSupportSaddle } => {
  const plateRadius = Math.max(support.radius * 2.6, 0.12);
  const collarHeight = 0.052;
  const saddleWidth = Math.max(support.radius * 5.2, 0.24);
  const saddleDepth = Math.max(support.radius * 1.55, 0.074);
  const saddleHeight = 0.03;

  return {
    ...support,
    foot: {
      id: `${support.id}.foot`,
      targetId: support.id,
      radius: plateRadius,
      height: 0.028,
      fasteners: [
        {
          id: `${support.id}.foot.screw-left`,
          targetId: `${support.id}.foot`,
          x: support.x - plateRadius * 0.46,
          z: support.z,
          radius: 0.026,
          kind: "metal"
        },
        {
          id: `${support.id}.foot.screw-right`,
          targetId: `${support.id}.foot`,
          x: support.x + plateRadius * 0.46,
          z: support.z,
          radius: 0.026,
          kind: "metal"
        }
      ],
      kind: "metal"
    },
    collar: {
      id: `${support.id}.collar`,
      targetId: support.id,
      y: support.height - collarHeight / 2,
      radius: Math.max(support.radius * 1.72, 0.072),
      height: collarHeight,
      kind: "metal"
    },
    saddle: {
      id: `${support.id}.saddle`,
      targetId: support.id,
      y: support.height + saddleHeight / 2,
      width: saddleWidth,
      depth: saddleDepth,
      height: saddleHeight,
      angle: 0,
      fasteners: [
        {
          id: `${support.id}.saddle.screw-left`,
          targetId: `${support.id}.saddle`,
          x: support.x - saddleWidth * 0.32,
          z: support.z,
          radius: 0.022,
          kind: "metal"
        },
        {
          id: `${support.id}.saddle.screw-right`,
          targetId: `${support.id}.saddle`,
          x: support.x + saddleWidth * 0.32,
          z: support.z,
          radius: 0.022,
          kind: "metal"
        }
      ],
      kind: "metal"
    }
  };
};

export interface HandoffDevice {
  id: string;
  label: string;
  segments: HandoffSegment[];
  posts?: Post[];
}

export interface HandoffSegment extends Segment {
  kind: "metal" | "wire";
  fasteners: HandoffFastener[];
}

export interface HandoffFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface WireformPath {
  id: string;
  label: string;
  railY: number;
  railHeight: number;
  railOffset: number;
  tieWidth: number;
  segments: Segment[];
  rails: WireformRail[];
  ties: WireformTie[];
  supports: WireformSupport[];
  exit: SensorZone;
}

export interface WireformRail extends Segment {
  targetId: string;
  sourceSegmentId: string;
  side: "left" | "right";
  y: number;
  height: number;
  fasteners: WireformRailFastener[];
  kind: "wire";
}

export interface WireformRailFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface WireformTie extends Segment {
  fasteners: WireformTieFastener[];
  kind: "wire";
}

export interface WireformTieFastener {
  id: string;
  targetId: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface WireformSupport {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  cap: WireformSupportCap;
  foot: ElevatedSupportFoot;
  collar: ElevatedSupportCollar;
  saddle: ElevatedSupportSaddle;
  kind: "metal";
}

export interface WireformSupportCap {
  id: string;
  radius: number;
  height: number;
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
  apronCards: ApronCard[];
  apronFasteners: ApronFastener[];
  drainGuides: DrainGuide[];
  trough: TroughDevice;
}

export interface DrainGuide extends Segment {
  kind: "metal" | "rubber";
  fasteners: DrainGuideFastener[];
}

export interface ApronCard {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  color: number;
  protector: ApronCardProtector;
}

export interface ApronCardProtector {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  thickness: number;
  kind: "clear-plastic";
}

export interface ApronFastener {
  id: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface DrainGuideFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface TroughDevice {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  ballSlots: SensorZone[];
  slotRims: TroughSlotRim[];
  optoPairs: TroughOptoPair[];
  walls: Segment[];
  feedGuide: Segment;
  fasteners: TroughFastener[];
}

export interface TroughFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface TroughSlotRim {
  id: string;
  slotId: string;
  x: number;
  z: number;
  innerRadius: number;
  outerRadius: number;
  height: number;
  kind: "metal";
}

export interface TroughOptoPair {
  id: string;
  slotId: string;
  emitter: TroughOptoEye;
  receiver: TroughOptoEye;
  beam: TroughOptoBeam;
}

export interface TroughOptoEye {
  id: string;
  slotId: string;
  x: number;
  z: number;
  radius: number;
  height: number;
  color: number;
  kind: "opto-emitter" | "opto-receiver";
}

export interface TroughOptoBeam {
  id: string;
  slotId: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  color: number;
  kind: "opto-beam";
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
  standoffs: PlasticStandoff[];
}

export interface PlasticStandoff {
  id: string;
  x: number;
  z: number;
  height: number;
  radius: number;
  capRadius: number;
  foot: ElevatedSupportFoot;
  collar: ElevatedSupportCollar;
  kind: "metal";
}

const withPlasticStandoffMounts = (
  standoff: Omit<PlasticStandoff, "foot" | "collar">
): PlasticStandoff => {
  const footRadius = Math.max(standoff.radius * 2.55, 0.112);
  const collarHeight = 0.042;

  return {
    ...standoff,
    foot: {
      id: `${standoff.id}.foot`,
      targetId: standoff.id,
      radius: footRadius,
      height: 0.024,
      fasteners: [
        {
          id: `${standoff.id}.foot.screw-left`,
          targetId: `${standoff.id}.foot`,
          x: standoff.x - footRadius * 0.48,
          z: standoff.z,
          radius: 0.022,
          kind: "metal"
        },
        {
          id: `${standoff.id}.foot.screw-right`,
          targetId: `${standoff.id}.foot`,
          x: standoff.x + footRadius * 0.48,
          z: standoff.z,
          radius: 0.022,
          kind: "metal"
        }
      ],
      kind: "metal"
    },
    collar: {
      id: `${standoff.id}.collar`,
      targetId: standoff.id,
      y: standoff.height - collarHeight / 2,
      radius: Math.max(standoff.radius * 1.62, 0.068),
      height: collarHeight,
      kind: "metal"
    }
  };
};

export interface PlayfieldArt {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  angle?: number;
  color: number;
  layerY: number;
  kind: "zone" | "stripe" | "arrow" | "label";
}

export interface LampInsert {
  id: string;
  label: string;
  x: number;
  z: number;
  radius: number;
  angle?: number;
  color: number;
  shape: "circle" | "arrow" | "bar";
  lens: LampInsertLens;
}

export interface LampInsertLens {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  width: number;
  depth: number;
  height: number;
  angle?: number;
  color: number;
  shape: "circle" | "arrow" | "bar";
  kind: "plastic";
}

export interface PlungerDevice {
  id: string;
  rodX: number;
  rodZ: number;
  rodLength: number;
  spring: PlungerSpring;
  springRetainers: PlungerSpringRetainer[];
  stopCollar: PlungerStopCollar;
  knob: PlungerKnob;
  laneGroove: Segment;
  housing: Segment;
  housingFasteners: PlungerHousingFastener[];
  lowerGuides: Segment[];
  guideFasteners: PlungerGuideFastener[];
  gate: Segment;
  gateHingePost: Post;
  gateStopPost: Post;
}

export interface PlungerHousingFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface PlungerGuideFastener {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  kind: "metal";
}

export interface PlungerSpring {
  id: string;
  x: number;
  z: number;
  radius: number;
  tubeRadius: number;
  kind: "metal";
}

export interface PlungerSpringRetainer {
  id: string;
  targetId: string;
  x: number;
  z: number;
  radius: number;
  depth: number;
  kind: "metal";
}

export interface PlungerStopCollar {
  id: string;
  x: number;
  z: number;
  radius: number;
  depth: number;
  kind: "metal";
}

export interface PlungerKnob {
  id: string;
  x: number;
  z: number;
  radius: number;
  depth: number;
  kind: "plastic";
}

export interface ShotPath {
  id: string;
  label: string;
  primaryFlipper: "left" | "right" | "plunger" | "either" | "none";
  deviceIds: string[];
}

export interface TableBlueprint {
  id: "silverball-social-v1";
  scale: TableScale;
  playfield: PlayfieldDeck;
  cabinet: CabinetHardware;
  arcadeHall: ArcadeHallContext;
  boundaries: BoundarySegment[];
  laneWalls: LaneWallSegment[];
  rubberBands: RubberBand[];
  rolloverWires: RolloverWire[];
  flipperStops: FlipperStop[];
  posts: Post[];
  lanes: LaneDevice[];
  flippers: FlipperDevice[];
  slings: SlingDevice[];
  bumpers: PopBumperDevice[];
  targetBank: TargetBankHardware;
  targets: TargetDevice[];
  saucers: SaucerDevice[];
  ramps: RampPath[];
  handoffs: HandoffDevice[];
  wireforms: WireformPath[];
  orbits: OrbitPath[];
  drain: DrainDevice;
  plastics: PlasticCover[];
  playfieldArt: PlayfieldArt[];
  lampInserts: LampInsert[];
  plunger: PlungerDevice;
  shots: ShotPath[];
}

const withRubberPostCaps = (posts: Post[]): Post[] =>
  posts.map((post) => post.kind === "rubber"
    ? {
        ...post,
        cap: {
          id: `${post.id}.cap`,
          radius: post.radius + 0.035,
          height: 0.032,
          kind: "metal"
        }
      }
    : post);

const withBoundaryFasteners = (segments: Array<Omit<BoundarySegment, "fasteners">>): BoundarySegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const fastenerRadius = segment.kind === "rubber" ? 0.032 : 0.038;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.42;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: fastenerRadius,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: fastenerRadius,
          kind: "metal"
        }
      ]
    };
  });

const withRolloverWireFasteners = (wires: Array<Omit<RolloverWire, "fasteners">>): RolloverWire[] =>
  wires.map((wire) => {
    const angle = wire.angle ?? 0;
    const halfSpan = wire.width * 0.42;
    const offsetX = Math.cos(angle) * halfSpan;
    const offsetZ = -Math.sin(angle) * halfSpan;

    return {
      ...wire,
      fasteners: [
        {
          id: `${wire.id}.screw-left`,
          targetId: wire.id,
          x: wire.x - offsetX,
          z: wire.z - offsetZ,
          radius: 0.028,
          kind: "metal"
        },
        {
          id: `${wire.id}.screw-right`,
          targetId: wire.id,
          x: wire.x + offsetX,
          z: wire.z + offsetZ,
          radius: 0.028,
          kind: "metal"
        }
      ]
    };
  });

const withLaneWallFasteners = (segments: Array<Omit<LaneWallSegment, "fasteners">>): LaneWallSegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const fastenerRadius = segment.kind === "rubber" ? 0.028 : 0.032;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.38;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: fastenerRadius,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: fastenerRadius,
          kind: "metal"
        }
      ]
    };
  });

const withTargetBankFrameFasteners = (
  segments: Array<Omit<TargetBankFrameSegment, "fasteners">>
): TargetBankFrameSegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.38;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: 0.028,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: 0.028,
          kind: "metal"
        }
      ]
    };
  });

const withSaucerWallFasteners = (
  segments: Array<Omit<SaucerWallSegment, "fasteners">>
): SaucerWallSegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.38;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: segment.kind === "wire" ? 0.028 : 0.032,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: segment.kind === "wire" ? 0.028 : 0.032,
          kind: "metal"
        }
      ]
    };
  });

const withPopBumperGuardFasteners = (
  segments: Array<Omit<PopBumperGuardSegment, "fasteners">>
): PopBumperGuardSegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.38;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: 0.026,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: 0.026,
          kind: "metal"
        }
      ]
    };
  });

const withHandoffFasteners = (
  segments: Array<Omit<HandoffSegment, "fasteners">>
): HandoffSegment[] =>
  segments.map((segment) => {
    const angle = segment.angle ?? 0;
    const halfSpan = Math.max(segment.width, segment.depth) * 0.38;
    const offset = segment.width >= segment.depth
      ? {
          x: Math.cos(angle) * halfSpan,
          z: -Math.sin(angle) * halfSpan
        }
      : {
          x: Math.sin(angle) * halfSpan,
          z: Math.cos(angle) * halfSpan
        };

    return {
      ...segment,
      fasteners: [
        {
          id: `${segment.id}.screw-a`,
          targetId: segment.id,
          x: segment.x - offset.x,
          z: segment.z - offset.z,
          radius: segment.kind === "wire" ? 0.026 : 0.032,
          kind: "metal"
        },
        {
          id: `${segment.id}.screw-b`,
          targetId: segment.id,
          x: segment.x + offset.x,
          z: segment.z + offset.z,
          radius: segment.kind === "wire" ? 0.026 : 0.032,
          kind: "metal"
        }
      ]
    };
  });

const wireformSidePoint = (segment: Pick<Segment, "x" | "z" | "angle">, offset: number) => {
  const angle = segment.angle ?? 0;
  return {
    x: segment.x + Math.cos(angle) * offset,
    z: segment.z - Math.sin(angle) * offset
  };
};

const withWireformRails = (
  wireform: Omit<WireformPath, "rails">
): WireformPath => {
  const makeRail = (segment: Segment, side: "left" | "right", offset: number): WireformRail => {
    const point = wireformSidePoint(segment, offset);
    const angle = segment.angle ?? 0;
    const rail: Omit<WireformRail, "fasteners"> = {
      id: `${segment.id}.rail-${side}`,
      targetId: wireform.id,
      sourceSegmentId: segment.id,
      side,
      x: point.x,
      y: wireform.railY,
      z: point.z,
      width: 0.05,
      depth: segment.depth,
      angle,
      height: wireform.railHeight,
      kind: "wire"
    };
    const clampPositions = [
      { name: "entry", localZ: segment.depth * 0.38 },
      { name: "mid", localZ: 0 },
      { name: "exit", localZ: -segment.depth * 0.38 }
    ];

    return {
      ...rail,
      fasteners: clampPositions.map(({ name, localZ }) => ({
        id: `${rail.id}.clamp-${name}`,
        targetId: rail.id,
        x: rail.x + Math.sin(angle) * localZ,
        y: rail.y + rail.height / 2 + 0.016,
        z: rail.z + Math.cos(angle) * localZ,
        radius: 0.024,
        kind: "metal"
      }))
    };
  };

  return {
    ...wireform,
    rails: wireform.segments.flatMap((segment) => [
      makeRail(segment, "left", -wireform.railOffset),
      makeRail(segment, "right", wireform.railOffset)
    ])
  };
};

const withWireformTieFasteners = (
  wireform: Omit<WireformPath, "rails" | "ties"> & { ties: Array<Omit<WireformTie, "fasteners">> }
): Omit<WireformPath, "rails"> => ({
  ...wireform,
  ties: wireform.ties.map((tie) => {
    const angle = tie.angle ?? 0;
    const halfSpan = Math.max(tie.width, tie.depth) * 0.36;
    const offset = tie.width >= tie.depth
      ? { x: Math.cos(angle) * halfSpan, z: -Math.sin(angle) * halfSpan }
      : { x: Math.sin(angle) * halfSpan, z: Math.cos(angle) * halfSpan };

    return {
      ...tie,
      fasteners: [
        {
          id: `${tie.id}.screw-a`,
          targetId: tie.id,
          x: tie.x - offset.x,
          y: wireform.railY + 0.035,
          z: tie.z - offset.z,
          radius: 0.024,
          kind: "metal"
        },
        {
          id: `${tie.id}.screw-b`,
          targetId: tie.id,
          x: tie.x + offset.x,
          y: wireform.railY + 0.035,
          z: tie.z + offset.z,
          radius: 0.024,
          kind: "metal"
        }
      ]
    };
  })
});

const withRampEntranceLipFasteners = (
  lip: Omit<RampEntranceLip, "fasteners">
): RampEntranceLip => {
  const angle = lip.angle ?? 0;
  const halfSpan = Math.max(lip.width, lip.depth) * 0.36;
  const offset = lip.width >= lip.depth
    ? {
        x: Math.cos(angle) * halfSpan,
        z: -Math.sin(angle) * halfSpan
      }
    : {
        x: Math.sin(angle) * halfSpan,
        z: Math.cos(angle) * halfSpan
      };

  return {
    ...lip,
    fasteners: [
      {
        id: `${lip.id}.screw-a`,
        targetId: lip.id,
        x: lip.x - offset.x,
        z: lip.z - offset.z,
        radius: 0.032,
        kind: "metal"
      },
      {
        id: `${lip.id}.screw-b`,
        targetId: lip.id,
        x: lip.x + offset.x,
        z: lip.z + offset.z,
        radius: 0.032,
        kind: "metal"
      }
    ]
  };
};

const withRampSideRails = (
  ramp: Omit<RampPath, "sideWalls" | "sideRails" | "crossBraces">
): RampPath => {
  const rise = ramp.endY - ramp.startY;
  const pitch = Math.atan2(rise, ramp.depth);
  const slopedDepth = Math.hypot(ramp.depth, rise);
  const wallHeight = Math.min(ramp.sideRailHeight * 0.68, 0.31);
  const wallStartY = ramp.startY + ramp.floorThickness / 2 + wallHeight / 2;
  const wallEndY = ramp.endY + ramp.floorThickness / 2 + wallHeight / 2;
  const railStartY = ramp.startY + ramp.floorThickness / 2 + ramp.sideRailHeight / 2;
  const railEndY = ramp.endY + ramp.floorThickness / 2 + ramp.sideRailHeight / 2;
  const makeWall = (side: "left" | "right", offset: number): RampSideWall => {
    const point = rampSidePoint(ramp, offset);
    const wall: Omit<RampSideWall, "fasteners"> = {
      id: `${ramp.id}.side-wall.${side}`,
      targetId: ramp.id,
      side,
      x: point.x,
      z: point.z,
      width: 0.045,
      depth: slopedDepth * 0.95,
      angle: ramp.angle,
      pitch,
      startY: wallStartY,
      endY: wallEndY,
      height: wallHeight,
      kind: "plastic"
    };
    const rivetPositions = [
      { name: "lower", localZ: slopedDepth * 0.34 },
      { name: "mid", localZ: 0 },
      { name: "upper", localZ: -slopedDepth * 0.34 }
    ];

    return {
      ...wall,
      fasteners: rivetPositions.map(({ name, localZ }) => {
        const progress = 0.5 - localZ / slopedDepth;
        return {
          id: `${wall.id}.rivet-${name}`,
          targetId: wall.id,
          x: wall.x + Math.sin(wall.angle) * localZ,
          y: wall.startY + (wall.endY - wall.startY) * progress + wall.height / 2 + 0.01,
          z: wall.z + Math.cos(wall.angle) * localZ,
          radius: 0.022,
          kind: "metal"
        };
      })
    };
  };
  const makeRail = (side: "left" | "right", offset: number): RampSideRail => {
    const point = rampSidePoint(ramp, offset);
    const rail: Omit<RampSideRail, "fasteners"> = {
      id: `${ramp.id}.side-rail.${side}`,
      targetId: ramp.id,
      side,
      x: point.x,
      z: point.z,
      width: 0.07,
      depth: slopedDepth,
      angle: ramp.angle,
      pitch,
      startY: railStartY,
      endY: railEndY,
      height: ramp.sideRailHeight,
      kind: "metal"
    };
    const clampPositions = [
      { name: "lower", localZ: slopedDepth * 0.36 },
      { name: "mid", localZ: 0 },
      { name: "upper", localZ: -slopedDepth * 0.36 }
    ];

    return {
      ...rail,
      fasteners: clampPositions.map(({ name, localZ }) => {
        const progress = 0.5 - localZ / slopedDepth;
        return {
          id: `${rail.id}.clamp-${name}`,
          targetId: rail.id,
          x: rail.x + Math.sin(rail.angle) * localZ,
          y: rail.startY + (rail.endY - rail.startY) * progress + rail.height / 2 + 0.014,
          z: rail.z + Math.cos(rail.angle) * localZ,
          radius: 0.026,
          kind: "metal"
        };
      })
    };
  };
  const makeBrace = (name: string, localZ: number): RampCrossBrace => {
    const progress = 0.5 - localZ / slopedDepth;
    const y = ramp.startY + rise * progress + ramp.floorThickness / 2 + 0.018;
    const brace: Omit<RampCrossBrace, "fasteners"> = {
      id: `${ramp.id}.cross-brace.${name}`,
      targetId: ramp.id,
      x: ramp.x + Math.sin(ramp.angle) * localZ,
      y,
      z: ramp.z + Math.cos(ramp.angle) * localZ,
      width: ramp.sideRailOffset * 2 + 0.16,
      depth: 0.07,
      angle: ramp.angle,
      pitch,
      kind: "metal"
    };
    const fastenerOffset = brace.width * 0.34;

    return {
      ...brace,
      fasteners: [
        {
          id: `${brace.id}.screw-left`,
          targetId: brace.id,
          x: brace.x - Math.cos(ramp.angle) * fastenerOffset,
          y: brace.y + 0.024,
          z: brace.z + Math.sin(ramp.angle) * fastenerOffset,
          radius: 0.024,
          kind: "metal"
        },
        {
          id: `${brace.id}.screw-right`,
          targetId: brace.id,
          x: brace.x + Math.cos(ramp.angle) * fastenerOffset,
          y: brace.y + 0.024,
          z: brace.z - Math.sin(ramp.angle) * fastenerOffset,
          radius: 0.024,
          kind: "metal"
        }
      ]
    };
  };

  return {
    ...ramp,
    sideWalls: [
      makeWall("left", -ramp.sideRailOffset * 0.9),
      makeWall("right", ramp.sideRailOffset * 0.9)
    ],
    sideRails: [
      makeRail("left", -ramp.sideRailOffset),
      makeRail("right", ramp.sideRailOffset)
    ],
    crossBraces: [
      makeBrace("lower", slopedDepth * 0.34),
      makeBrace("mid", 0),
      makeBrace("upper", -slopedDepth * 0.34)
    ]
  };
};

const withSpeakerGrilleFasteners = (
  grilles: Array<Omit<SpeakerGrille, "fasteners">>
): SpeakerGrille[] =>
  grilles.map((grille) => {
    const xOffset = grille.width * 0.42;
    const yOffset = grille.height * 0.36;
    const z = grille.z + grille.depth * 0.74;

    return {
      ...grille,
      fasteners: [
        {
          id: `${grille.id}.screw-top-left`,
          targetId: grille.id,
          x: grille.x - xOffset,
          y: grille.y + yOffset,
          z,
          radius: 0.035,
          kind: "metal"
        },
        {
          id: `${grille.id}.screw-top-right`,
          targetId: grille.id,
          x: grille.x + xOffset,
          y: grille.y + yOffset,
          z,
          radius: 0.035,
          kind: "metal"
        },
        {
          id: `${grille.id}.screw-bottom-left`,
          targetId: grille.id,
          x: grille.x - xOffset,
          y: grille.y - yOffset,
          z,
          radius: 0.035,
          kind: "metal"
        },
        {
          id: `${grille.id}.screw-bottom-right`,
          targetId: grille.id,
          x: grille.x + xOffset,
          y: grille.y - yOffset,
          z,
          radius: 0.035,
          kind: "metal"
        }
      ]
    };
  });

const withLampInsertLens = (
  insert: Omit<LampInsert, "lens">
): LampInsert => ({
  ...insert,
  lens: {
    id: `${insert.id}.lens`,
    targetId: insert.id,
    x: insert.x,
    z: insert.z,
    radius: insert.radius * 1.08,
    width: insert.shape === "bar" ? insert.radius * 3.2 : insert.radius * 1.85,
    depth: insert.shape === "bar" ? insert.radius * 1.65 : insert.radius * 1.85,
    height: 0.018,
    angle: insert.angle,
    color: insert.color,
    shape: insert.shape,
    kind: "plastic"
  }
});

const withLampInsertLenses = (
  inserts: Array<Omit<LampInsert, "lens">>
): LampInsert[] => inserts.map(withLampInsertLens);

export const silverballSocialBlueprint: TableBlueprint = {
  id: "silverball-social-v1",
  scale: {
    inchesPerUnit: 2.5,
    playfieldWidth: 8.1,
    playfieldLength: 16.8,
    ballRadius: 0.2125
  },
  playfield: {
    id: "playfield.deck",
    x: 0,
    z: 0,
    width: 8.2,
    depth: 15.2,
    thickness: 0.18,
    surfaceY: 0,
    slopeAngle: 0.08,
    woodColor: 0x8d3f2f,
    gravity: {
      x: -1.25,
      y: 0,
      z: 8.8
    }
  },
  cabinet: {
    body: {
      id: "cabinet.body",
      x: 0,
      y: -0.92,
      z: 0.25,
      width: 9.8,
      height: 1.3,
      depth: 17.2,
      color: 0x24140f
    },
    backbox: {
      id: "cabinet.backbox",
      x: 0,
      y: 1.4,
      z: -8.9,
      width: 8.8,
      height: 3.2,
      depth: 0.7,
      color: 0x161b1b
    },
    legs: [
      {
        id: "cabinet.leg.front-left",
        x: -4.62,
        y: -1.06,
        z: 7.18,
        width: 0.18,
        height: 1.02,
        depth: 0.24,
        tiltX: -0.08,
        tiltZ: -0.11,
        color: 0x8f989c,
        leveler: { id: "cabinet.leg.front-left.leveler", targetId: "cabinet.leg.front-left", x: -4.7, y: -1.62, z: 7.25, radius: 0.18, height: 0.04, kind: "metal" },
        kind: "metal"
      },
      {
        id: "cabinet.leg.front-right",
        x: 4.62,
        y: -1.06,
        z: 7.18,
        width: 0.18,
        height: 1.02,
        depth: 0.24,
        tiltX: -0.08,
        tiltZ: 0.11,
        color: 0x8f989c,
        leveler: { id: "cabinet.leg.front-right.leveler", targetId: "cabinet.leg.front-right", x: 4.7, y: -1.62, z: 7.25, radius: 0.18, height: 0.04, kind: "metal" },
        kind: "metal"
      },
      {
        id: "cabinet.leg.back-left",
        x: -4.62,
        y: -1.06,
        z: -7.02,
        width: 0.18,
        height: 1.02,
        depth: 0.24,
        tiltX: 0.08,
        tiltZ: -0.11,
        color: 0x8f989c,
        leveler: { id: "cabinet.leg.back-left.leveler", targetId: "cabinet.leg.back-left", x: -4.7, y: -1.62, z: -7.09, radius: 0.18, height: 0.04, kind: "metal" },
        kind: "metal"
      },
      {
        id: "cabinet.leg.back-right",
        x: 4.62,
        y: -1.06,
        z: -7.02,
        width: 0.18,
        height: 1.02,
        depth: 0.24,
        tiltX: 0.08,
        tiltZ: 0.11,
        color: 0x8f989c,
        leveler: { id: "cabinet.leg.back-right.leveler", targetId: "cabinet.leg.back-right", x: 4.7, y: -1.62, z: -7.09, radius: 0.18, height: 0.04, kind: "metal" },
        kind: "metal"
      }
    ],
    sideArtPanels: [
      {
        id: "cabinet.side-art.left",
        side: "left",
        label: "SILVERBALL",
        x: -4.94,
        y: -0.74,
        z: 1.0,
        width: 0.06,
        height: 0.66,
        depth: 4.8,
        color: 0x7f2c22,
        emissive: 0x2b0d0a,
        fasteners: [
          { id: "cabinet.side-art.left.screw-front-top", targetId: "cabinet.side-art.left", x: -4.98, y: -0.51, z: 3.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.left.screw-front-bottom", targetId: "cabinet.side-art.left", x: -4.98, y: -0.97, z: 3.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.left.screw-back-top", targetId: "cabinet.side-art.left", x: -4.98, y: -0.51, z: -1.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.left.screw-back-bottom", targetId: "cabinet.side-art.left", x: -4.98, y: -0.97, z: -1.12, radius: 0.036, kind: "metal" }
        ]
      },
      {
        id: "cabinet.side-art.right",
        side: "right",
        label: "SOCIAL",
        x: 4.94,
        y: -0.74,
        z: 1.0,
        width: 0.06,
        height: 0.66,
        depth: 4.8,
        color: 0xf1c453,
        emissive: 0x4d3308,
        fasteners: [
          { id: "cabinet.side-art.right.screw-front-top", targetId: "cabinet.side-art.right", x: 4.98, y: -0.51, z: 3.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.right.screw-front-bottom", targetId: "cabinet.side-art.right", x: 4.98, y: -0.97, z: 3.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.right.screw-back-top", targetId: "cabinet.side-art.right", x: 4.98, y: -0.51, z: -1.12, radius: 0.036, kind: "metal" },
          { id: "cabinet.side-art.right.screw-back-bottom", targetId: "cabinet.side-art.right", x: 4.98, y: -0.97, z: -1.12, radius: 0.036, kind: "metal" }
        ]
      }
    ],
    controlButtons: [
      {
        id: "cabinet.button.left-flipper",
        action: "left-flipper",
        label: "FLIP",
        side: "left",
        x: -5.03,
        y: -0.46,
        z: 4.95,
        radius: 0.13,
        depth: 0.055,
        color: 0xd94b3d,
        emissive: 0x4d100d,
        bezelRadius: 0.17,
        bezelDepth: 0.028,
        kind: "button"
      },
      {
        id: "cabinet.button.right-flipper",
        action: "right-flipper",
        label: "FLIP",
        side: "right",
        x: 5.03,
        y: -0.46,
        z: 4.95,
        radius: 0.13,
        depth: 0.055,
        color: 0xd94b3d,
        emissive: 0x4d100d,
        bezelRadius: 0.17,
        bezelDepth: 0.028,
        kind: "button"
      },
      {
        id: "cabinet.button.start",
        action: "start",
        label: "START",
        side: "front",
        x: -3.05,
        y: -0.42,
        z: 8.92,
        radius: 0.14,
        depth: 0.06,
        color: 0xf1c453,
        emissive: 0x5f3c08,
        bezelRadius: 0.18,
        bezelDepth: 0.03,
        kind: "button"
      }
    ],
    sideRails: [
      { id: "cabinet.left-side-rail", x: -4.32, z: 0.1, width: 0.18, depth: 16.05, kind: "metal" },
      { id: "cabinet.right-side-rail", x: 4.32, z: 0.1, width: 0.18, depth: 16.05, kind: "metal" }
    ],
    glassRims: [
      { id: "cabinet.left-glass-rim", x: -3.86, z: 0.1, width: 0.06, depth: 15.35, kind: "metal" },
      { id: "cabinet.right-glass-rim", x: 3.86, z: 0.1, width: 0.06, depth: 15.35, kind: "metal" }
    ],
    glassPanel: {
      id: "cabinet.playfield-glass",
      x: 0,
      y: 0.88,
      z: 0.1,
      width: 7.55,
      depth: 15.35,
      thickness: 0.025,
      color: 0xbfe5ff,
      opacity: 0.035,
      kind: "glass"
    },
    lockdownBar: { id: "cabinet.lockdown-bar", x: 0, z: 7.68, width: 4.9, depth: 0.22, kind: "metal" },
    fasteners: [
      { id: "cabinet.left-side-rail.screw-lower", targetId: "cabinet.left-side-rail", x: -4.32, y: 0.81, z: 5.92, radius: 0.055, kind: "metal" },
      { id: "cabinet.left-side-rail.screw-mid-lower", targetId: "cabinet.left-side-rail", x: -4.32, y: 0.81, z: 2.08, radius: 0.055, kind: "metal" },
      { id: "cabinet.left-side-rail.screw-mid-upper", targetId: "cabinet.left-side-rail", x: -4.32, y: 0.81, z: -2.02, radius: 0.055, kind: "metal" },
      { id: "cabinet.left-side-rail.screw-upper", targetId: "cabinet.left-side-rail", x: -4.32, y: 0.81, z: -5.88, radius: 0.055, kind: "metal" },
      { id: "cabinet.right-side-rail.screw-lower", targetId: "cabinet.right-side-rail", x: 4.32, y: 0.81, z: 5.92, radius: 0.055, kind: "metal" },
      { id: "cabinet.right-side-rail.screw-mid-lower", targetId: "cabinet.right-side-rail", x: 4.32, y: 0.81, z: 2.08, radius: 0.055, kind: "metal" },
      { id: "cabinet.right-side-rail.screw-mid-upper", targetId: "cabinet.right-side-rail", x: 4.32, y: 0.81, z: -2.02, radius: 0.055, kind: "metal" },
      { id: "cabinet.right-side-rail.screw-upper", targetId: "cabinet.right-side-rail", x: 4.32, y: 0.81, z: -5.88, radius: 0.055, kind: "metal" },
      { id: "cabinet.left-glass-rim.screw-lower", targetId: "cabinet.left-glass-rim", x: -3.86, y: 0.88, z: 5.42, radius: 0.038, kind: "metal" },
      { id: "cabinet.left-glass-rim.screw-center", targetId: "cabinet.left-glass-rim", x: -3.86, y: 0.88, z: 0.1, radius: 0.038, kind: "metal" },
      { id: "cabinet.left-glass-rim.screw-upper", targetId: "cabinet.left-glass-rim", x: -3.86, y: 0.88, z: -5.22, radius: 0.038, kind: "metal" },
      { id: "cabinet.right-glass-rim.screw-lower", targetId: "cabinet.right-glass-rim", x: 3.86, y: 0.88, z: 5.42, radius: 0.038, kind: "metal" },
      { id: "cabinet.right-glass-rim.screw-center", targetId: "cabinet.right-glass-rim", x: 3.86, y: 0.88, z: 0.1, radius: 0.038, kind: "metal" },
      { id: "cabinet.right-glass-rim.screw-upper", targetId: "cabinet.right-glass-rim", x: 3.86, y: 0.88, z: -5.22, radius: 0.038, kind: "metal" },
      { id: "cabinet.lockdown-bar.screw-left", targetId: "cabinet.lockdown-bar", x: -1.95, y: 0.67, z: 7.68, radius: 0.06, kind: "metal" },
      { id: "cabinet.lockdown-bar.screw-center-left", targetId: "cabinet.lockdown-bar", x: -0.65, y: 0.67, z: 7.68, radius: 0.06, kind: "metal" },
      { id: "cabinet.lockdown-bar.screw-center-right", targetId: "cabinet.lockdown-bar", x: 0.65, y: 0.67, z: 7.68, radius: 0.06, kind: "metal" },
      { id: "cabinet.lockdown-bar.screw-right", targetId: "cabinet.lockdown-bar", x: 1.95, y: 0.67, z: 7.68, radius: 0.06, kind: "metal" }
    ],
    dmdPanel: {
      id: "cabinet.dmd-panel",
      label: "SILVERBALL SOCIAL",
      x: 0,
      y: 1.55,
      z: -8.5,
      width: 5.4,
      height: 0.9,
      depth: 0.08,
      color: 0xf1c453,
      emissive: 0x6f3f06
    },
    headerPanel: {
      id: "cabinet.header-panel",
      label: "LEAGUE NIGHT",
      x: 0,
      y: 2.72,
      z: -8.47,
      width: 6.35,
      height: 0.72,
      depth: 0.075,
      color: 0x7f2c22,
      emissive: 0x39110c,
      fasteners: [
        { id: "cabinet.header-panel.screw-top-left", targetId: "cabinet.header-panel", x: -2.88, y: 3.0, z: -8.42, radius: 0.036, kind: "metal" },
        { id: "cabinet.header-panel.screw-top-right", targetId: "cabinet.header-panel", x: 2.88, y: 3.0, z: -8.42, radius: 0.036, kind: "metal" },
        { id: "cabinet.header-panel.screw-bottom-left", targetId: "cabinet.header-panel", x: -2.88, y: 2.44, z: -8.42, radius: 0.036, kind: "metal" },
        { id: "cabinet.header-panel.screw-bottom-right", targetId: "cabinet.header-panel", x: 2.88, y: 2.44, z: -8.42, radius: 0.036, kind: "metal" }
      ]
    },
    topperLights: [
      { id: "cabinet.topper-light.left", targetId: "cabinet.header-panel", x: -2.55, y: 3.32, z: -8.68, radius: 0.16, height: 0.16, color: 0xf1c453, emissive: 0x5f3c08, kind: "lamp" },
      { id: "cabinet.topper-light.center", targetId: "cabinet.header-panel", x: 0, y: 3.38, z: -8.68, radius: 0.18, height: 0.18, color: 0x5fd4ff, emissive: 0x124e68, kind: "lamp" },
      { id: "cabinet.topper-light.right", targetId: "cabinet.header-panel", x: 2.55, y: 3.32, z: -8.68, radius: 0.16, height: 0.16, color: 0xf1c453, emissive: 0x5f3c08, kind: "lamp" }
    ],
    speakerGrilles: withSpeakerGrilleFasteners([
      {
        id: "cabinet.left-speaker-grille",
        x: -3.45,
        y: 1.52,
        z: -8.48,
        width: 1.08,
        height: 0.72,
        depth: 0.09,
        holeCount: 8,
        color: 0x090b0b
      },
      {
        id: "cabinet.right-speaker-grille",
        x: 3.45,
        y: 1.52,
        z: -8.48,
        width: 1.08,
        height: 0.72,
        depth: 0.09,
        holeCount: 8,
        color: 0x090b0b
      }
    ])
  },
  arcadeHall: {
    floor: {
      id: "arcade-hall.floor-mat",
      x: 0,
      y: -1.61,
      z: 1.2,
      width: 16.6,
      depth: 23.5,
      color: 0x191412
    },
    backWall: [
      {
        id: "arcade-hall.back-wall.left-panel",
        x: -4.7,
        y: 1.1,
        z: -10.05,
        width: 4.8,
        height: 3.4,
        depth: 0.12,
        color: 0x2d1c26
      },
      {
        id: "arcade-hall.back-wall.center-sign",
        x: 0,
        y: 2.7,
        z: -10,
        width: 4.3,
        height: 0.7,
        depth: 0.14,
        color: 0x332017,
        emissive: 0x61400e
      },
      {
        id: "arcade-hall.back-wall.right-panel",
        x: 4.7,
        y: 1.1,
        z: -10.05,
        width: 4.8,
        height: 3.4,
        depth: 0.12,
        color: 0x1b2b2d
      }
    ],
    sideMachines: [
      {
        id: "arcade-hall.left-neighbor-cabinet",
        x: -6.35,
        y: -0.18,
        z: -1.2,
        width: 1.15,
        height: 2.85,
        depth: 3.2,
        angle: 0.16,
        cabinetColor: 0x30213b,
        screenColor: 0x5fd4ff
      },
      {
        id: "arcade-hall.right-neighbor-cabinet",
        x: 6.35,
        y: -0.18,
        z: -1.15,
        width: 1.15,
        height: 2.85,
        depth: 3.2,
        angle: -0.16,
        cabinetColor: 0x34281b,
        screenColor: 0xf1c453
      }
    ],
    overheadLights: [
      { id: "arcade-hall.light-left", x: -3.4, y: 4.9, z: -3.6, radius: 0.32, color: 0xf6d174, intensity: 1.8 },
      { id: "arcade-hall.light-center", x: 0, y: 5.2, z: -4.4, radius: 0.36, color: 0xffe6ac, intensity: 2.2 },
      { id: "arcade-hall.light-right", x: 3.4, y: 4.9, z: -3.6, radius: 0.32, color: 0x9fd0ff, intensity: 1.45 }
    ]
  },
  boundaries: withBoundaryFasteners([
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
  ]),
  laneWalls: withLaneWallFasteners([
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
  ]),
  rubberBands: [
    {
      id: "lane.lower.left-out.rubber-band",
      x: -3.34,
      z: 4.75,
      width: 0.075,
      depth: 1.62,
      angle: -0.18,
      kind: "rubber",
      startPostId: "post.left-out-top",
      endPostId: "post.left-out-lower"
    },
    {
      id: "lane.lower.left-in.rubber-band",
      x: -1.84,
      z: 4.87,
      width: 0.075,
      depth: 1.42,
      angle: 0.16,
      kind: "rubber",
      startPostId: "post.left-in-top",
      endPostId: "post.left-in-lower"
    },
    {
      id: "lane.lower.right-in.rubber-band",
      x: 1.84,
      z: 4.87,
      width: 0.075,
      depth: 1.42,
      angle: -0.16,
      kind: "rubber",
      startPostId: "post.right-in-top",
      endPostId: "post.right-in-lower"
    },
    {
      id: "lane.lower.right-out.rubber-band",
      x: 3.34,
      z: 4.75,
      width: 0.075,
      depth: 1.62,
      angle: 0.18,
      kind: "rubber",
      startPostId: "post.right-out-top",
      endPostId: "post.right-out-lower"
    },
    {
      id: "lane.top.left.rubber-band",
      x: -1.05,
      z: -6.04,
      width: 0.06,
      depth: 0.86,
      angle: 0.03,
      kind: "rubber",
      startPostId: "post.top-lane-left-outer",
      endPostId: "post.top-lane-left-inner"
    },
    {
      id: "lane.top.center.rubber-band",
      x: 0,
      z: -6.2,
      width: 0.06,
      depth: 0.68,
      kind: "rubber",
      startPostId: "post.top-lane-center-left",
      endPostId: "post.top-lane-center-right"
    },
    {
      id: "lane.top.right.rubber-band",
      x: 1.05,
      z: -6.04,
      width: 0.06,
      depth: 0.86,
      angle: -0.03,
      kind: "rubber",
      startPostId: "post.top-lane-right-inner",
      endPostId: "post.top-lane-right-outer"
    },
    {
      id: "lane.shooter.skill.rubber-band",
      x: 3.06,
      z: -5.9,
      width: 0.06,
      depth: 0.72,
      angle: 0.06,
      kind: "rubber",
      startPostId: "post.shooter-skill-lane-inner",
      endPostId: "post.shooter-skill-lane-outer"
    }
  ],
  rolloverWires: withRolloverWireFasteners([
    { id: "rollover.lower.left-out", x: -3.2, z: 5.1, width: 0.48, depth: 0.035, angle: -0.12, kind: "wire" },
    { id: "rollover.lower.left-in", x: -1.98, z: 5.18, width: 0.48, depth: 0.035, angle: 0.1, kind: "wire" },
    { id: "rollover.lower.right-in", x: 1.98, z: 5.18, width: 0.48, depth: 0.035, angle: -0.1, kind: "wire" },
    { id: "rollover.lower.right-out", x: 3.2, z: 5.1, width: 0.48, depth: 0.035, angle: 0.12, kind: "wire" },
    { id: "rollover.top.left", x: -1.05, z: -6.48, width: 0.5, depth: 0.035, angle: -0.04, kind: "wire" },
    { id: "rollover.top.center", x: 0, z: -6.62, width: 0.5, depth: 0.035, kind: "wire" },
    { id: "rollover.top.right", x: 1.05, z: -6.48, width: 0.5, depth: 0.035, angle: 0.04, kind: "wire" },
    { id: "rollover.shooter.skill", x: 3.05, z: -6.35, width: 0.48, depth: 0.035, angle: 0.08, kind: "wire" }
  ]),
  flipperStops: [
    {
      id: "flipper.left.return-stop",
      x: -0.66,
      z: 4.42,
      width: 0.38,
      depth: 0.1,
      angle: 0.28,
      kind: "rubber",
      fasteners: [
        { id: "flipper.left.return-stop.screw-inner", targetId: "flipper.left.return-stop", x: -0.78, z: 4.38, radius: 0.032, kind: "metal" },
        { id: "flipper.left.return-stop.screw-outer", targetId: "flipper.left.return-stop", x: -0.54, z: 4.46, radius: 0.032, kind: "metal" }
      ]
    },
    {
      id: "flipper.left.end-rubber",
      x: -1.93,
      z: 4.5,
      width: 0.32,
      depth: 0.1,
      angle: -0.34,
      kind: "rubber",
      fasteners: [
        { id: "flipper.left.end-rubber.screw-inner", targetId: "flipper.left.end-rubber", x: -2.04, z: 4.54, radius: 0.03, kind: "metal" },
        { id: "flipper.left.end-rubber.screw-outer", targetId: "flipper.left.end-rubber", x: -1.82, z: 4.46, radius: 0.03, kind: "metal" }
      ]
    },
    {
      id: "flipper.right.return-stop",
      x: 0.66,
      z: 4.42,
      width: 0.38,
      depth: 0.1,
      angle: -0.28,
      kind: "rubber",
      fasteners: [
        { id: "flipper.right.return-stop.screw-inner", targetId: "flipper.right.return-stop", x: 0.78, z: 4.38, radius: 0.032, kind: "metal" },
        { id: "flipper.right.return-stop.screw-outer", targetId: "flipper.right.return-stop", x: 0.54, z: 4.46, radius: 0.032, kind: "metal" }
      ]
    },
    {
      id: "flipper.right.end-rubber",
      x: 1.93,
      z: 4.5,
      width: 0.32,
      depth: 0.1,
      angle: 0.34,
      kind: "rubber",
      fasteners: [
        { id: "flipper.right.end-rubber.screw-inner", targetId: "flipper.right.end-rubber", x: 2.04, z: 4.54, radius: 0.03, kind: "metal" },
        { id: "flipper.right.end-rubber.screw-outer", targetId: "flipper.right.end-rubber", x: 1.82, z: 4.46, radius: 0.03, kind: "metal" }
      ]
    }
  ],
  posts: withRubberPostCaps([
    { id: "post.left-out-top", x: -3.18, z: 3.92, radius: 0.13, kind: "rubber" },
    { id: "post.left-out-lower", x: -3.48, z: 5.58, radius: 0.12, kind: "rubber" },
    { id: "post.left-in-top", x: -2.02, z: 4.18, radius: 0.13, kind: "rubber" },
    { id: "post.left-in-lower", x: -1.66, z: 5.58, radius: 0.12, kind: "rubber" },
    { id: "post.left-sling-a", x: -2.55, z: 3.25, radius: 0.15, kind: "rubber" },
    { id: "post.left-sling-b", x: -1.18, z: 3.72, radius: 0.15, kind: "rubber" },
    { id: "post.right-sling-a", x: 2.55, z: 3.25, radius: 0.15, kind: "rubber" },
    { id: "post.right-sling-b", x: 1.18, z: 3.72, radius: 0.15, kind: "rubber" },
    { id: "post.right-in-top", x: 2.02, z: 4.18, radius: 0.13, kind: "rubber" },
    { id: "post.right-in-lower", x: 1.66, z: 5.58, radius: 0.12, kind: "rubber" },
    { id: "post.right-out-top", x: 3.18, z: 3.92, radius: 0.13, kind: "rubber" },
    { id: "post.right-out-lower", x: 3.48, z: 5.58, radius: 0.12, kind: "rubber" },
    { id: "post.center-left", x: -0.75, z: 1.6, radius: 0.12, kind: "rubber" },
    { id: "post.center-right", x: 0.75, z: 1.6, radius: 0.12, kind: "rubber" },
    { id: "post.upper-left", x: -2.15, z: -2.55, radius: 0.12, kind: "rubber" },
    { id: "post.upper-right", x: 2.15, z: -2.55, radius: 0.12, kind: "rubber" },
    { id: "post.top-lane-left", x: -1.8, z: -6.05, radius: 0.1, kind: "rubber" },
    { id: "post.top-lane-left-outer", x: -1.48, z: -6.02, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-left-inner", x: -0.62, z: -6.08, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-center-left", x: -0.34, z: -6.2, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-center-right", x: 0.34, z: -6.2, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-right-inner", x: 0.62, z: -6.08, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-right-outer", x: 1.48, z: -6.02, radius: 0.08, kind: "rubber" },
    { id: "post.top-lane-right", x: 1.8, z: -6.05, radius: 0.1, kind: "rubber" },
    { id: "post.shooter-skill-lane-inner", x: 2.7, z: -5.92, radius: 0.08, kind: "rubber" },
    { id: "post.shooter-skill-lane-outer", x: 3.42, z: -5.88, radius: 0.08, kind: "rubber" },
    { id: "post.pop-a.upper", x: -1.28, z: -5.62, radius: 0.095, kind: "rubber" },
    { id: "post.pop-a.outer", x: -1.86, z: -4.96, radius: 0.095, kind: "rubber" },
    { id: "post.pop-a.inner", x: -0.68, z: -4.96, radius: 0.095, kind: "rubber" },
    { id: "post.pop-b.upper", x: 1.18, z: -5.82, radius: 0.095, kind: "rubber" },
    { id: "post.pop-b.outer", x: 1.76, z: -5.16, radius: 0.095, kind: "rubber" },
    { id: "post.pop-b.inner", x: 0.58, z: -5.08, radius: 0.095, kind: "rubber" },
    { id: "post.pop-c.lower-left", x: -0.74, z: -3.54, radius: 0.095, kind: "rubber" },
    { id: "post.pop-c.lower-right", x: 0.66, z: -3.54, radius: 0.095, kind: "rubber" },
    { id: "post.pop-c.upper", x: -0.04, z: -4.56, radius: 0.095, kind: "rubber" },
    { id: "post.drain-left", x: -0.52, z: 6.66, radius: 0.13, kind: "rubber" },
    { id: "post.drain-right", x: 0.52, z: 6.66, radius: 0.13, kind: "rubber" }
  ]),
  lanes: [
    {
      id: "lane.lower.left-out",
      label: "Left outlane",
      x: -3.2,
      z: 5.1,
      radius: 0.32,
      clearance: 0.66,
      side: "left",
      guidePostIds: ["post.left-out-top", "post.left-out-lower"],
      rubberBandIds: ["lane.lower.left-out.rubber-band"],
      lampInsertId: "insert.lower.left-out-arrow",
      guideCover: {
        id: "lane.lower.left-out.guide-cover",
        x: -3.3,
        z: 4.62,
        width: 0.56,
        depth: 0.78,
        angle: -0.18,
        color: 0xf6d174,
        layerY: 0.56,
        fasteners: [
          { id: "lane.lower.left-out.guide-cover.screw-upper", x: -3.42, z: 4.28, radius: 0.035, kind: "metal" },
          { id: "lane.lower.left-out.guide-cover.screw-lower", x: -3.18, z: 4.94, radius: 0.035, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.lower.left-in",
      label: "Left inlane",
      x: -1.98,
      z: 5.18,
      radius: 0.32,
      clearance: 0.63,
      side: "left",
      guidePostIds: ["post.left-in-top", "post.left-in-lower", "post.drain-left"],
      rubberBandIds: ["lane.lower.left-in.rubber-band"],
      lampInsertId: "insert.lower.left-in-arrow",
      guideCover: {
        id: "lane.lower.left-in.guide-cover",
        x: -2.08,
        z: 4.62,
        width: 0.58,
        depth: 0.74,
        angle: -0.28,
        color: 0xffe6ac,
        layerY: 0.56,
        fasteners: [
          { id: "lane.lower.left-in.guide-cover.screw-upper", x: -2.28, z: 4.3, radius: 0.035, kind: "metal" },
          { id: "lane.lower.left-in.guide-cover.screw-lower", x: -1.9, z: 4.9, radius: 0.035, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.lower.right-in",
      label: "Right inlane",
      x: 1.98,
      z: 5.18,
      radius: 0.32,
      clearance: 0.63,
      side: "right",
      guidePostIds: ["post.right-in-top", "post.right-in-lower", "post.drain-right"],
      rubberBandIds: ["lane.lower.right-in.rubber-band"],
      lampInsertId: "insert.lower.right-in-arrow",
      guideCover: {
        id: "lane.lower.right-in.guide-cover",
        x: 2.08,
        z: 4.62,
        width: 0.58,
        depth: 0.74,
        angle: 0.28,
        color: 0xffe6ac,
        layerY: 0.56,
        fasteners: [
          { id: "lane.lower.right-in.guide-cover.screw-upper", x: 2.28, z: 4.3, radius: 0.035, kind: "metal" },
          { id: "lane.lower.right-in.guide-cover.screw-lower", x: 1.9, z: 4.9, radius: 0.035, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.lower.right-out",
      label: "Right outlane",
      x: 3.2,
      z: 5.1,
      radius: 0.32,
      clearance: 0.66,
      side: "right",
      guidePostIds: ["post.right-out-top", "post.right-out-lower"],
      rubberBandIds: ["lane.lower.right-out.rubber-band"],
      lampInsertId: "insert.lower.right-out-arrow",
      guideCover: {
        id: "lane.lower.right-out.guide-cover",
        x: 3.3,
        z: 4.62,
        width: 0.56,
        depth: 0.78,
        angle: 0.18,
        color: 0xf6d174,
        layerY: 0.56,
        fasteners: [
          { id: "lane.lower.right-out.guide-cover.screw-upper", x: 3.42, z: 4.28, radius: 0.035, kind: "metal" },
          { id: "lane.lower.right-out.guide-cover.screw-lower", x: 3.18, z: 4.94, radius: 0.035, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.top.left",
      label: "Top left rollover",
      x: -1.05,
      z: -6.48,
      radius: 0.36,
      clearance: 0.7,
      side: "top",
      guidePostIds: ["post.top-lane-left", "post.top-lane-left-outer", "post.top-lane-left-inner"],
      rubberBandIds: ["lane.top.left.rubber-band"],
      lampInsertId: "insert.top.left-arrow",
      guideCover: {
        id: "lane.top.left.guide-cover",
        x: -1.05,
        z: -6.12,
        width: 0.62,
        depth: 0.46,
        angle: -0.04,
        color: 0x9fd0ff,
        layerY: 0.64,
        fasteners: [
          { id: "lane.top.left.guide-cover.screw-left", x: -1.32, z: -6.1, radius: 0.032, kind: "metal" },
          { id: "lane.top.left.guide-cover.screw-right", x: -0.78, z: -6.14, radius: 0.032, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.top.center",
      label: "Top center rollover",
      x: 0,
      z: -6.62,
      radius: 0.36,
      clearance: 0.7,
      side: "top",
      guidePostIds: ["post.top-lane-center-left", "post.top-lane-center-right"],
      rubberBandIds: ["lane.top.center.rubber-band"],
      lampInsertId: "insert.top.center-arrow",
      guideCover: {
        id: "lane.top.center.guide-cover",
        x: 0,
        z: -6.22,
        width: 0.58,
        depth: 0.44,
        color: 0x9fd0ff,
        layerY: 0.64,
        fasteners: [
          { id: "lane.top.center.guide-cover.screw-left", x: -0.22, z: -6.2, radius: 0.032, kind: "metal" },
          { id: "lane.top.center.guide-cover.screw-right", x: 0.22, z: -6.2, radius: 0.032, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.top.right",
      label: "Top right rollover",
      x: 1.05,
      z: -6.48,
      radius: 0.36,
      clearance: 0.7,
      side: "top",
      guidePostIds: ["post.top-lane-right-inner", "post.top-lane-right-outer", "post.top-lane-right"],
      rubberBandIds: ["lane.top.right.rubber-band"],
      lampInsertId: "insert.top.right-arrow",
      guideCover: {
        id: "lane.top.right.guide-cover",
        x: 1.05,
        z: -6.12,
        width: 0.62,
        depth: 0.46,
        angle: 0.04,
        color: 0x9fd0ff,
        layerY: 0.64,
        fasteners: [
          { id: "lane.top.right.guide-cover.screw-left", x: 0.78, z: -6.14, radius: 0.032, kind: "metal" },
          { id: "lane.top.right.guide-cover.screw-right", x: 1.32, z: -6.1, radius: 0.032, kind: "metal" }
        ]
      }
    },
    {
      id: "lane.shooter.skill",
      label: "Skill shot lane",
      x: 3.05,
      z: -6.35,
      radius: 0.34,
      clearance: 0.68,
      side: "top",
      guidePostIds: ["post.shooter-skill-lane-inner", "post.shooter-skill-lane-outer"],
      rubberBandIds: ["lane.shooter.skill.rubber-band"],
      lampInsertId: "insert.skill-shot",
      guideCover: {
        id: "lane.shooter.skill.guide-cover",
        x: 3.05,
        z: -5.95,
        width: 0.56,
        depth: 0.52,
        angle: 0.12,
        color: 0x9fd0ff,
        layerY: 0.66,
        fasteners: [
          { id: "lane.shooter.skill.guide-cover.screw-inner", x: 2.82, z: -5.96, radius: 0.032, kind: "metal" },
          { id: "lane.shooter.skill.guide-cover.screw-outer", x: 3.28, z: -5.94, radius: 0.032, kind: "metal" }
        ]
      }
    }
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
      rubberWidth: 0.13,
      rubberSleeve: {
        id: "flipper.left.rubber-sleeve",
        localX: 0.6,
        length: 1.2,
        radius: 0.17,
        thickness: 0.13,
        color: 0x7f2c22,
        kind: "rubber"
      },
      pivotCap: { id: "flipper.left.pivot-cap", radius: 0.25, height: 0.055, kind: "metal" },
      batFasteners: [
        { id: "flipper.left.bat-screw-inner", localX: 0.34, localZ: 0, radius: 0.044, kind: "metal" },
        { id: "flipper.left.bat-screw-outer", localX: 0.94, localZ: 0, radius: 0.04, kind: "metal" }
      ]
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
      rubberWidth: 0.13,
      rubberSleeve: {
        id: "flipper.right.rubber-sleeve",
        localX: 0.6,
        length: 1.2,
        radius: 0.17,
        thickness: 0.13,
        color: 0x7f2c22,
        kind: "rubber"
      },
      pivotCap: { id: "flipper.right.pivot-cap", radius: 0.25, height: 0.055, kind: "metal" },
      batFasteners: [
        { id: "flipper.right.bat-screw-inner", localX: 0.34, localZ: 0, radius: 0.044, kind: "metal" },
        { id: "flipper.right.bat-screw-outer", localX: 0.94, localZ: 0, radius: 0.04, kind: "metal" }
      ]
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
      topPlastic: {
        id: "sling.left.top-plastic",
        layerY: 0.61,
        thickness: 0.045,
        color: 0xffe6ac,
        fasteners: [
          { id: "sling.left.top-plastic.screw-outer", x: -2.5, z: 3.18, radius: 0.04, kind: "metal" },
          { id: "sling.left.top-plastic.screw-inner", x: -1.42, z: 3.6, radius: 0.04, kind: "metal" },
          { id: "sling.left.top-plastic.screw-nose", x: -2.08, z: 3.93, radius: 0.035, kind: "metal" }
        ]
      },
      lamp: withLampInsertLens({ id: "insert.sling.left", label: "Left sling", x: -2.06, z: 3.62, radius: 0.18, color: 0xffe08a, shape: "circle" }),
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
      topPlastic: {
        id: "sling.right.top-plastic",
        layerY: 0.61,
        thickness: 0.045,
        color: 0xffe6ac,
        fasteners: [
          { id: "sling.right.top-plastic.screw-outer", x: 2.5, z: 3.18, radius: 0.04, kind: "metal" },
          { id: "sling.right.top-plastic.screw-inner", x: 1.42, z: 3.6, radius: 0.04, kind: "metal" },
          { id: "sling.right.top-plastic.screw-nose", x: 2.08, z: 3.93, radius: 0.035, kind: "metal" }
        ]
      },
      lamp: withLampInsertLens({ id: "insert.sling.right", label: "Right sling", x: 2.06, z: 3.62, radius: 0.18, color: 0xffe08a, shape: "circle" }),
      impulseNormalX: -0.64,
      impulseNormalZ: -0.77,
      postIds: ["post.right-sling-a", "post.right-sling-b"]
    }
  ],
  bumpers: [
    {
      id: "pop-a",
      x: -1.25,
      z: -4.95,
      radius: 0.68,
      capRadius: 0.45,
      skirtRadius: 0.58,
      capColor: 0xd74b3f,
      skirt: { id: "pop-a.skirt", x: -1.25, z: -4.95, radius: 0.58, height: 0.08, color: 0xf1c453, kind: "switch-skirt" },
      chromeRing: { id: "pop-a.chrome-ring", radius: 0.68, tubeRadius: 0.035, kind: "metal" },
      lampLens: { id: "pop-a.lamp-lens", x: -1.25, z: -4.95, radius: 0.16, height: 0.035, color: 0xfff1a8, kind: "clear-plastic" },
      capFasteners: [
        { id: "pop-a.cap-screw-upper", x: -1.25, z: -5.2, radius: 0.032, kind: "metal" },
        { id: "pop-a.cap-screw-left", x: -1.47, z: -4.84, radius: 0.032, kind: "metal" },
        { id: "pop-a.cap-screw-right", x: -1.03, z: -4.84, radius: 0.032, kind: "metal" }
      ],
      ringPostIds: ["post.pop-a.upper", "post.pop-a.outer", "post.pop-a.inner"],
      guardSegments: withPopBumperGuardFasteners([
        { id: "pop-a.left-ring-rubber", x: -1.66, z: -4.48, width: 0.07, depth: 0.62, angle: -0.54, kind: "rubber" },
        { id: "pop-a.right-ring-rubber", x: -0.84, z: -4.48, width: 0.07, depth: 0.62, angle: 0.54, kind: "rubber" }
      ])
    },
    {
      id: "pop-b",
      x: 1.15,
      z: -5.16,
      radius: 0.68,
      capRadius: 0.45,
      skirtRadius: 0.58,
      capColor: 0xd74b3f,
      skirt: { id: "pop-b.skirt", x: 1.15, z: -5.16, radius: 0.58, height: 0.08, color: 0xf1c453, kind: "switch-skirt" },
      chromeRing: { id: "pop-b.chrome-ring", radius: 0.68, tubeRadius: 0.035, kind: "metal" },
      lampLens: { id: "pop-b.lamp-lens", x: 1.15, z: -5.16, radius: 0.16, height: 0.035, color: 0xfff1a8, kind: "clear-plastic" },
      capFasteners: [
        { id: "pop-b.cap-screw-upper", x: 1.15, z: -5.41, radius: 0.032, kind: "metal" },
        { id: "pop-b.cap-screw-left", x: 0.93, z: -5.05, radius: 0.032, kind: "metal" },
        { id: "pop-b.cap-screw-right", x: 1.37, z: -5.05, radius: 0.032, kind: "metal" }
      ],
      ringPostIds: ["post.pop-b.upper", "post.pop-b.outer", "post.pop-b.inner"],
      guardSegments: withPopBumperGuardFasteners([
        { id: "pop-b.left-ring-rubber", x: 0.74, z: -4.68, width: 0.07, depth: 0.62, angle: -0.52, kind: "rubber" },
        { id: "pop-b.right-ring-rubber", x: 1.56, z: -4.7, width: 0.07, depth: 0.62, angle: 0.52, kind: "rubber" }
      ])
    },
    {
      id: "pop-c",
      x: -0.05,
      z: -3.86,
      radius: 0.64,
      capRadius: 0.42,
      skirtRadius: 0.55,
      capColor: 0xf1c453,
      skirt: { id: "pop-c.skirt", x: -0.05, z: -3.86, radius: 0.55, height: 0.08, color: 0xffd773, kind: "switch-skirt" },
      chromeRing: { id: "pop-c.chrome-ring", radius: 0.64, tubeRadius: 0.035, kind: "metal" },
      lampLens: { id: "pop-c.lamp-lens", x: -0.05, z: -3.86, radius: 0.15, height: 0.035, color: 0xfff6b8, kind: "clear-plastic" },
      capFasteners: [
        { id: "pop-c.cap-screw-upper", x: -0.05, z: -4.1, radius: 0.03, kind: "metal" },
        { id: "pop-c.cap-screw-left", x: -0.26, z: -3.76, radius: 0.03, kind: "metal" },
        { id: "pop-c.cap-screw-right", x: 0.16, z: -3.76, radius: 0.03, kind: "metal" }
      ],
      ringPostIds: ["post.pop-c.lower-left", "post.pop-c.lower-right", "post.pop-c.upper"],
      guardSegments: withPopBumperGuardFasteners([
        { id: "pop-c.lower-left-ring-rubber", x: -0.48, z: -3.38, width: 0.07, depth: 0.58, angle: -0.58, kind: "rubber" },
        { id: "pop-c.lower-right-ring-rubber", x: 0.38, z: -3.38, width: 0.07, depth: 0.58, angle: 0.58, kind: "rubber" }
      ])
    }
  ],
  targetBank: {
    id: "target-bank.social",
    label: "SOCIAL",
    frameSegments: withTargetBankFrameFasteners([
      { id: "target-bank.frame-top-rail", x: 0, z: -3.02, width: 3.18, depth: 0.07, kind: "metal" },
      { id: "target-bank.frame-bottom-rail", x: 0, z: -2.14, width: 3.0, depth: 0.06, kind: "metal" },
      { id: "target-bank.frame-left-cheek", x: -1.68, z: -2.58, width: 0.06, depth: 0.78, angle: 0.16, kind: "metal" },
      { id: "target-bank.frame-right-cheek", x: 1.68, z: -2.58, width: 0.06, depth: 0.78, angle: -0.16, kind: "metal" },
      { id: "target-bank.divider-1", x: -0.96, z: -2.56, width: 0.045, depth: 0.72, angle: 0.12, kind: "metal" },
      { id: "target-bank.divider-2", x: -0.32, z: -2.66, width: 0.045, depth: 0.72, angle: 0.04, kind: "metal" },
      { id: "target-bank.divider-3", x: 0.32, z: -2.66, width: 0.045, depth: 0.72, angle: -0.04, kind: "metal" },
      { id: "target-bank.divider-4", x: 0.96, z: -2.56, width: 0.045, depth: 0.72, angle: -0.12, kind: "metal" }
    ]),
    posts: [
      {
        id: "target-bank.post-left-upper",
        x: -1.64,
        z: -2.98,
        radius: 0.07,
        kind: "metal",
        cap: { id: "target-bank.post-left-upper.cap", radius: 0.102, height: 0.032, kind: "metal" }
      },
      {
        id: "target-bank.post-left-lower",
        x: -1.54,
        z: -2.18,
        radius: 0.07,
        kind: "metal",
        cap: { id: "target-bank.post-left-lower.cap", radius: 0.102, height: 0.032, kind: "metal" }
      },
      {
        id: "target-bank.post-right-upper",
        x: 1.64,
        z: -2.98,
        radius: 0.07,
        kind: "metal",
        cap: { id: "target-bank.post-right-upper.cap", radius: 0.102, height: 0.032, kind: "metal" }
      },
      {
        id: "target-bank.post-right-lower",
        x: 1.54,
        z: -2.18,
        radius: 0.07,
        kind: "metal",
        cap: { id: "target-bank.post-right-lower.cap", radius: 0.102, height: 0.032, kind: "metal" }
      }
    ]
  },
  targets: [
    {
      id: "target-bank-1",
      label: "S",
      x: -1.28,
      z: -2.44,
      radius: 0.35,
      angle: 0.18,
      face: { id: "target-bank-1.face", x: -1.28, z: -2.44, width: 0.36, height: 0.72, thickness: 0.14, angle: 0.18, color: 0xd94b4b, kind: "plastic" },
      lampInsertId: "insert.social-s",
      mountPlate: { id: "target-bank-1.mount-plate", x: -1.28, z: -2.21, width: 0.48, depth: 0.1, angle: 0.18, kind: "metal" },
      mountFasteners: [
        { id: "target-bank-1.mount-screw-left", x: -1.45, z: -2.16, radius: 0.032, kind: "metal" },
        { id: "target-bank-1.mount-screw-right", x: -1.11, z: -2.24, radius: 0.032, kind: "metal" }
      ],
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
      face: { id: "target-bank-2.face", x: -0.64, z: -2.6, width: 0.36, height: 0.72, thickness: 0.14, angle: 0.08, color: 0xd94b4b, kind: "plastic" },
      lampInsertId: "insert.social-o",
      mountPlate: { id: "target-bank-2.mount-plate", x: -0.64, z: -2.36, width: 0.48, depth: 0.1, angle: 0.08, kind: "metal" },
      mountFasteners: [
        { id: "target-bank-2.mount-screw-left", x: -0.82, z: -2.33, radius: 0.032, kind: "metal" },
        { id: "target-bank-2.mount-screw-right", x: -0.46, z: -2.39, radius: 0.032, kind: "metal" }
      ],
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
      face: { id: "target-bank-3.face", x: 0, z: -2.68, width: 0.36, height: 0.72, thickness: 0.14, color: 0xd94b4b, kind: "plastic" },
      lampInsertId: "insert.social-c",
      mountPlate: { id: "target-bank-3.mount-plate", x: 0, z: -2.43, width: 0.48, depth: 0.1, kind: "metal" },
      mountFasteners: [
        { id: "target-bank-3.mount-screw-left", x: -0.18, z: -2.43, radius: 0.032, kind: "metal" },
        { id: "target-bank-3.mount-screw-right", x: 0.18, z: -2.43, radius: 0.032, kind: "metal" }
      ],
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
      face: { id: "target-bank-4.face", x: 0.64, z: -2.6, width: 0.36, height: 0.72, thickness: 0.14, angle: -0.08, color: 0xd94b4b, kind: "plastic" },
      lampInsertId: "insert.social-i",
      mountPlate: { id: "target-bank-4.mount-plate", x: 0.64, z: -2.36, width: 0.48, depth: 0.1, angle: -0.08, kind: "metal" },
      mountFasteners: [
        { id: "target-bank-4.mount-screw-left", x: 0.46, z: -2.39, radius: 0.032, kind: "metal" },
        { id: "target-bank-4.mount-screw-right", x: 0.82, z: -2.33, radius: 0.032, kind: "metal" }
      ],
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
      face: { id: "target-bank-5.face", x: 1.28, z: -2.44, width: 0.36, height: 0.72, thickness: 0.14, angle: -0.18, color: 0xd94b4b, kind: "plastic" },
      lampInsertId: "insert.social-a",
      mountPlate: { id: "target-bank-5.mount-plate", x: 1.28, z: -2.21, width: 0.48, depth: 0.1, angle: -0.18, kind: "metal" },
      mountFasteners: [
        { id: "target-bank-5.mount-screw-left", x: 1.11, z: -2.24, radius: 0.032, kind: "metal" },
        { id: "target-bank-5.mount-screw-right", x: 1.45, z: -2.16, radius: 0.032, kind: "metal" }
      ],
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
      cup: {
        id: "lock.saucer.cup",
        innerRadius: 0.5,
        outerRadius: 0.62,
        height: 0.16,
        fasteners: [
          { id: "lock.saucer.cup.screw-left", x: 0.38, z: -3.62, radius: 0.034, kind: "metal" },
          { id: "lock.saucer.cup.screw-back", x: 0.92, z: -4, radius: 0.034, kind: "metal" },
          { id: "lock.saucer.cup.screw-right", x: 1.46, z: -3.62, radius: 0.034, kind: "metal" }
        ],
        kind: "metal"
      },
      captureSensor: {
        id: "lock.saucer.capture-sensor",
        x: 0.92,
        z: -3.42,
        radius: 0.36,
        height: 0.018,
        color: 0x5fd4ff,
        kind: "capture-sensor"
      },
      heldBallMarker: {
        id: "lock.saucer.held-ball-marker",
        x: 0.92,
        z: -3.42,
        radius: 0.153,
        color: 0xbec7ca,
        kind: "locked-ball-marker"
      },
      holdX: 0.92,
      holdZ: -3.42,
      ejectX: 1.8,
      ejectZ: 2.4,
      ejectStrength: 1.85,
      walls: withSaucerWallFasteners([
        { id: "lock.saucer.back-wall", x: 0.92, z: -3.76, width: 0.82, depth: 0.06, kind: "metal" },
        { id: "lock.saucer.left-entry-wall", x: 0.54, z: -3.36, width: 0.06, depth: 0.52, angle: -0.28, kind: "metal" },
        { id: "lock.saucer.right-entry-wall", x: 1.3, z: -3.28, width: 0.06, depth: 0.54, angle: 0.34, kind: "metal" },
        { id: "lock.saucer.eject-guide", x: 1.42, z: -2.96, width: 0.06, depth: 0.72, angle: -0.62, kind: "wire" }
      ]),
      posts: [
        {
          id: "lock.saucer.left-post",
          x: 0.5,
          z: -3.08,
          radius: 0.1,
          kind: "metal",
          cap: { id: "lock.saucer.left-post.cap", radius: 0.135, height: 0.032, kind: "metal" }
        },
        {
          id: "lock.saucer.right-post",
          x: 1.34,
          z: -3.02,
          radius: 0.1,
          kind: "metal",
          cap: { id: "lock.saucer.right-post.cap", radius: 0.135, height: 0.032, kind: "metal" }
        }
      ]
    }
  ],
  ramps: [
    withRampSideRails({
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
      entranceLip: withRampEntranceLipFasteners({ id: "ramp.left.entrance-lip", x: -2.02, z: 1.38, width: 0.94, depth: 0.08, angle: -0.2, kind: "metal" }),
      supports: [
        withElevatedSupportMounts({
          id: "ramp.left.support.entry",
          x: -1.92,
          z: 1.02,
          height: 0.36,
          radius: 0.045,
          cap: { id: "ramp.left.support.entry.cap", radius: 0.078, height: 0.035, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "ramp.left.support.lower",
          x: -2.1,
          z: -0.08,
          height: 0.52,
          radius: 0.045,
          cap: { id: "ramp.left.support.lower.cap", radius: 0.078, height: 0.035, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "ramp.left.support.mid",
          x: -2.34,
          z: -1.18,
          height: 0.74,
          radius: 0.045,
          cap: { id: "ramp.left.support.mid.cap", radius: 0.078, height: 0.035, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "ramp.left.support.crest",
          x: -2.56,
          z: -2.28,
          height: 0.94,
          radius: 0.045,
          cap: { id: "ramp.left.support.crest.cap", radius: 0.078, height: 0.035, kind: "metal" },
          kind: "metal"
        })
      ],
      entry: { id: "ramp.left.entry", x: -2.08, z: 1.42, radius: 0.48 },
      exit: { id: "ramp.left.exit", x: -2.48, z: 4.72, radius: 0.42 },
      returnSide: "left"
    })
  ],
  handoffs: [
    {
      id: "handoff.ramp-left-entry",
      label: "Left ramp entry flap",
      segments: withHandoffFasteners([
        { id: "handoff.ramp-left-entry.flap", x: -1.78, z: 1.63, width: 0.74, depth: 0.06, angle: -0.2, kind: "metal" },
        { id: "handoff.ramp-left-entry.left-guide", x: -2.6, z: 1.14, width: 0.07, depth: 0.86, angle: -0.36, kind: "wire" },
        { id: "handoff.ramp-left-entry.right-guide", x: -1.58, z: 1.06, width: 0.07, depth: 0.84, angle: -0.06, kind: "wire" }
      ]),
      posts: [
        {
          id: "handoff.ramp-left-entry.flap.left-hinge-post",
          x: -2.13,
          z: 1.7,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.flap.left-hinge-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-entry.flap.right-stop-post",
          x: -1.43,
          z: 1.56,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.flap.right-stop-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-entry.left-guide.upper-post",
          x: -2.45,
          z: 0.75,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.left-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-entry.left-guide.lower-post",
          x: -2.76,
          z: 1.52,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.left-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-entry.right-guide.upper-post",
          x: -1.55,
          z: 0.64,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.right-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-entry.right-guide.lower-post",
          x: -1.61,
          z: 1.46,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-entry.right-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        }
      ]
    },
    {
      id: "handoff.ramp-left-exit",
      label: "Left wireform to inlane handoff",
      segments: withHandoffFasteners([
        { id: "handoff.ramp-left-exit.left-guide", x: -2.38, z: 4.45, width: 0.06, depth: 0.78, angle: -0.22, kind: "wire" },
        { id: "handoff.ramp-left-exit.right-guide", x: -1.8, z: 4.56, width: 0.06, depth: 0.76, angle: 0.18, kind: "wire" }
      ]),
      posts: [
        {
          id: "handoff.ramp-left-exit.left-guide.upper-post",
          x: -2.29,
          z: 4.07,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-exit.left-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-exit.left-guide.lower-post",
          x: -2.47,
          z: 4.83,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-exit.left-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-exit.right-guide.upper-post",
          x: -1.87,
          z: 4.19,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-exit.right-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.ramp-left-exit.right-guide.lower-post",
          x: -1.73,
          z: 4.93,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.ramp-left-exit.right-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        }
      ]
    },
    {
      id: "handoff.left-orbit-entry",
      label: "Left orbit entry guide",
      segments: withHandoffFasteners([
        { id: "handoff.left-orbit-entry.inner-guide", x: -2.68, z: 1.06, width: 0.06, depth: 0.82, angle: -0.18, kind: "wire" },
        { id: "handoff.left-orbit-entry.outer-guide", x: -3.38, z: 1.02, width: 0.06, depth: 0.86, angle: 0.16, kind: "wire" }
      ]),
      posts: [
        {
          id: "handoff.left-orbit-entry.inner-guide.lower-post",
          x: -2.61,
          z: 1.45,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.left-orbit-entry.inner-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.left-orbit-entry.inner-guide.upper-post",
          x: -2.75,
          z: 0.68,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.left-orbit-entry.inner-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.left-orbit-entry.outer-guide.lower-post",
          x: -3.45,
          z: 1.42,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.left-orbit-entry.outer-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.left-orbit-entry.outer-guide.upper-post",
          x: -3.31,
          z: 0.62,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.left-orbit-entry.outer-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        }
      ]
    },
    {
      id: "handoff.right-orbit-entry",
      label: "Right orbit entry guide",
      segments: withHandoffFasteners([
        { id: "handoff.right-orbit-entry.inner-guide", x: 2.68, z: 1.06, width: 0.06, depth: 0.82, angle: 0.18, kind: "wire" },
        { id: "handoff.right-orbit-entry.outer-guide", x: 3.38, z: 1.02, width: 0.06, depth: 0.86, angle: -0.16, kind: "wire" }
      ]),
      posts: [
        {
          id: "handoff.right-orbit-entry.inner-guide.lower-post",
          x: 2.61,
          z: 1.45,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-entry.inner-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-entry.inner-guide.upper-post",
          x: 2.75,
          z: 0.68,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-entry.inner-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-entry.outer-guide.lower-post",
          x: 3.45,
          z: 1.42,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-entry.outer-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-entry.outer-guide.upper-post",
          x: 3.31,
          z: 0.62,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-entry.outer-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        }
      ]
    },
    {
      id: "handoff.right-orbit-exit",
      label: "Right orbit return handoff",
      segments: withHandoffFasteners([
        { id: "handoff.right-orbit-exit.left-guide", x: 1.82, z: 4.52, width: 0.06, depth: 0.78, angle: -0.18, kind: "wire" },
        { id: "handoff.right-orbit-exit.right-guide", x: 2.38, z: 4.42, width: 0.06, depth: 0.74, angle: 0.22, kind: "wire" }
      ]),
      posts: [
        {
          id: "handoff.right-orbit-exit.left-guide.upper-post",
          x: 1.89,
          z: 4.14,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-exit.left-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-exit.left-guide.lower-post",
          x: 1.75,
          z: 4.9,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-exit.left-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-exit.right-guide.upper-post",
          x: 2.3,
          z: 4.06,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-exit.right-guide.upper-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.right-orbit-exit.right-guide.lower-post",
          x: 2.46,
          z: 4.78,
          radius: 0.052,
          kind: "metal",
          cap: { id: "handoff.right-orbit-exit.right-guide.lower-post.cap", radius: 0.078, height: 0.032, kind: "metal" }
        }
      ]
    },
    {
      id: "handoff.upper-orbit-gates",
      label: "Upper orbit gates",
      segments: withHandoffFasteners([
        { id: "handoff.upper-orbit-gates.left", x: -2.06, z: -5.86, width: 0.58, depth: 0.06, angle: 0.38, kind: "metal" },
        { id: "handoff.upper-orbit-gates.right", x: 2.12, z: -5.82, width: 0.58, depth: 0.06, angle: -0.38, kind: "metal" }
      ]),
      posts: [
        {
          id: "handoff.upper-orbit-gates.left.hinge-post",
          x: -2.32,
          z: -5.98,
          radius: 0.06,
          kind: "metal",
          cap: { id: "handoff.upper-orbit-gates.left.hinge-post.cap", radius: 0.09, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.upper-orbit-gates.left.stop-post",
          x: -1.82,
          z: -5.72,
          radius: 0.055,
          kind: "metal",
          cap: { id: "handoff.upper-orbit-gates.left.stop-post.cap", radius: 0.082, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.upper-orbit-gates.right.hinge-post",
          x: 2.38,
          z: -5.94,
          radius: 0.06,
          kind: "metal",
          cap: { id: "handoff.upper-orbit-gates.right.hinge-post.cap", radius: 0.09, height: 0.032, kind: "metal" }
        },
        {
          id: "handoff.upper-orbit-gates.right.stop-post",
          x: 1.88,
          z: -5.7,
          radius: 0.055,
          kind: "metal",
          cap: { id: "handoff.upper-orbit-gates.right.stop-post.cap", radius: 0.082, height: 0.032, kind: "metal" }
        }
      ]
    }
  ],
  wireforms: [
    withWireformRails(withWireformTieFasteners({
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
      ties: [
        { id: "wireform.left-return.tie-upper-entry", x: -2.98, z: -2.46, width: 0.58, depth: 0.055, angle: -0.2, kind: "wire" },
        { id: "wireform.left-return.tie-upper-mid", x: -2.72, z: -1.4, width: 0.58, depth: 0.055, angle: -0.2, kind: "wire" },
        { id: "wireform.left-return.tie-upper-exit", x: -2.46, z: -0.34, width: 0.58, depth: 0.055, angle: -0.2, kind: "wire" },
        { id: "wireform.left-return.tie-lower-entry", x: -2.58, z: 0.98, width: 0.58, depth: 0.055, angle: 0.08, kind: "wire" },
        { id: "wireform.left-return.tie-lower-mid", x: -2.44, z: 2.28, width: 0.58, depth: 0.055, angle: 0.08, kind: "wire" },
        { id: "wireform.left-return.tie-lower-exit", x: -2.3, z: 3.58, width: 0.58, depth: 0.055, angle: 0.08, kind: "wire" }
      ],
      supports: [
        withElevatedSupportMounts({
          id: "wireform.left-return.support.upper",
          x: -2.54,
          z: -2.42,
          height: 1.02,
          radius: 0.04,
          cap: { id: "wireform.left-return.support.upper.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "wireform.left-return.support.mid",
          x: -2.62,
          z: 0.12,
          height: 1.04,
          radius: 0.04,
          cap: { id: "wireform.left-return.support.mid.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "wireform.left-return.support.exit",
          x: -2.24,
          z: 3.86,
          height: 0.98,
          radius: 0.04,
          cap: { id: "wireform.left-return.support.exit.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        })
      ]
    })),
    withWireformRails(withWireformTieFasteners({
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
      ties: [
        { id: "wireform.right-orbit-return.tie-upper-entry", x: 2.52, z: -4.42, width: 0.6, depth: 0.055, angle: 0.22, kind: "wire" },
        { id: "wireform.right-orbit-return.tie-upper-mid", x: 2.88, z: -3.2, width: 0.6, depth: 0.055, angle: 0.22, kind: "wire" },
        { id: "wireform.right-orbit-return.tie-upper-exit", x: 3.24, z: -1.98, width: 0.6, depth: 0.055, angle: 0.22, kind: "wire" },
        { id: "wireform.right-orbit-return.tie-lower-entry", x: 2.68, z: -0.44, width: 0.6, depth: 0.055, angle: -0.08, kind: "wire" },
        { id: "wireform.right-orbit-return.tie-lower-mid", x: 2.5, z: 1.15, width: 0.6, depth: 0.055, angle: -0.08, kind: "wire" },
        { id: "wireform.right-orbit-return.tie-lower-exit", x: 2.32, z: 2.74, width: 0.6, depth: 0.055, angle: -0.08, kind: "wire" }
      ],
      supports: [
        withElevatedSupportMounts({
          id: "wireform.right-orbit-return.support.upper",
          x: 2.78,
          z: -4.42,
          height: 1.1,
          radius: 0.04,
          cap: { id: "wireform.right-orbit-return.support.upper.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "wireform.right-orbit-return.support.mid",
          x: 2.72,
          z: -1.08,
          height: 1.12,
          radius: 0.04,
          cap: { id: "wireform.right-orbit-return.support.mid.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        }),
        withElevatedSupportMounts({
          id: "wireform.right-orbit-return.support.exit",
          x: 2.28,
          z: 3.78,
          height: 1.02,
          radius: 0.04,
          cap: { id: "wireform.right-orbit-return.support.exit.cap", radius: 0.07, height: 0.032, kind: "metal" },
          kind: "metal"
        })
      ]
    }))
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
    apronCards: [
      {
        id: "apron.card-left",
        label: "BALL SAVE",
        x: -1.28,
        z: 6.96,
        width: 1.45,
        depth: 0.34,
        angle: 0.03,
        color: 0xf8e7b5,
        protector: {
          id: "apron.card-left.protector",
          x: -1.28,
          z: 6.96,
          width: 1.54,
          depth: 0.43,
          angle: 0.03,
          thickness: 0.018,
          kind: "clear-plastic"
        }
      },
      {
        id: "apron.card-right",
        label: "SHOOT AGAIN",
        x: 1.28,
        z: 6.96,
        width: 1.45,
        depth: 0.34,
        angle: -0.03,
        color: 0xf8e7b5,
        protector: {
          id: "apron.card-right.protector",
          x: 1.28,
          z: 6.96,
          width: 1.54,
          depth: 0.43,
          angle: -0.03,
          thickness: 0.018,
          kind: "clear-plastic"
        }
      }
    ],
    apronFasteners: [
      { id: "apron.card-left.screw-upper-left", x: -1.9, z: 6.81, radius: 0.045, kind: "metal" },
      { id: "apron.card-left.screw-upper-right", x: -0.66, z: 6.81, radius: 0.045, kind: "metal" },
      { id: "apron.card-left.screw-lower-left", x: -1.9, z: 7.11, radius: 0.045, kind: "metal" },
      { id: "apron.card-left.screw-lower-right", x: -0.66, z: 7.11, radius: 0.045, kind: "metal" },
      { id: "apron.card-right.screw-upper-left", x: 0.66, z: 6.81, radius: 0.045, kind: "metal" },
      { id: "apron.card-right.screw-upper-right", x: 1.9, z: 6.81, radius: 0.045, kind: "metal" },
      { id: "apron.card-right.screw-lower-left", x: 0.66, z: 7.11, radius: 0.045, kind: "metal" },
      { id: "apron.card-right.screw-lower-right", x: 1.9, z: 7.11, radius: 0.045, kind: "metal" }
    ],
    drainGuides: [
      {
        id: "drain.left-guide",
        x: -0.82,
        z: 6.58,
        width: 0.08,
        depth: 0.92,
        angle: -0.42,
        kind: "rubber",
        fasteners: [
          { id: "drain.left-guide.screw-upper", targetId: "drain.left-guide", x: -0.98, z: 6.24, radius: 0.034, kind: "metal" },
          { id: "drain.left-guide.screw-lower", targetId: "drain.left-guide", x: -0.66, z: 6.92, radius: 0.034, kind: "metal" }
        ]
      },
      {
        id: "drain.right-guide",
        x: 0.82,
        z: 6.58,
        width: 0.08,
        depth: 0.92,
        angle: 0.42,
        kind: "rubber",
        fasteners: [
          { id: "drain.right-guide.screw-upper", targetId: "drain.right-guide", x: 0.98, z: 6.24, radius: 0.034, kind: "metal" },
          { id: "drain.right-guide.screw-lower", targetId: "drain.right-guide", x: 0.66, z: 6.92, radius: 0.034, kind: "metal" }
        ]
      },
      {
        id: "drain.center-mouth",
        x: 0,
        z: 6.92,
        width: 1.08,
        depth: 0.08,
        kind: "metal",
        fasteners: [
          { id: "drain.center-mouth.screw-left", targetId: "drain.center-mouth", x: -0.42, z: 6.92, radius: 0.034, kind: "metal" },
          { id: "drain.center-mouth.screw-right", targetId: "drain.center-mouth", x: 0.42, z: 6.92, radius: 0.034, kind: "metal" }
        ]
      }
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
      slotRims: [
        {
          id: "trough.slot-1.rim",
          slotId: "trough.slot-1",
          x: -0.52,
          z: 7.54,
          innerRadius: 0.18,
          outerRadius: 0.245,
          height: 0.045,
          kind: "metal"
        },
        {
          id: "trough.slot-2.rim",
          slotId: "trough.slot-2",
          x: 0,
          z: 7.54,
          innerRadius: 0.18,
          outerRadius: 0.245,
          height: 0.045,
          kind: "metal"
        },
        {
          id: "trough.slot-3.rim",
          slotId: "trough.slot-3",
          x: 0.52,
          z: 7.54,
          innerRadius: 0.18,
          outerRadius: 0.245,
          height: 0.045,
          kind: "metal"
        }
      ],
      optoPairs: [
        {
          id: "trough.slot-1.opto",
          slotId: "trough.slot-1",
          emitter: { id: "trough.slot-1.opto.emitter", slotId: "trough.slot-1", x: -0.77, z: 7.54, radius: 0.034, height: 0.05, color: 0xff7a3d, kind: "opto-emitter" },
          receiver: { id: "trough.slot-1.opto.receiver", slotId: "trough.slot-1", x: -0.27, z: 7.54, radius: 0.034, height: 0.05, color: 0x7ee7ff, kind: "opto-receiver" },
          beam: { id: "trough.slot-1.opto.beam", slotId: "trough.slot-1", x: -0.52, z: 7.54, width: 0.5, depth: 0.018, color: 0x7ee7ff, kind: "opto-beam" }
        },
        {
          id: "trough.slot-2.opto",
          slotId: "trough.slot-2",
          emitter: { id: "trough.slot-2.opto.emitter", slotId: "trough.slot-2", x: -0.25, z: 7.54, radius: 0.034, height: 0.05, color: 0xff7a3d, kind: "opto-emitter" },
          receiver: { id: "trough.slot-2.opto.receiver", slotId: "trough.slot-2", x: 0.25, z: 7.54, radius: 0.034, height: 0.05, color: 0x7ee7ff, kind: "opto-receiver" },
          beam: { id: "trough.slot-2.opto.beam", slotId: "trough.slot-2", x: 0, z: 7.54, width: 0.5, depth: 0.018, color: 0x7ee7ff, kind: "opto-beam" }
        },
        {
          id: "trough.slot-3.opto",
          slotId: "trough.slot-3",
          emitter: { id: "trough.slot-3.opto.emitter", slotId: "trough.slot-3", x: 0.27, z: 7.54, radius: 0.034, height: 0.05, color: 0xff7a3d, kind: "opto-emitter" },
          receiver: { id: "trough.slot-3.opto.receiver", slotId: "trough.slot-3", x: 0.77, z: 7.54, radius: 0.034, height: 0.05, color: 0x7ee7ff, kind: "opto-receiver" },
          beam: { id: "trough.slot-3.opto.beam", slotId: "trough.slot-3", x: 0.52, z: 7.54, width: 0.5, depth: 0.018, color: 0x7ee7ff, kind: "opto-beam" }
        }
      ],
      walls: [
        { id: "trough.left-wall", x: -0.96, z: 7.55, width: 0.06, depth: 0.44, kind: "metal" },
        { id: "trough.right-wall", x: 0.96, z: 7.55, width: 0.06, depth: 0.44, kind: "metal" },
        { id: "trough.back-wall", x: 0, z: 7.76, width: 1.92, depth: 0.06, kind: "metal" }
      ],
      feedGuide: { id: "trough.shooter-feed-guide", x: 1.62, z: 7.34, width: 0.08, depth: 0.86, angle: -0.58, kind: "metal" },
      fasteners: [
        { id: "trough.left-wall.screw-front", targetId: "trough.left-wall", x: -0.96, z: 7.38, radius: 0.032, kind: "metal" },
        { id: "trough.left-wall.screw-back", targetId: "trough.left-wall", x: -0.96, z: 7.72, radius: 0.032, kind: "metal" },
        { id: "trough.right-wall.screw-front", targetId: "trough.right-wall", x: 0.96, z: 7.38, radius: 0.032, kind: "metal" },
        { id: "trough.right-wall.screw-back", targetId: "trough.right-wall", x: 0.96, z: 7.72, radius: 0.032, kind: "metal" },
        { id: "trough.back-wall.screw-left", targetId: "trough.back-wall", x: -0.72, z: 7.76, radius: 0.032, kind: "metal" },
        { id: "trough.back-wall.screw-right", targetId: "trough.back-wall", x: 0.72, z: 7.76, radius: 0.032, kind: "metal" },
        { id: "trough.shooter-feed-guide.screw-upper", targetId: "trough.shooter-feed-guide", x: 1.38, z: 7.0, radius: 0.032, kind: "metal" },
        { id: "trough.shooter-feed-guide.screw-lower", targetId: "trough.shooter-feed-guide", x: 1.86, z: 7.68, radius: 0.032, kind: "metal" }
      ]
    }
  },
  plastics: [
    {
      id: "plastic.left-lane-cover",
      x: -2.72,
      z: 3.72,
      width: 1.42,
      depth: 1.05,
      angle: -0.36,
      color: 0xf6d174,
      layerY: 0.62,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.left-lane-cover.standoff.lower", x: -3.14, z: 4.08, height: 0.58, radius: 0.045, capRadius: 0.075, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.left-lane-cover.standoff.upper", x: -2.18, z: 3.28, height: 0.58, radius: 0.045, capRadius: 0.075, kind: "metal" })
      ]
    },
    {
      id: "plastic.right-lane-cover",
      x: 2.72,
      z: 3.72,
      width: 1.42,
      depth: 1.05,
      angle: 0.36,
      color: 0xf6d174,
      layerY: 0.62,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.right-lane-cover.standoff.lower", x: 3.14, z: 4.08, height: 0.58, radius: 0.045, capRadius: 0.075, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.right-lane-cover.standoff.upper", x: 2.18, z: 3.28, height: 0.58, radius: 0.045, capRadius: 0.075, kind: "metal" })
      ]
    },
    {
      id: "plastic.left-sling-cover",
      x: -1.92,
      z: 3.34,
      width: 1.32,
      depth: 0.72,
      angle: -0.5,
      color: 0xffe6ac,
      layerY: 0.58,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.left-sling-cover.standoff.outer", x: -2.5, z: 3.12, height: 0.54, radius: 0.04, capRadius: 0.07, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.left-sling-cover.standoff.inner", x: -1.42, z: 3.56, height: 0.54, radius: 0.04, capRadius: 0.07, kind: "metal" })
      ]
    },
    {
      id: "plastic.right-sling-cover",
      x: 1.92,
      z: 3.34,
      width: 1.32,
      depth: 0.72,
      angle: 0.5,
      color: 0xffe6ac,
      layerY: 0.58,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.right-sling-cover.standoff.outer", x: 2.5, z: 3.12, height: 0.54, radius: 0.04, capRadius: 0.07, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.right-sling-cover.standoff.inner", x: 1.42, z: 3.56, height: 0.54, radius: 0.04, capRadius: 0.07, kind: "metal" })
      ]
    },
    {
      id: "plastic.bumper-nest-cover",
      x: 0,
      z: -4.8,
      width: 3.4,
      depth: 1.72,
      color: 0xf3cf6e,
      layerY: 0.74,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.bumper-nest-cover.standoff.left", x: -1.72, z: -4.22, height: 0.7, radius: 0.045, capRadius: 0.08, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.bumper-nest-cover.standoff.center", x: -0.02, z: -5.62, height: 0.7, radius: 0.045, capRadius: 0.08, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.bumper-nest-cover.standoff.right", x: 1.72, z: -4.28, height: 0.7, radius: 0.045, capRadius: 0.08, kind: "metal" })
      ]
    },
    {
      id: "plastic.shooter-arch-cover",
      x: 2.9,
      z: -5.75,
      width: 1.2,
      depth: 1.55,
      angle: 0.18,
      color: 0x9fd0ff,
      layerY: 0.68,
      standoffs: [
        withPlasticStandoffMounts({ id: "plastic.shooter-arch-cover.standoff.lower", x: 2.5, z: -5.08, height: 0.64, radius: 0.04, capRadius: 0.07, kind: "metal" }),
        withPlasticStandoffMounts({ id: "plastic.shooter-arch-cover.standoff.upper", x: 3.3, z: -6.36, height: 0.64, radius: 0.04, capRadius: 0.07, kind: "metal" })
      ]
    }
  ],
  playfieldArt: [
    {
      id: "playfield.art.base-teal",
      label: "Silverball Social deck",
      x: 0,
      z: 0,
      width: 7.42,
      depth: 14.55,
      color: 0x2b6b5e,
      layerY: 0.005,
      kind: "zone"
    },
    {
      id: "playfield.art.bumper-burst",
      label: "Bumper nest burst",
      x: 0,
      z: -4.72,
      width: 3.2,
      depth: 1.62,
      color: 0x8ddcbd,
      layerY: 0.025,
      kind: "zone"
    },
    {
      id: "playfield.art.left-lane-stripe",
      label: "Left lane save",
      x: -2.64,
      z: 4.94,
      width: 1.9,
      depth: 0.24,
      angle: -0.24,
      color: 0xf1c453,
      layerY: 0.035,
      kind: "stripe"
    },
    {
      id: "playfield.art.right-lane-stripe",
      label: "Right lane save",
      x: 2.64,
      z: 4.94,
      width: 1.9,
      depth: 0.24,
      angle: 0.24,
      color: 0xf1c453,
      layerY: 0.035,
      kind: "stripe"
    },
    {
      id: "playfield.art.left-ramp-arrow",
      label: "RAMP",
      x: -1.78,
      z: 1.04,
      width: 0.72,
      depth: 0.42,
      angle: -0.22,
      color: 0x9fd0ff,
      layerY: 0.045,
      kind: "arrow"
    },
    {
      id: "playfield.art.left-orbit-arrow",
      label: "ORBIT",
      x: -3.02,
      z: 0.54,
      width: 0.74,
      depth: 0.42,
      angle: -0.08,
      color: 0x76ff8f,
      layerY: 0.045,
      kind: "arrow"
    },
    {
      id: "playfield.art.right-orbit-arrow",
      label: "ORBIT",
      x: 3.02,
      z: 0.54,
      width: 0.74,
      depth: 0.42,
      angle: 0.08,
      color: 0x76ff8f,
      layerY: 0.045,
      kind: "arrow"
    },
    {
      id: "playfield.art.lock-label",
      label: "LOCK",
      x: 0.92,
      z: -3.92,
      width: 0.86,
      depth: 0.32,
      color: 0xff4b4b,
      layerY: 0.045,
      kind: "label"
    },
    {
      id: "playfield.art.social-sweep",
      label: "SOCIAL",
      x: 0,
      z: -1.84,
      width: 2.8,
      depth: 0.34,
      color: 0xffd56f,
      layerY: 0.04,
      kind: "label"
    }
  ],
  lampInserts: withLampInsertLenses([
    { id: "insert.bonus-1", label: "Bonus 1", x: -0.66, z: 2.72, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.bonus-2", label: "Bonus 2", x: 0, z: 2.55, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.bonus-3", label: "Bonus 3", x: 0.66, z: 2.72, radius: 0.14, color: 0xffe08a, shape: "circle" },
    { id: "insert.lower.left-out-arrow", label: "Left Out", x: -3.2, z: 5.1, radius: 0.16, angle: -0.34, color: 0xf1c453, shape: "arrow" },
    { id: "insert.lower.left-in-arrow", label: "Left In", x: -1.98, z: 5.18, radius: 0.16, angle: -0.16, color: 0xf1c453, shape: "arrow" },
    { id: "insert.lower.right-in-arrow", label: "Right In", x: 1.98, z: 5.18, radius: 0.16, angle: 0.16, color: 0xf1c453, shape: "arrow" },
    { id: "insert.lower.right-out-arrow", label: "Right Out", x: 3.2, z: 5.1, radius: 0.16, angle: 0.34, color: 0xf1c453, shape: "arrow" },
    { id: "insert.top.left-arrow", label: "Top Left", x: -1.05, z: -6.48, radius: 0.16, angle: -0.1, color: 0x5fd4ff, shape: "arrow" },
    { id: "insert.top.center-arrow", label: "Top Center", x: 0, z: -6.62, radius: 0.16, angle: 0, color: 0x5fd4ff, shape: "arrow" },
    { id: "insert.top.right-arrow", label: "Top Right", x: 1.05, z: -6.48, radius: 0.16, angle: 0.1, color: 0x5fd4ff, shape: "arrow" },
    { id: "insert.left-ramp-arrow", label: "Ramp", x: -1.72, z: 0.74, radius: 0.2, angle: -0.38, color: 0x9fd0ff, shape: "arrow" },
    { id: "insert.left-orbit-arrow", label: "Orbit", x: -2.82, z: 0.42, radius: 0.2, angle: -0.58, color: 0x76ff8f, shape: "arrow" },
    { id: "insert.right-orbit-arrow", label: "Orbit", x: 2.82, z: 0.42, radius: 0.2, angle: 0.58, color: 0x76ff8f, shape: "arrow" },
    { id: "insert.lock-ready", label: "Lock", x: 0.9, z: -2.92, radius: 0.18, color: 0xff4b4b, shape: "bar" },
    { id: "insert.jackpot", label: "Jackpot", x: 0, z: -1.42, radius: 0.22, color: 0xf4d35e, shape: "bar" },
    { id: "insert.skill-shot", label: "Skill", x: 3.04, z: -5.78, radius: 0.18, angle: 0.28, color: 0x5fd4ff, shape: "arrow" },
    { id: "insert.social-s", label: "S", x: -1.28, z: -1.98, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-o", label: "O", x: -0.64, z: -2.14, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-c", label: "C", x: 0, z: -2.22, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-i", label: "I", x: 0.64, z: -2.14, radius: 0.12, color: 0xffd56f, shape: "bar" },
    { id: "insert.social-a", label: "A", x: 1.28, z: -1.98, radius: 0.12, color: 0xffd56f, shape: "bar" }
  ]),
  plunger: {
    id: "shooter.plunger",
    rodX: 3.42,
    rodZ: 5.92,
    rodLength: 1.28,
    spring: { id: "shooter.plunger-spring", x: 3.42, z: 6.18, radius: 0.16, tubeRadius: 0.018, kind: "metal" },
    springRetainers: [
      { id: "shooter.plunger-spring.front-retainer", targetId: "shooter.plunger-spring", x: 3.42, z: 5.96, radius: 0.13, depth: 0.042, kind: "metal" },
      { id: "shooter.plunger-spring.back-retainer", targetId: "shooter.plunger-spring", x: 3.42, z: 6.4, radius: 0.13, depth: 0.042, kind: "metal" }
    ],
    stopCollar: { id: "shooter.plunger-stop-collar", x: 3.42, z: 5.5, radius: 0.085, depth: 0.07, kind: "metal" },
    knob: { id: "shooter.plunger-knob", x: 3.42, z: 6.82, radius: 0.18, depth: 0.16, kind: "plastic" },
    laneGroove: { id: "shooter.lane-groove", x: 3.18, z: 5.3, width: 0.72, depth: 4.1, kind: "wood" },
    housing: { id: "shooter.plunger-housing", x: 3.42, z: 6.12, width: 0.36, depth: 1.28, kind: "metal" },
    housingFasteners: [
      { id: "shooter.plunger-housing.screw-front-left", targetId: "shooter.plunger-housing", x: 3.29, z: 6.58, radius: 0.034, kind: "metal" },
      { id: "shooter.plunger-housing.screw-front-right", targetId: "shooter.plunger-housing", x: 3.55, z: 6.58, radius: 0.034, kind: "metal" },
      { id: "shooter.plunger-housing.screw-back-left", targetId: "shooter.plunger-housing", x: 3.29, z: 5.66, radius: 0.034, kind: "metal" },
      { id: "shooter.plunger-housing.screw-back-right", targetId: "shooter.plunger-housing", x: 3.55, z: 5.66, radius: 0.034, kind: "metal" }
    ],
    lowerGuides: [
      { id: "shooter.lower-left-guide", x: 2.86, z: 5.42, width: 0.07, depth: 2.2, angle: -0.03, kind: "metal" },
      { id: "shooter.lower-right-guide", x: 3.56, z: 5.36, width: 0.07, depth: 2.24, angle: 0.03, kind: "metal" }
    ],
    guideFasteners: [
      { id: "shooter.lower-left-guide.screw-lower", targetId: "shooter.lower-left-guide", x: 2.86, z: 6.26, radius: 0.034, kind: "metal" },
      { id: "shooter.lower-left-guide.screw-upper", targetId: "shooter.lower-left-guide", x: 2.81, z: 4.58, radius: 0.034, kind: "metal" },
      { id: "shooter.lower-right-guide.screw-lower", targetId: "shooter.lower-right-guide", x: 3.56, z: 6.22, radius: 0.034, kind: "metal" },
      { id: "shooter.lower-right-guide.screw-upper", targetId: "shooter.lower-right-guide", x: 3.61, z: 4.5, radius: 0.034, kind: "metal" }
    ],
    gate: { id: "shooter.one-way-gate", x: 3.06, z: -5.78, width: 0.66, depth: 0.08, angle: 0.34, kind: "metal" },
    gateHingePost: {
      id: "shooter.one-way-gate.hinge-post",
      x: 2.74,
      z: -5.9,
      radius: 0.07,
      kind: "metal",
      cap: { id: "shooter.one-way-gate.hinge-post.cap", radius: 0.102, height: 0.032, kind: "metal" }
    },
    gateStopPost: {
      id: "shooter.one-way-gate.stop-post",
      x: 3.36,
      z: -5.64,
      radius: 0.06,
      kind: "metal",
      cap: { id: "shooter.one-way-gate.stop-post.cap", radius: 0.09, height: 0.032, kind: "metal" }
    }
  },
  shots: [
    { id: "shot.left-orbit", label: "Left orbit", primaryFlipper: "right", deviceIds: ["playfield.art.left-orbit-arrow", "insert.left-orbit-arrow", "insert.left-orbit-arrow.lens", "orbit.left.entry", "handoff.left-orbit-entry.inner-guide", "handoff.left-orbit-entry.inner-guide.screw-a", "handoff.left-orbit-entry.inner-guide.screw-b", "handoff.left-orbit-entry.outer-guide", "handoff.left-orbit-entry.outer-guide.screw-a", "handoff.left-orbit-entry.outer-guide.screw-b", "handoff.left-orbit-entry.inner-guide.lower-post", "handoff.left-orbit-entry.inner-guide.lower-post.cap", "handoff.left-orbit-entry.inner-guide.upper-post", "handoff.left-orbit-entry.inner-guide.upper-post.cap", "handoff.left-orbit-entry.outer-guide.lower-post", "handoff.left-orbit-entry.outer-guide.lower-post.cap", "handoff.left-orbit-entry.outer-guide.upper-post", "handoff.left-orbit-entry.outer-guide.upper-post.cap", "orbit.left.outer.lower", "orbit.left.outer.lower.screw-a", "orbit.left.outer.lower.screw-b", "orbit.left.inner.lower", "orbit.left.inner.lower.screw-a", "orbit.left.inner.lower.screw-b", "orbit.left.outer.mid", "orbit.left.outer.mid.screw-a", "orbit.left.outer.mid.screw-b", "orbit.left.inner.mid", "orbit.left.inner.mid.screw-a", "orbit.left.inner.mid.screw-b", "orbit.left.outer.upper", "orbit.left.outer.upper.screw-a", "orbit.left.outer.upper.screw-b", "orbit.left.inner.upper", "orbit.left.inner.upper.screw-a", "orbit.left.inner.upper.screw-b", "boundary.top-arch.left-curve", "boundary.top-arch.center", "boundary.top-arch.right-curve", "orbit.left.exit", "handoff.upper-orbit-gates.left", "handoff.upper-orbit-gates.left.screw-a", "handoff.upper-orbit-gates.left.screw-b", "handoff.upper-orbit-gates.left.hinge-post", "handoff.upper-orbit-gates.left.hinge-post.cap", "handoff.upper-orbit-gates.left.stop-post", "handoff.upper-orbit-gates.left.stop-post.cap", "lane.top.left", "lane.top.left.outer", "lane.top.left.outer.screw-a", "lane.top.left.outer.screw-b", "lane.top.left.inner", "lane.top.left.inner.screw-a", "lane.top.left.inner.screw-b", "rollover.top.left", "rollover.top.left.screw-left", "rollover.top.left.screw-right", "insert.top.left-arrow", "insert.top.left-arrow.lens", "lane.top.left.guide-cover", "lane.top.left.guide-cover.screw-left", "lane.top.left.guide-cover.screw-right", "lane.top.left.rubber-band", "post.top-lane-left", "post.top-lane-left.cap", "post.top-lane-left-outer", "post.top-lane-left-outer.cap", "post.top-lane-left-inner", "post.top-lane-left-inner.cap", "pop-a", "pop-a.skirt", "pop-a.chrome-ring", "pop-a.lamp-lens", "pop-a.cap-screw-upper", "pop-a.cap-screw-left", "pop-a.cap-screw-right", "post.pop-a.upper", "post.pop-a.upper.cap", "post.pop-a.outer", "post.pop-a.outer.cap", "post.pop-a.inner", "post.pop-a.inner.cap", "pop-a.left-ring-rubber", "pop-a.left-ring-rubber.screw-a", "pop-a.left-ring-rubber.screw-b", "pop-a.right-ring-rubber", "pop-a.right-ring-rubber.screw-a", "pop-a.right-ring-rubber.screw-b"] },
    { id: "shot.left-ramp", label: "Left ramp", primaryFlipper: "right", deviceIds: ["playfield.art.left-ramp-arrow", "insert.left-ramp-arrow", "insert.left-ramp-arrow.lens", "ramp.left", "ramp.left.entry", "ramp.left.entrance-lip", "ramp.left.entrance-lip.screw-a", "ramp.left.entrance-lip.screw-b", "ramp.left.side-wall.left", "ramp.left.side-wall.left.rivet-lower", "ramp.left.side-wall.left.rivet-mid", "ramp.left.side-wall.left.rivet-upper", "ramp.left.side-wall.right", "ramp.left.side-wall.right.rivet-lower", "ramp.left.side-wall.right.rivet-mid", "ramp.left.side-wall.right.rivet-upper", "ramp.left.side-rail.left", "ramp.left.side-rail.left.clamp-lower", "ramp.left.side-rail.left.clamp-mid", "ramp.left.side-rail.left.clamp-upper", "ramp.left.side-rail.right", "ramp.left.side-rail.right.clamp-lower", "ramp.left.side-rail.right.clamp-mid", "ramp.left.side-rail.right.clamp-upper", "ramp.left.cross-brace.lower", "ramp.left.cross-brace.lower.screw-left", "ramp.left.cross-brace.lower.screw-right", "ramp.left.cross-brace.mid", "ramp.left.cross-brace.mid.screw-left", "ramp.left.cross-brace.mid.screw-right", "ramp.left.cross-brace.upper", "ramp.left.cross-brace.upper.screw-left", "ramp.left.cross-brace.upper.screw-right", "ramp.left.support.entry", "ramp.left.support.entry.cap", "ramp.left.support.entry.foot", "ramp.left.support.entry.foot.screw-left", "ramp.left.support.entry.foot.screw-right", "ramp.left.support.entry.collar", "ramp.left.support.entry.saddle", "ramp.left.support.entry.saddle.screw-left", "ramp.left.support.entry.saddle.screw-right", "ramp.left.support.lower", "ramp.left.support.lower.cap", "ramp.left.support.lower.foot", "ramp.left.support.lower.foot.screw-left", "ramp.left.support.lower.foot.screw-right", "ramp.left.support.lower.collar", "ramp.left.support.lower.saddle", "ramp.left.support.lower.saddle.screw-left", "ramp.left.support.lower.saddle.screw-right", "ramp.left.support.mid", "ramp.left.support.mid.cap", "ramp.left.support.mid.foot", "ramp.left.support.mid.foot.screw-left", "ramp.left.support.mid.foot.screw-right", "ramp.left.support.mid.collar", "ramp.left.support.mid.saddle", "ramp.left.support.mid.saddle.screw-left", "ramp.left.support.mid.saddle.screw-right", "ramp.left.support.crest", "ramp.left.support.crest.cap", "ramp.left.support.crest.foot", "ramp.left.support.crest.foot.screw-left", "ramp.left.support.crest.foot.screw-right", "ramp.left.support.crest.collar", "ramp.left.support.crest.saddle", "ramp.left.support.crest.saddle.screw-left", "ramp.left.support.crest.saddle.screw-right", "handoff.ramp-left-entry.flap", "handoff.ramp-left-entry.flap.screw-a", "handoff.ramp-left-entry.flap.screw-b", "handoff.ramp-left-entry.left-guide", "handoff.ramp-left-entry.left-guide.screw-a", "handoff.ramp-left-entry.left-guide.screw-b", "handoff.ramp-left-entry.right-guide", "handoff.ramp-left-entry.right-guide.screw-a", "handoff.ramp-left-entry.right-guide.screw-b", "handoff.ramp-left-entry.flap.left-hinge-post", "handoff.ramp-left-entry.flap.left-hinge-post.cap", "handoff.ramp-left-entry.flap.right-stop-post", "handoff.ramp-left-entry.flap.right-stop-post.cap", "handoff.ramp-left-entry.left-guide.upper-post", "handoff.ramp-left-entry.left-guide.upper-post.cap", "handoff.ramp-left-entry.left-guide.lower-post", "handoff.ramp-left-entry.left-guide.lower-post.cap", "handoff.ramp-left-entry.right-guide.upper-post", "handoff.ramp-left-entry.right-guide.upper-post.cap", "handoff.ramp-left-entry.right-guide.lower-post", "handoff.ramp-left-entry.right-guide.lower-post.cap", "ramp.left.exit", "wireform.left-return.upper.rail-left", "wireform.left-return.upper.rail-left.clamp-entry", "wireform.left-return.upper.rail-left.clamp-mid", "wireform.left-return.upper.rail-left.clamp-exit", "wireform.left-return.upper.rail-right", "wireform.left-return.upper.rail-right.clamp-entry", "wireform.left-return.upper.rail-right.clamp-mid", "wireform.left-return.upper.rail-right.clamp-exit", "wireform.left-return.lower.rail-left", "wireform.left-return.lower.rail-left.clamp-entry", "wireform.left-return.lower.rail-left.clamp-mid", "wireform.left-return.lower.rail-left.clamp-exit", "wireform.left-return.lower.rail-right", "wireform.left-return.lower.rail-right.clamp-entry", "wireform.left-return.lower.rail-right.clamp-mid", "wireform.left-return.lower.rail-right.clamp-exit", "wireform.left-return.tie-upper-entry", "wireform.left-return.tie-upper-entry.screw-a", "wireform.left-return.tie-upper-entry.screw-b", "wireform.left-return.tie-upper-mid", "wireform.left-return.tie-upper-mid.screw-a", "wireform.left-return.tie-upper-mid.screw-b", "wireform.left-return.tie-upper-exit", "wireform.left-return.tie-upper-exit.screw-a", "wireform.left-return.tie-upper-exit.screw-b", "wireform.left-return.tie-lower-entry", "wireform.left-return.tie-lower-entry.screw-a", "wireform.left-return.tie-lower-entry.screw-b", "wireform.left-return.tie-lower-mid", "wireform.left-return.tie-lower-mid.screw-a", "wireform.left-return.tie-lower-mid.screw-b", "wireform.left-return.tie-lower-exit", "wireform.left-return.tie-lower-exit.screw-a", "wireform.left-return.tie-lower-exit.screw-b", "wireform.left-return.support.upper", "wireform.left-return.support.upper.cap", "wireform.left-return.support.upper.foot", "wireform.left-return.support.upper.foot.screw-left", "wireform.left-return.support.upper.foot.screw-right", "wireform.left-return.support.upper.collar", "wireform.left-return.support.upper.saddle", "wireform.left-return.support.upper.saddle.screw-left", "wireform.left-return.support.upper.saddle.screw-right", "wireform.left-return.support.mid", "wireform.left-return.support.mid.cap", "wireform.left-return.support.mid.foot", "wireform.left-return.support.mid.foot.screw-left", "wireform.left-return.support.mid.foot.screw-right", "wireform.left-return.support.mid.collar", "wireform.left-return.support.mid.saddle", "wireform.left-return.support.mid.saddle.screw-left", "wireform.left-return.support.mid.saddle.screw-right", "wireform.left-return.support.exit", "wireform.left-return.support.exit.cap", "wireform.left-return.support.exit.foot", "wireform.left-return.support.exit.foot.screw-left", "wireform.left-return.support.exit.foot.screw-right", "wireform.left-return.support.exit.collar", "wireform.left-return.support.exit.saddle", "wireform.left-return.support.exit.saddle.screw-left", "wireform.left-return.support.exit.saddle.screw-right", "wireform.left-return.exit", "handoff.ramp-left-exit.left-guide", "handoff.ramp-left-exit.left-guide.screw-a", "handoff.ramp-left-exit.left-guide.screw-b", "handoff.ramp-left-exit.right-guide", "handoff.ramp-left-exit.right-guide.screw-a", "handoff.ramp-left-exit.right-guide.screw-b", "handoff.ramp-left-exit.left-guide.upper-post", "handoff.ramp-left-exit.left-guide.upper-post.cap", "handoff.ramp-left-exit.left-guide.lower-post", "handoff.ramp-left-exit.left-guide.lower-post.cap", "handoff.ramp-left-exit.right-guide.upper-post", "handoff.ramp-left-exit.right-guide.upper-post.cap", "handoff.ramp-left-exit.right-guide.lower-post", "handoff.ramp-left-exit.right-guide.lower-post.cap", "lane.lower.left-in", "lane.lower.left-in.outer", "lane.lower.left-in.outer.screw-a", "lane.lower.left-in.outer.screw-b", "lane.lower.left-in.inner", "lane.lower.left-in.inner.screw-a", "lane.lower.left-in.inner.screw-b", "rollover.lower.left-in", "rollover.lower.left-in.screw-left", "rollover.lower.left-in.screw-right", "insert.lower.left-in-arrow", "insert.lower.left-in-arrow.lens", "lane.lower.left-in.guide-cover", "lane.lower.left-in.guide-cover.screw-upper", "lane.lower.left-in.guide-cover.screw-lower", "lane.lower.left-in.rubber-band", "post.left-in-top", "post.left-in-top.cap", "post.left-in-lower", "post.left-in-lower.cap", "post.drain-left", "post.drain-left.cap"] },
    { id: "shot.left-outlane-drain", label: "Left outlane drain", primaryFlipper: "none", deviceIds: ["lane.lower.left-out", "lane.lower.left-out.outer", "lane.lower.left-out.outer.screw-a", "lane.lower.left-out.outer.screw-b", "lane.lower.left-out.inner", "lane.lower.left-out.inner.screw-a", "lane.lower.left-out.inner.screw-b", "rollover.lower.left-out", "rollover.lower.left-out.screw-left", "rollover.lower.left-out.screw-right", "insert.lower.left-out-arrow", "insert.lower.left-out-arrow.lens", "lane.lower.left-out.guide-cover", "lane.lower.left-out.guide-cover.screw-upper", "lane.lower.left-out.guide-cover.screw-lower", "lane.lower.left-out.rubber-band", "post.left-out-top", "post.left-out-top.cap", "post.left-out-lower", "post.left-out-lower.cap", "boundary.left-apron", "boundary.left-apron.screw-a", "boundary.left-apron.screw-b", "boundary.apron-left-guide", "boundary.apron-left-guide.screw-a", "boundary.apron-left-guide.screw-b", "drain.center", "drain.left-guide", "drain.left-guide.screw-upper", "drain.left-guide.screw-lower", "drain.center-mouth", "drain.center-mouth.screw-left", "drain.center-mouth.screw-right"] },
    { id: "shot.right-outlane-drain", label: "Right outlane drain", primaryFlipper: "none", deviceIds: ["lane.lower.right-out", "lane.lower.right-out.inner", "lane.lower.right-out.inner.screw-a", "lane.lower.right-out.inner.screw-b", "lane.lower.right-out.outer", "lane.lower.right-out.outer.screw-a", "lane.lower.right-out.outer.screw-b", "rollover.lower.right-out", "rollover.lower.right-out.screw-left", "rollover.lower.right-out.screw-right", "insert.lower.right-out-arrow", "insert.lower.right-out-arrow.lens", "lane.lower.right-out.guide-cover", "lane.lower.right-out.guide-cover.screw-upper", "lane.lower.right-out.guide-cover.screw-lower", "lane.lower.right-out.rubber-band", "post.right-out-top", "post.right-out-top.cap", "post.right-out-lower", "post.right-out-lower.cap", "boundary.right-apron", "boundary.right-apron.screw-a", "boundary.right-apron.screw-b", "boundary.apron-right-guide", "boundary.apron-right-guide.screw-a", "boundary.apron-right-guide.screw-b", "drain.center", "drain.right-guide", "drain.right-guide.screw-upper", "drain.right-guide.screw-lower", "drain.center-mouth", "drain.center-mouth.screw-left", "drain.center-mouth.screw-right"] },
    { id: "shot.left-sling-rebound", label: "Left sling rebound", primaryFlipper: "none", deviceIds: ["sling.left", "sling.left.rubber-face", "sling.left.top-plastic", "sling.left.top-plastic.screw-outer", "sling.left.top-plastic.screw-inner", "sling.left.top-plastic.screw-nose", "insert.sling.left", "insert.sling.left.lens", "post.left-sling-a", "post.left-sling-a.cap", "post.left-sling-b", "post.left-sling-b.cap"] },
    { id: "shot.right-sling-rebound", label: "Right sling rebound", primaryFlipper: "none", deviceIds: ["sling.right", "sling.right.rubber-face", "sling.right.top-plastic", "sling.right.top-plastic.screw-outer", "sling.right.top-plastic.screw-inner", "sling.right.top-plastic.screw-nose", "insert.sling.right", "insert.sling.right.lens", "post.right-sling-a", "post.right-sling-a.cap", "post.right-sling-b", "post.right-sling-b.cap"] },
    { id: "shot.left-flipper-rebound", label: "Left flipper rebound", primaryFlipper: "none", deviceIds: ["flipper.left", "flipper.left.rubber-sleeve", "flipper.left.pivot-cap", "flipper.left.bat-screw-inner", "flipper.left.bat-screw-outer", "flipper.left.return-stop", "flipper.left.return-stop.screw-inner", "flipper.left.return-stop.screw-outer", "flipper.left.end-rubber", "flipper.left.end-rubber.screw-inner", "flipper.left.end-rubber.screw-outer"] },
    { id: "shot.right-flipper-rebound", label: "Right flipper rebound", primaryFlipper: "none", deviceIds: ["flipper.right", "flipper.right.rubber-sleeve", "flipper.right.pivot-cap", "flipper.right.bat-screw-inner", "flipper.right.bat-screw-outer", "flipper.right.return-stop", "flipper.right.return-stop.screw-inner", "flipper.right.return-stop.screw-outer", "flipper.right.end-rubber", "flipper.right.end-rubber.screw-inner", "flipper.right.end-rubber.screw-outer"] },
    { id: "shot.bonus-ladder", label: "Bonus ladder", primaryFlipper: "none", deviceIds: ["insert.bonus-1", "insert.bonus-1.lens", "insert.bonus-2", "insert.bonus-2.lens", "insert.bonus-3", "insert.bonus-3.lens"] },
    { id: "shot.center-bank", label: "Center target bank", primaryFlipper: "either", deviceIds: ["playfield.art.social-sweep", "target-bank.social", "target-bank.frame-top-rail", "target-bank.frame-top-rail.screw-a", "target-bank.frame-top-rail.screw-b", "target-bank.frame-bottom-rail", "target-bank.frame-bottom-rail.screw-a", "target-bank.frame-bottom-rail.screw-b", "target-bank.frame-left-cheek", "target-bank.frame-left-cheek.screw-a", "target-bank.frame-left-cheek.screw-b", "target-bank.frame-right-cheek", "target-bank.frame-right-cheek.screw-a", "target-bank.frame-right-cheek.screw-b", "target-bank.divider-1", "target-bank.divider-1.screw-a", "target-bank.divider-1.screw-b", "target-bank.divider-2", "target-bank.divider-2.screw-a", "target-bank.divider-2.screw-b", "target-bank.divider-3", "target-bank.divider-3.screw-a", "target-bank.divider-3.screw-b", "target-bank.divider-4", "target-bank.divider-4.screw-a", "target-bank.divider-4.screw-b", "target-bank.post-left-upper", "target-bank.post-left-upper.cap", "target-bank.post-left-lower", "target-bank.post-left-lower.cap", "target-bank.post-right-upper", "target-bank.post-right-upper.cap", "target-bank.post-right-lower", "target-bank.post-right-lower.cap", "target-bank-1", "target-bank-1.face", "insert.social-s", "insert.social-s.lens", "target-bank-1.mount-plate", "target-bank-1.mount-screw-left", "target-bank-1.mount-screw-right", "target-bank-1.rear-stop", "target-bank-2", "target-bank-2.face", "insert.social-o", "insert.social-o.lens", "target-bank-2.mount-plate", "target-bank-2.mount-screw-left", "target-bank-2.mount-screw-right", "target-bank-2.rear-stop", "target-bank-3", "target-bank-3.face", "insert.social-c", "insert.social-c.lens", "target-bank-3.mount-plate", "target-bank-3.mount-screw-left", "target-bank-3.mount-screw-right", "target-bank-3.rear-stop", "target-bank-4", "target-bank-4.face", "insert.social-i", "insert.social-i.lens", "target-bank-4.mount-plate", "target-bank-4.mount-screw-left", "target-bank-4.mount-screw-right", "target-bank-4.rear-stop", "target-bank-5", "target-bank-5.face", "insert.social-a", "insert.social-a.lens", "target-bank-5.mount-plate", "target-bank-5.mount-screw-left", "target-bank-5.mount-screw-right", "target-bank-5.rear-stop"] },
    { id: "shot.lock-saucer", label: "Lock saucer", primaryFlipper: "left", deviceIds: ["playfield.art.lock-label", "insert.lock-ready", "insert.lock-ready.lens", "lock.saucer", "lock.saucer.capture-sensor", "lock.saucer.held-ball-marker", "lock.saucer.cup", "lock.saucer.cup.screw-left", "lock.saucer.cup.screw-back", "lock.saucer.cup.screw-right", "lock.saucer.back-wall", "lock.saucer.back-wall.screw-a", "lock.saucer.back-wall.screw-b", "lock.saucer.left-entry-wall", "lock.saucer.left-entry-wall.screw-a", "lock.saucer.left-entry-wall.screw-b", "lock.saucer.right-entry-wall", "lock.saucer.right-entry-wall.screw-a", "lock.saucer.right-entry-wall.screw-b", "lock.saucer.left-post", "lock.saucer.left-post.cap", "lock.saucer.right-post", "lock.saucer.right-post.cap", "lock.saucer.eject-guide", "lock.saucer.eject-guide.screw-a", "lock.saucer.eject-guide.screw-b"] },
    { id: "shot.right-orbit", label: "Right orbit", primaryFlipper: "left", deviceIds: ["playfield.art.right-orbit-arrow", "insert.right-orbit-arrow", "insert.right-orbit-arrow.lens", "insert.jackpot", "insert.jackpot.lens", "orbit.right.entry", "handoff.right-orbit-entry.inner-guide", "handoff.right-orbit-entry.inner-guide.screw-a", "handoff.right-orbit-entry.inner-guide.screw-b", "handoff.right-orbit-entry.outer-guide", "handoff.right-orbit-entry.outer-guide.screw-a", "handoff.right-orbit-entry.outer-guide.screw-b", "handoff.right-orbit-entry.inner-guide.lower-post", "handoff.right-orbit-entry.inner-guide.lower-post.cap", "handoff.right-orbit-entry.inner-guide.upper-post", "handoff.right-orbit-entry.inner-guide.upper-post.cap", "handoff.right-orbit-entry.outer-guide.lower-post", "handoff.right-orbit-entry.outer-guide.lower-post.cap", "handoff.right-orbit-entry.outer-guide.upper-post", "handoff.right-orbit-entry.outer-guide.upper-post.cap", "orbit.right.outer.lower", "orbit.right.outer.lower.screw-a", "orbit.right.outer.lower.screw-b", "orbit.right.inner.lower", "orbit.right.inner.lower.screw-a", "orbit.right.inner.lower.screw-b", "orbit.right.outer.mid", "orbit.right.outer.mid.screw-a", "orbit.right.outer.mid.screw-b", "orbit.right.inner.mid", "orbit.right.inner.mid.screw-a", "orbit.right.inner.mid.screw-b", "orbit.right.outer.upper", "orbit.right.outer.upper.screw-a", "orbit.right.outer.upper.screw-b", "orbit.right.inner.upper", "orbit.right.inner.upper.screw-a", "orbit.right.inner.upper.screw-b", "boundary.top-arch.right-curve", "boundary.top-arch.center", "boundary.top-arch.left-curve", "orbit.right.exit", "handoff.upper-orbit-gates.right", "handoff.upper-orbit-gates.right.screw-a", "handoff.upper-orbit-gates.right.screw-b", "handoff.upper-orbit-gates.right.hinge-post", "handoff.upper-orbit-gates.right.hinge-post.cap", "handoff.upper-orbit-gates.right.stop-post", "handoff.upper-orbit-gates.right.stop-post.cap", "wireform.right-orbit-return.upper.rail-left", "wireform.right-orbit-return.upper.rail-left.clamp-entry", "wireform.right-orbit-return.upper.rail-left.clamp-mid", "wireform.right-orbit-return.upper.rail-left.clamp-exit", "wireform.right-orbit-return.upper.rail-right", "wireform.right-orbit-return.upper.rail-right.clamp-entry", "wireform.right-orbit-return.upper.rail-right.clamp-mid", "wireform.right-orbit-return.upper.rail-right.clamp-exit", "wireform.right-orbit-return.lower.rail-left", "wireform.right-orbit-return.lower.rail-left.clamp-entry", "wireform.right-orbit-return.lower.rail-left.clamp-mid", "wireform.right-orbit-return.lower.rail-left.clamp-exit", "wireform.right-orbit-return.lower.rail-right", "wireform.right-orbit-return.lower.rail-right.clamp-entry", "wireform.right-orbit-return.lower.rail-right.clamp-mid", "wireform.right-orbit-return.lower.rail-right.clamp-exit", "wireform.right-orbit-return.tie-upper-entry", "wireform.right-orbit-return.tie-upper-entry.screw-a", "wireform.right-orbit-return.tie-upper-entry.screw-b", "wireform.right-orbit-return.tie-upper-mid", "wireform.right-orbit-return.tie-upper-mid.screw-a", "wireform.right-orbit-return.tie-upper-mid.screw-b", "wireform.right-orbit-return.tie-upper-exit", "wireform.right-orbit-return.tie-upper-exit.screw-a", "wireform.right-orbit-return.tie-upper-exit.screw-b", "wireform.right-orbit-return.tie-lower-entry", "wireform.right-orbit-return.tie-lower-entry.screw-a", "wireform.right-orbit-return.tie-lower-entry.screw-b", "wireform.right-orbit-return.tie-lower-mid", "wireform.right-orbit-return.tie-lower-mid.screw-a", "wireform.right-orbit-return.tie-lower-mid.screw-b", "wireform.right-orbit-return.tie-lower-exit", "wireform.right-orbit-return.tie-lower-exit.screw-a", "wireform.right-orbit-return.tie-lower-exit.screw-b", "wireform.right-orbit-return.support.upper", "wireform.right-orbit-return.support.upper.cap", "wireform.right-orbit-return.support.upper.foot", "wireform.right-orbit-return.support.upper.foot.screw-left", "wireform.right-orbit-return.support.upper.foot.screw-right", "wireform.right-orbit-return.support.upper.collar", "wireform.right-orbit-return.support.upper.saddle", "wireform.right-orbit-return.support.upper.saddle.screw-left", "wireform.right-orbit-return.support.upper.saddle.screw-right", "wireform.right-orbit-return.support.mid", "wireform.right-orbit-return.support.mid.cap", "wireform.right-orbit-return.support.mid.foot", "wireform.right-orbit-return.support.mid.foot.screw-left", "wireform.right-orbit-return.support.mid.foot.screw-right", "wireform.right-orbit-return.support.mid.collar", "wireform.right-orbit-return.support.mid.saddle", "wireform.right-orbit-return.support.mid.saddle.screw-left", "wireform.right-orbit-return.support.mid.saddle.screw-right", "wireform.right-orbit-return.support.exit", "wireform.right-orbit-return.support.exit.cap", "wireform.right-orbit-return.support.exit.foot", "wireform.right-orbit-return.support.exit.foot.screw-left", "wireform.right-orbit-return.support.exit.foot.screw-right", "wireform.right-orbit-return.support.exit.collar", "wireform.right-orbit-return.support.exit.saddle", "wireform.right-orbit-return.support.exit.saddle.screw-left", "wireform.right-orbit-return.support.exit.saddle.screw-right", "wireform.right-orbit-return.exit", "handoff.right-orbit-exit.left-guide", "handoff.right-orbit-exit.left-guide.screw-a", "handoff.right-orbit-exit.left-guide.screw-b", "handoff.right-orbit-exit.right-guide", "handoff.right-orbit-exit.right-guide.screw-a", "handoff.right-orbit-exit.right-guide.screw-b", "handoff.right-orbit-exit.left-guide.upper-post", "handoff.right-orbit-exit.left-guide.upper-post.cap", "handoff.right-orbit-exit.left-guide.lower-post", "handoff.right-orbit-exit.left-guide.lower-post.cap", "handoff.right-orbit-exit.right-guide.upper-post", "handoff.right-orbit-exit.right-guide.upper-post.cap", "handoff.right-orbit-exit.right-guide.lower-post", "handoff.right-orbit-exit.right-guide.lower-post.cap", "lane.lower.right-in", "lane.lower.right-in.outer", "lane.lower.right-in.outer.screw-a", "lane.lower.right-in.outer.screw-b", "lane.lower.right-in.inner", "lane.lower.right-in.inner.screw-a", "lane.lower.right-in.inner.screw-b", "rollover.lower.right-in", "rollover.lower.right-in.screw-left", "rollover.lower.right-in.screw-right", "insert.lower.right-in-arrow", "insert.lower.right-in-arrow.lens", "lane.lower.right-in.guide-cover", "lane.lower.right-in.guide-cover.screw-upper", "lane.lower.right-in.guide-cover.screw-lower", "lane.lower.right-in.rubber-band", "post.right-in-top", "post.right-in-top.cap", "post.right-in-lower", "post.right-in-lower.cap", "post.drain-right", "post.drain-right.cap"] },
    { id: "shot.skill-shot", label: "Skill shot", primaryFlipper: "plunger", deviceIds: ["trough.shooter-feed-guide", "trough.shooter-feed-guide.screw-upper", "trough.shooter-feed-guide.screw-lower", "shooter.plunger", "shooter.plunger-spring", "shooter.plunger-spring.front-retainer", "shooter.plunger-spring.back-retainer", "shooter.plunger-stop-collar", "shooter.plunger-knob", "shooter.lane-groove", "shooter.plunger-housing", "shooter.plunger-housing.screw-front-left", "shooter.plunger-housing.screw-front-right", "shooter.plunger-housing.screw-back-left", "shooter.plunger-housing.screw-back-right", "shooter.lower-left-guide", "shooter.lower-left-guide.screw-lower", "shooter.lower-left-guide.screw-upper", "shooter.lower-right-guide", "shooter.lower-right-guide.screw-lower", "shooter.lower-right-guide.screw-upper", "boundary.shooter-arch.top", "boundary.top-arch.right-curve", "lane.top.center", "lane.top.center.inner-left", "lane.top.center.inner-left.screw-a", "lane.top.center.inner-left.screw-b", "lane.top.center.inner-right", "lane.top.center.inner-right.screw-a", "lane.top.center.inner-right.screw-b", "rollover.top.center", "rollover.top.center.screw-left", "rollover.top.center.screw-right", "insert.top.center-arrow", "insert.top.center-arrow.lens", "lane.top.center.guide-cover", "lane.top.center.guide-cover.screw-left", "lane.top.center.guide-cover.screw-right", "lane.top.center.rubber-band", "post.top-lane-center-left", "post.top-lane-center-left.cap", "post.top-lane-center-right", "post.top-lane-center-right.cap", "lane.top.right", "lane.top.right.inner", "lane.top.right.inner.screw-a", "lane.top.right.inner.screw-b", "lane.top.right.outer", "lane.top.right.outer.screw-a", "lane.top.right.outer.screw-b", "rollover.top.right", "rollover.top.right.screw-left", "rollover.top.right.screw-right", "insert.top.right-arrow", "insert.top.right-arrow.lens", "lane.top.right.guide-cover", "lane.top.right.guide-cover.screw-left", "lane.top.right.guide-cover.screw-right", "lane.top.right.rubber-band", "post.top-lane-right-inner", "post.top-lane-right-inner.cap", "post.top-lane-right-outer", "post.top-lane-right-outer.cap", "post.top-lane-right", "post.top-lane-right.cap", "pop-b", "pop-b.skirt", "pop-b.chrome-ring", "pop-b.lamp-lens", "pop-b.cap-screw-upper", "pop-b.cap-screw-left", "pop-b.cap-screw-right", "post.pop-b.upper", "post.pop-b.upper.cap", "post.pop-b.outer", "post.pop-b.outer.cap", "post.pop-b.inner", "post.pop-b.inner.cap", "pop-b.left-ring-rubber", "pop-b.left-ring-rubber.screw-a", "pop-b.left-ring-rubber.screw-b", "pop-b.right-ring-rubber", "pop-b.right-ring-rubber.screw-a", "pop-b.right-ring-rubber.screw-b", "pop-c", "pop-c.skirt", "pop-c.chrome-ring", "pop-c.lamp-lens", "pop-c.cap-screw-upper", "pop-c.cap-screw-left", "pop-c.cap-screw-right", "post.pop-c.lower-left", "post.pop-c.lower-left.cap", "post.pop-c.lower-right", "post.pop-c.lower-right.cap", "post.pop-c.upper", "post.pop-c.upper.cap", "pop-c.lower-left-ring-rubber", "pop-c.lower-left-ring-rubber.screw-a", "pop-c.lower-left-ring-rubber.screw-b", "pop-c.lower-right-ring-rubber", "pop-c.lower-right-ring-rubber.screw-a", "pop-c.lower-right-ring-rubber.screw-b", "lane.shooter.skill", "lane.shooter.skill.outer", "lane.shooter.skill.outer.screw-a", "lane.shooter.skill.outer.screw-b", "lane.shooter.skill.inner", "lane.shooter.skill.inner.screw-a", "lane.shooter.skill.inner.screw-b", "rollover.shooter.skill", "rollover.shooter.skill.screw-left", "rollover.shooter.skill.screw-right", "lane.shooter.skill.guide-cover", "lane.shooter.skill.guide-cover.screw-inner", "lane.shooter.skill.guide-cover.screw-outer", "lane.shooter.skill.rubber-band", "post.shooter-skill-lane-inner", "post.shooter-skill-lane-inner.cap", "post.shooter-skill-lane-outer", "post.shooter-skill-lane-outer.cap", "insert.skill-shot", "insert.skill-shot.lens", "shooter.one-way-gate", "shooter.one-way-gate.hinge-post", "shooter.one-way-gate.hinge-post.cap", "shooter.one-way-gate.stop-post", "shooter.one-way-gate.stop-post.cap"] }
  ]
};

export const targetBankSize = silverballSocialBlueprint.targets.length;
