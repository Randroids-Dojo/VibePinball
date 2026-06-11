import * as THREE from "three";
import type { PhysicsSnapshot } from "./physics";
import {
  silverballSocialBlueprint,
  type ApronCard,
  type ApronCardProtector,
  type ApronFastener,
  type ArcadeHallContext,
  type BoundarySegment,
  type CabinetControlButton,
  type CabinetHardware,
  type CabinetHeaderPanel,
  type CabinetSideArtPanel,
  type CabinetTopperLight,
  type DrainDevice,
  type DrainGuide,
  type ElevatedSupportCollar,
  type ElevatedSupportFoot,
  type ElevatedSupportSaddle,
  type FlipperStop,
  type HandoffSegment,
  type LampInsert,
  type LaneGuideCover,
  type LaneWallSegment,
  type FlipperDevice,
  type PlayfieldArt,
  type PlasticCover,
  type PlungerDevice,
  type PopBumperGuardSegment,
  type Post,
  type RampCrossBrace,
  type RampEntranceLip,
  type RampPath,
  type RampSideRailFastener,
  type RampSideWall,
  type RolloverWire,
  type SaucerEjectCoil,
  type SaucerWallSegment,
  type SlingDevice,
  type TargetDevice,
  type TargetBankFrameSegment,
  type TargetBankHardware,
  type TroughEjectCoil,
  type TroughFastener,
  type TroughOptoPair,
  type WireformRailFastener,
  type WireformTieFastener,
  type WireformPath
} from "./tableBlueprint";

export interface PinballScene {
  resize: () => void;
  render: (snapshot: PhysicsSnapshot) => void;
  dispose: () => void;
}

export const createPinballScene = (canvas: HTMLCanvasElement): PinballScene => {
  const blueprint = silverballSocialBlueprint;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080807);
  scene.fog = new THREE.Fog(0x14110d, 20, 38);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 12.2, 13.5);
  camera.lookAt(0, 0, -0.55);

  const group = new THREE.Group();
  group.rotation.x = -blueprint.playfield.slopeAngle;
  scene.add(group);
  const lampInsertById = new Map(blueprint.lampInserts.map((insert) => [insert.id, insert]));
  const targetLampInsertIds = new Set(blueprint.targets.map((target) => target.lampInsertId));

  const ambient = new THREE.AmbientLight(0xf8e7c2, 1.15);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.7);
  key.position.set(-4, 10, 6);
  key.castShadow = true;
  scene.add(key);

  const warmLamp = new THREE.PointLight(0xf1c453, 4.4, 22);
  warmLamp.position.set(0, 3.2, -3.2);
  scene.add(warmLamp);
  addArcadeHallContext(scene, blueprint.arcadeHall);

  const playfield = mesh(
    new THREE.BoxGeometry(blueprint.playfield.width, blueprint.playfield.thickness, blueprint.playfield.depth),
    new THREE.MeshStandardMaterial({ color: blueprint.playfield.woodColor, roughness: 0.38, metalness: 0.05 })
  );
  playfield.position.set(blueprint.playfield.x, blueprint.playfield.surfaceY - blueprint.playfield.thickness / 2, blueprint.playfield.z);
  playfield.receiveShadow = true;
  group.add(playfield);

  blueprint.playfieldArt.forEach((item) => addPlayfieldArt(group, item));

  blueprint.boundaries.forEach((segment) => addBoundarySegment(group, segment));
  blueprint.laneWalls.forEach((segment) => addLaneWallSegment(group, segment));
  blueprint.rubberBands.forEach((segment) => addSegment(group, segment, 0.44));
  blueprint.rolloverWires.forEach((wire) => addRolloverWire(group, wire));
  blueprint.flipperStops.forEach((stop) => addFlipperStop(group, stop));
  blueprint.posts.forEach((post) => addPost(group, post));
  addCabinetHardware(group, blueprint.cabinet);
  blueprint.lanes.forEach((lane) => {
    if (lane.guideCover) {
      addLaneGuideCover(group, lane.guideCover);
    }
    if (!lane.lampInsertId || !lampInsertById.has(lane.lampInsertId)) {
      addInsert(group, lane.x, lane.z, lane.side === "top" ? 0x5fd4ff : 0xf1c453);
    }
  });
  blueprint.lampInserts
    .filter((insert) => !targetLampInsertIds.has(insert.id))
    .forEach((insert) => addLampInsert(group, insert));
  blueprint.orbits.forEach((orbit) => {
    addInsert(group, orbit.entry.x, orbit.entry.z, 0x76ff8f);
    addInsert(group, orbit.exit.x, orbit.exit.z, 0x5fd4ff);
  });
  addDrainAndTrough(group, blueprint.drain);
  blueprint.plastics.forEach((cover) => addPlasticCover(group, cover));
  addPlungerHardware(group, blueprint.plunger);

  const leftFlipperDevice = blueprint.flippers.find((item) => item.side === "left")!;
  const leftFlipper = createFlipper(leftFlipperDevice, 0xd9d3c4);
  leftFlipper.position.set(leftFlipperDevice.x, 0.25, leftFlipperDevice.z);
  leftFlipper.rotation.y = leftFlipperDevice.restAngle;
  group.add(leftFlipper);

  const rightFlipperDevice = blueprint.flippers.find((item) => item.side === "right")!;
  const rightFlipper = createFlipper(rightFlipperDevice, 0xd9d3c4);
  rightFlipper.position.set(rightFlipperDevice.x, 0.25, rightFlipperDevice.z);
  rightFlipper.rotation.y = Math.PI + rightFlipperDevice.restAngle;
  group.add(rightFlipper);

  const ball = mesh(
    new THREE.SphereGeometry(blueprint.scale.ballRadius, 32, 18),
    new THREE.MeshStandardMaterial({ color: 0xdce3e4, roughness: 0.16, metalness: 0.85 })
  );
  ball.castShadow = true;
  group.add(ball);
  const saucerHoldMarkers = new Map<string, THREE.Mesh>();

  blueprint.bumpers.forEach((device) => {
    const bumper = mesh(
      new THREE.CylinderGeometry(device.capRadius, device.capRadius + 0.1, 0.38, 32),
      new THREE.MeshStandardMaterial({
        color: device.capColor,
        emissive: device.capColor,
        emissiveIntensity: 0.16,
        roughness: 0.25
      })
    );
    bumper.position.set(device.x, 0.32, device.z);
    group.add(bumper);
    const lampLens = mesh(
      new THREE.CylinderGeometry(device.lampLens.radius, device.lampLens.radius, device.lampLens.height, 24),
      new THREE.MeshStandardMaterial({
        color: device.lampLens.color,
        emissive: device.lampLens.color,
        emissiveIntensity: 0.28,
        transparent: true,
        opacity: 0.72,
        roughness: 0.08
      })
    );
    lampLens.position.set(device.lampLens.x, 0.535, device.lampLens.z);
    group.add(lampLens);
    device.capFasteners.forEach((fastener) => {
      const screw = mesh(
        new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.035, 16),
        new THREE.MeshStandardMaterial({ color: 0xe0e7e8, roughness: 0.16, metalness: 0.86 })
      );
      screw.position.set(fastener.x, 0.535, fastener.z);
      group.add(screw);
    });
    const skirt = mesh(
      new THREE.CylinderGeometry(device.skirt.radius, device.skirt.radius, device.skirt.height, 32),
      new THREE.MeshStandardMaterial({
        color: device.skirt.color,
        emissive: 0x5c3c05,
        roughness: 0.25
      })
    );
    skirt.position.set(device.skirt.x, 0.12, device.skirt.z);
    group.add(skirt);
    addRing(group, device.x, device.z, device.chromeRing.radius, device.chromeRing.tubeRadius, 0xb7c4c7);
    device.guardSegments.forEach((segment) => addPopBumperGuardSegment(group, segment));
  });

  addTargetBankHardware(group, blueprint.targetBank);
  blueprint.targets.forEach((device) => {
    addTargetMountHardware(group, device);
    const target = mesh(
      new THREE.BoxGeometry(device.face.width, device.face.height, device.face.thickness),
      new THREE.MeshStandardMaterial({
        color: device.face.color,
        emissive: 0x3a0707,
        roughness: 0.35
      })
    );
    target.position.set(device.face.x, 0.38, device.face.z);
    target.rotation.y = device.face.angle ?? 0;
    group.add(target);
    addSegment(group, device.rearStop, 0.28);
    addTargetDecal(group, device.label, device.face.x, device.face.z + 0.075, device.face.angle ?? 0, device.decalColor);
    addDeckLabel(group, device.label, device.face.x, device.face.z - 0.05, 0.34, 0.28, device.face.angle ?? 0);
    const targetInsert = lampInsertById.get(device.lampInsertId);
    if (targetInsert) {
      addLampInsert(group, targetInsert);
    }
  });

  blueprint.saucers.forEach((saucer) => {
    const cup = mesh(
      new THREE.CylinderGeometry(saucer.cup.innerRadius, saucer.cup.outerRadius, saucer.cup.height, 32),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.25, metalness: 0.65 })
    );
    cup.position.set(saucer.x, 0.18, saucer.z);
    group.add(cup);
    const captureSensor = mesh(
      new THREE.CylinderGeometry(saucer.captureSensor.radius, saucer.captureSensor.radius, saucer.captureSensor.height, 32),
      new THREE.MeshStandardMaterial({
        color: saucer.captureSensor.color,
        emissive: saucer.captureSensor.color,
        emissiveIntensity: 0.18,
        transparent: true,
        opacity: 0.54,
        roughness: 0.12
      })
    );
    captureSensor.position.set(saucer.captureSensor.x, 0.275, saucer.captureSensor.z);
    group.add(captureSensor);
    saucer.cup.fasteners.forEach((fastener) => {
      const screw = mesh(
        new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.026, 18),
        new THREE.MeshStandardMaterial({ color: 0xc7d0d2, roughness: 0.16, metalness: 0.82 })
      );
      screw.position.set(fastener.x, 0.275, fastener.z);
      group.add(screw);
    });
    saucer.walls.forEach((segment) => addSaucerWallSegment(group, segment));
    addSaucerEjectCoil(group, saucer.ejectCoil);
    saucer.posts.forEach((post) => addPost(group, post));
    const heldBall = mesh(
      new THREE.SphereGeometry(saucer.heldBallMarker.radius, 24, 14),
      new THREE.MeshStandardMaterial({ color: saucer.heldBallMarker.color, roughness: 0.18, metalness: 0.82 })
    );
    heldBall.position.set(saucer.heldBallMarker.x, 0.35, saucer.heldBallMarker.z);
    heldBall.visible = false;
    group.add(heldBall);
    saucerHoldMarkers.set(saucer.id, heldBall);
    addInsert(group, saucer.x, saucer.z + 0.64, 0xff4b4b);
  });

  blueprint.ramps.forEach((rampDevice) => {
    addRampDevice(group, rampDevice);
  });

  blueprint.handoffs.forEach((handoff) => {
    handoff.segments.forEach((segment) => addHandoffSegment(group, segment));
    handoff.posts?.forEach((post) => addPost(group, post));
  });

  blueprint.wireforms.forEach((wireform) => addWireformPath(group, wireform));

  blueprint.slings.forEach((sling) => {
    addSlingTriangle(group, sling);
    addSlingTopPlastic(group, sling);
    addSegment(group, sling.rubberFace, 0.46);
    addLampInsert(group, sling.lamp);
  });

  addCabinetShell(scene, blueprint.cabinet);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };

  const render = (snapshot: PhysicsSnapshot) => {
    ball.position.set(snapshot.ball.x, snapshot.ball.y + blueprint.scale.ballRadius, snapshot.ball.z);
    saucerHoldMarkers.forEach((marker, saucerId) => {
      const isHeld = snapshot.saucerHold?.id === saucerId;
      marker.visible = isHeld;
      if (isHeld && snapshot.saucerHold) {
        marker.position.set(snapshot.saucerHold.x, 0.35, snapshot.saucerHold.z);
      }
    });
    leftFlipper.rotation.y = snapshot.leftFlipperAngle;
    rightFlipper.rotation.y = Math.PI + snapshot.rightFlipperAngle;
    const lampPulse = Math.sin(performance.now() * 0.006) * 0.16;
    warmLamp.intensity = 2.2 + lampPulse + snapshot.plungerCharge * 1.4;
    renderer.render(scene, camera);
  };

  const dispose = () => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) {
          material.forEach((item) => {
            item.map?.dispose();
            item.dispose();
          });
        } else {
          material.map?.dispose();
          material.dispose();
        }
      }
    });
    renderer.dispose();
  };

  resize();
  return { resize, render, dispose };
};

const mesh = <TGeometry extends THREE.BufferGeometry, TMaterial extends THREE.Material>(
  geometry: TGeometry,
  material: TMaterial
) => {
  const item = new THREE.Mesh(geometry, material);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
};

const addRail = (
  group: THREE.Group,
  x: number,
  z: number,
  width: number,
  depth: number,
  angle = 0,
  color = 0xb7c4c7,
  y = 0.28,
  pitch = 0,
  height = 0.4
) => {
  const rail = mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.22, metalness: 0.75 })
  );
  rail.position.set(x, y, z);
  rail.rotation.set(pitch, angle, 0);
  group.add(rail);
};

const addRampDevice = (group: THREE.Group, ramp: RampPath) => {
  const rise = ramp.endY - ramp.startY;
  const pitch = Math.atan2(rise, ramp.depth);
  const slopedDepth = Math.hypot(ramp.depth, rise);
  const centerY = (ramp.startY + ramp.endY) / 2;
  const floor = mesh(
    new THREE.BoxGeometry(ramp.width, ramp.floorThickness, slopedDepth),
    new THREE.MeshStandardMaterial({
      color: 0x74a8ff,
      transparent: true,
      opacity: 0.46,
      roughness: 0.18,
      metalness: 0.08
    })
  );
  floor.position.set(ramp.x, centerY, ramp.z);
  floor.rotation.set(pitch, ramp.angle, 0);
  group.add(floor);

  ramp.crossBraces.forEach((brace) => addRampCrossBrace(group, brace));
  ramp.sideWalls.forEach((wall) => addRampSideWall(group, wall));

  ramp.sideRails.forEach((rail) => {
    addRail(
      group,
      rail.x,
      rail.z,
      rail.width,
      rail.depth,
      rail.angle,
      0x9fd0ff,
      (rail.startY + rail.endY) / 2,
      rail.pitch,
      rail.height
    );
    rail.fasteners.forEach((fastener) => addRampSideRailFastener(group, fastener));
  });
  addRampEntranceLip(group, ramp.entranceLip, ramp.startY + 0.12);

  ramp.supports.forEach((support) => {
    addElevatedSupportFoot(group, support.x, support.z, support.foot);

    const supportMesh = mesh(
      new THREE.CylinderGeometry(support.radius, support.radius, support.height, 16),
      new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.18, metalness: 0.82 })
    );
    supportMesh.position.set(support.x, support.height / 2, support.z);
    group.add(supportMesh);

    addElevatedSupportCollar(group, support.x, support.z, support.collar);
    addElevatedSupportSaddle(group, support.x, support.z, support.saddle);

    const cap = mesh(
      new THREE.CylinderGeometry(support.cap.radius, support.cap.radius, support.cap.height, 18),
      new THREE.MeshStandardMaterial({ color: 0xe0e7e8, roughness: 0.16, metalness: 0.88 })
    );
    cap.position.set(support.x, support.height + support.cap.height / 2, support.z);
    group.add(cap);
  });
};

const addRampSideWall = (group: THREE.Group, wall: RampSideWall) => {
  const panel = mesh(
    new THREE.BoxGeometry(wall.width, wall.height, wall.depth),
    new THREE.MeshStandardMaterial({
      color: 0x8fc9ff,
      transparent: true,
      opacity: 0.36,
      roughness: 0.12,
      metalness: 0.02
    })
  );
  panel.position.set(wall.x, (wall.startY + wall.endY) / 2, wall.z);
  panel.rotation.set(wall.pitch, wall.angle, 0);
  group.add(panel);

  wall.fasteners.forEach((fastener) => {
    const rivet = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
    );
    rivet.position.set(fastener.x, fastener.y, fastener.z);
    group.add(rivet);
  });
};

const addRampCrossBrace = (group: THREE.Group, brace: RampCrossBrace) => {
  addRail(
    group,
    brace.x,
    brace.z,
    brace.width,
    brace.depth,
    brace.angle ?? 0,
    0xcbd3d6,
    brace.y,
    brace.pitch,
    0.04
  );
  brace.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
    );
    screw.position.set(fastener.x, fastener.y, fastener.z);
    group.add(screw);
  });
};

const addRampSideRailFastener = (group: THREE.Group, fastener: RampSideRailFastener) => {
  const screw = mesh(
    new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
    new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
  );
  screw.position.set(fastener.x, fastener.y, fastener.z);
  group.add(screw);
};

const addSegment = (
  group: THREE.Group,
  segment: { x: number; z: number; width: number; depth: number; angle?: number; kind: string },
  y: number
) => {
  const color = segment.kind === "rubber"
    ? 0x141414
    : segment.kind === "wire"
      ? 0xf4d35e
      : segment.kind === "plastic"
        ? 0xf5dfb5
        : 0xb7c4c7;
  addRail(group, segment.x, segment.z, segment.width, segment.depth, segment.angle ?? 0, color, y);
};

const addBoundarySegment = (group: THREE.Group, segment: BoundarySegment) => {
  addSegment(group, segment, 0.28);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.49, fastener.z);
    group.add(screw);
  });
};

const addPopBumperGuardSegment = (group: THREE.Group, segment: PopBumperGuardSegment) => {
  addSegment(group, segment, 0.4);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.61, fastener.z);
    group.add(screw);
  });
};

const addLaneWallSegment = (group: THREE.Group, segment: LaneWallSegment) => {
  addSegment(group, segment, 0.36);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.585, fastener.z);
    group.add(screw);
  });
};

const addHandoffSegment = (group: THREE.Group, segment: HandoffSegment) => {
  addSegment(group, segment, segment.kind === "metal" ? 0.5 : 0.78);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, segment.kind === "metal" ? 0.725 : 1.005, fastener.z);
    group.add(screw);
  });
};

const addRampEntranceLip = (group: THREE.Group, lip: RampEntranceLip, y: number) => {
  addSegment(group, lip, y);
  lip.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, y + 0.225, fastener.z);
    group.add(screw);
  });
};

const addRolloverWire = (group: THREE.Group, wire: RolloverWire) => {
  addSegment(group, wire, 0.18);
  wire.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.235, fastener.z);
    group.add(screw);
  });
};

const addFlipperStop = (group: THREE.Group, stop: FlipperStop) => {
  addSegment(group, stop, 0.32);
  stop.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.49, fastener.z);
    group.add(screw);
  });
};

const addPost = (group: THREE.Group, postRecord: Post) => {
  const post = mesh(
    new THREE.CylinderGeometry(postRecord.radius, postRecord.radius, 0.42, 20),
    new THREE.MeshStandardMaterial({
      color: postRecord.kind === "rubber" ? 0x111111 : 0xb7c4c7,
      roughness: 0.24,
      metalness: postRecord.kind === "metal" ? 0.75 : 0.05
    })
  );
  post.position.set(postRecord.x, 0.32, postRecord.z);
  group.add(post);

  if (postRecord.cap) {
    const cap = mesh(
      new THREE.CylinderGeometry(postRecord.cap.radius, postRecord.cap.radius, postRecord.cap.height, 20),
      new THREE.MeshStandardMaterial({ color: 0xc7d0d2, roughness: 0.16, metalness: 0.82 })
    );
    cap.position.set(postRecord.x, 0.545, postRecord.z);
    group.add(cap);
  }
};

const addSlingTriangle = (group: THREE.Group, sling: SlingDevice) => {
  const { outerX, outerZ, innerX, innerZ, noseX, noseZ } = sling.triangle;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([
      outerX, 0.52, outerZ,
      innerX, 0.52, innerZ,
      noseX, 0.52, noseZ
    ], 3)
  );
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();

  const top = mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0xffe6ac,
      transparent: true,
      opacity: 0.72,
      roughness: 0.24,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  );
  group.add(top);

  const outline = new THREE.Group();
  addSegmentTo(outline, outerX, outerZ, innerX, innerZ, 0.6);
  addSegmentTo(outline, innerX, innerZ, noseX, noseZ, 0.6);
  addSegmentTo(outline, noseX, noseZ, outerX, outerZ, 0.6);
  group.add(outline);
};

const addSlingTopPlastic = (group: THREE.Group, sling: SlingDevice) => {
  const { outerX, outerZ, innerX, innerZ, noseX, noseZ } = sling.triangle;
  const { topPlastic } = sling;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([
      outerX, topPlastic.layerY, outerZ,
      innerX, topPlastic.layerY, innerZ,
      noseX, topPlastic.layerY, noseZ
    ], 3)
  );
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();

  const plastic = mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: topPlastic.color,
      transparent: true,
      opacity: 0.78,
      roughness: 0.2,
      metalness: 0.02,
      side: THREE.DoubleSide
    })
  );
  group.add(plastic);

  topPlastic.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, topPlastic.thickness, 20),
      new THREE.MeshStandardMaterial({ color: 0xd5dde0, roughness: 0.18, metalness: 0.84 })
    );
    screw.position.set(fastener.x, topPlastic.layerY + topPlastic.thickness / 2 + 0.004, fastener.z);
    group.add(screw);
  });
};

const addSegmentTo = (
  group: THREE.Group,
  ax: number,
  az: number,
  bx: number,
  bz: number,
  y: number
) => {
  const dx = bx - ax;
  const dz = bz - az;
  addRail(
    group,
    (ax + bx) / 2,
    (az + bz) / 2,
    0.045,
    Math.hypot(dx, dz),
    Math.atan2(dx, dz),
    0xf4d35e,
    y
  );
};

const addInsert = (group: THREE.Group, x: number, z: number, color: number, radius = 0.16, y = 0.045) => {
  const insert = mesh(
    new THREE.CylinderGeometry(radius, radius, 0.035, 24),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.28, roughness: 0.38 })
  );
  insert.position.set(x, y, z);
  group.add(insert);
};

const addLampInsert = (group: THREE.Group, insert: LampInsert, y = 0.045) => {
  if (insert.shape === "circle") {
    addInsert(group, insert.x, insert.z, insert.color, insert.radius, y);
    addLampInsertLens(group, insert, y + 0.025);
    return;
  }

  if (insert.shape === "bar") {
    const bar = mesh(
      new THREE.BoxGeometry(insert.radius * 3, 0.035, insert.radius * 1.45),
      new THREE.MeshStandardMaterial({
        color: insert.color,
        emissive: insert.color,
        emissiveIntensity: 0.22,
        roughness: 0.34
      })
    );
    bar.position.set(insert.x, y, insert.z);
    bar.rotation.y = insert.angle ?? 0;
    group.add(bar);
    addDeckLabel(group, insert.label, insert.x, insert.z, insert.radius * 2.5, insert.radius, insert.angle ?? 0, y + 0.025);
    addLampInsertLens(group, insert, y + 0.025);
    return;
  }

  const arrow = mesh(
    new THREE.ConeGeometry(insert.radius, 0.05, 3),
    new THREE.MeshStandardMaterial({
      color: insert.color,
      emissive: insert.color,
      emissiveIntensity: 0.26,
      roughness: 0.34
    })
  );
  arrow.position.set(insert.x, y + 0.01, insert.z);
  arrow.rotation.y = Math.PI + (insert.angle ?? 0);
  group.add(arrow);
  addLampInsertLens(group, insert, y + 0.035);
};

const addLampInsertLens = (group: THREE.Group, insert: LampInsert, y: number) => {
  const material = new THREE.MeshStandardMaterial({
    color: insert.lens.color,
    emissive: insert.lens.color,
    emissiveIntensity: 0.12,
    transparent: true,
    opacity: 0.46,
    roughness: 0.16,
    metalness: 0.02
  });

  if (insert.lens.shape === "circle") {
    const lens = mesh(
      new THREE.CylinderGeometry(insert.lens.radius, insert.lens.radius, insert.lens.height, 28),
      material
    );
    lens.position.set(insert.lens.x, y, insert.lens.z);
    lens.rotation.y = insert.lens.angle ?? 0;
    group.add(lens);
    return;
  }

  if (insert.lens.shape === "bar") {
    const lens = mesh(
      new THREE.BoxGeometry(insert.lens.width, insert.lens.height, insert.lens.depth),
      material
    );
    lens.position.set(insert.lens.x, y, insert.lens.z);
    group.add(lens);
    return;
  }

  const lens = mesh(
    new THREE.ConeGeometry(insert.lens.radius, insert.lens.height, 3),
    material
  );
  lens.position.set(insert.lens.x, y, insert.lens.z);
  lens.rotation.y = Math.PI + (insert.lens.angle ?? 0);
  group.add(lens);
};

const addPlayfieldArt = (group: THREE.Group, art: PlayfieldArt) => {
  if (art.kind === "arrow") {
    const arrow = mesh(
      new THREE.ConeGeometry(art.width / 2, 0.055, 3),
      new THREE.MeshStandardMaterial({
        color: art.color,
        emissive: art.color,
        emissiveIntensity: 0.1,
        roughness: 0.38,
        metalness: 0.01
      })
    );
    arrow.position.set(art.x, art.layerY, art.z);
    arrow.rotation.y = Math.PI + (art.angle ?? 0);
    group.add(arrow);
    addDeckLabel(group, art.label, art.x, art.z + art.depth * 0.62, art.width * 1.25, art.depth * 0.34, art.angle ?? 0, art.layerY + 0.018);
    return;
  }

  const geometry = art.kind === "zone"
    ? new THREE.BoxGeometry(art.width, 0.026, art.depth)
    : new THREE.BoxGeometry(art.width, 0.028, art.depth);
  const deckArt = mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: art.color,
      emissive: art.color,
      emissiveIntensity: art.kind === "zone" ? 0.02 : 0.08,
      roughness: 0.44,
      metalness: 0.01
    })
  );
  deckArt.position.set(art.x, art.layerY, art.z);
  deckArt.rotation.y = art.angle ?? 0;
  group.add(deckArt);

  if (art.kind === "label" || art.kind === "stripe") {
    addDeckLabel(group, art.label, art.x, art.z, art.width * 0.82, art.depth * 0.72, art.angle ?? 0, art.layerY + 0.02);
  }
};

const addRing = (group: THREE.Group, x: number, z: number, radius: number, tubeRadius: number, color: number) => {
  const ring = mesh(
    new THREE.TorusGeometry(radius, tubeRadius, 8, 32),
    new THREE.MeshStandardMaterial({ color, roughness: 0.22, metalness: 0.78 })
  );
  ring.position.set(x, 0.48, z);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
};

const addWireformPath = (group: THREE.Group, wireform: WireformPath) => {
  wireform.rails.forEach((rail) => {
    addRail(
      group,
      rail.x,
      rail.z,
      rail.width,
      rail.depth,
      rail.angle ?? 0,
      0xf4d35e,
      rail.y,
      0,
      rail.height
    );
    rail.fasteners.forEach((fastener) => addWireformRailFastener(group, fastener));
  });
  wireform.ties.forEach((tie) => {
    addRail(
      group,
      tie.x,
      tie.z,
      tie.width,
      tie.depth,
      tie.angle ?? 0,
      0xf4d35e,
      wireform.railY,
      0,
      0.035
    );
    tie.fasteners.forEach((fastener) => addWireformTieFastener(group, fastener));
  });
  wireform.supports.forEach((support) => {
    addElevatedSupportFoot(group, support.x, support.z, support.foot);

    const supportMesh = mesh(
      new THREE.CylinderGeometry(support.radius, support.radius, support.height, 16),
      new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.18, metalness: 0.82 })
    );
    supportMesh.position.set(support.x, support.height / 2, support.z);
    group.add(supportMesh);

    addElevatedSupportCollar(group, support.x, support.z, support.collar);
    addElevatedSupportSaddle(group, support.x, support.z, support.saddle);

    const supportCap = mesh(
      new THREE.CylinderGeometry(support.cap.radius, support.cap.radius, support.cap.height, 18),
      new THREE.MeshStandardMaterial({ color: 0xe0e7e8, roughness: 0.16, metalness: 0.88 })
    );
    supportCap.position.set(support.x, support.height + support.cap.height / 2, support.z);
    group.add(supportCap);
  });
  addInsert(group, wireform.exit.x, wireform.exit.z, 0x76ff8f);
};

const addWireformRailFastener = (group: THREE.Group, fastener: WireformRailFastener) => {
  const clamp = mesh(
    new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
    new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
  );
  clamp.position.set(fastener.x, fastener.y, fastener.z);
  group.add(clamp);
};

const addWireformTieFastener = (group: THREE.Group, fastener: WireformTieFastener) => {
  const screw = mesh(
    new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
  );
  screw.position.set(fastener.x, fastener.y, fastener.z);
  group.add(screw);
};

const addElevatedSupportFoot = (
  group: THREE.Group,
  x: number,
  z: number,
  foot: ElevatedSupportFoot
) => {
  const plate = mesh(
    new THREE.CylinderGeometry(foot.radius, foot.radius, foot.height, 24),
    new THREE.MeshStandardMaterial({ color: 0xc7d0d2, roughness: 0.2, metalness: 0.82 })
  );
  plate.position.set(x, 0.085, z);
  group.add(plate);

  foot.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.112, fastener.z);
    group.add(screw);
  });
};

const addElevatedSupportCollar = (
  group: THREE.Group,
  x: number,
  z: number,
  collar: ElevatedSupportCollar
) => {
  const ring = mesh(
    new THREE.CylinderGeometry(collar.radius, collar.radius, collar.height, 20),
    new THREE.MeshStandardMaterial({ color: 0xd6dde0, roughness: 0.18, metalness: 0.86 })
  );
  ring.position.set(x, collar.y, z);
  group.add(ring);
};

const addElevatedSupportSaddle = (
  group: THREE.Group,
  x: number,
  z: number,
  saddle: ElevatedSupportSaddle
) => {
  const bracket = mesh(
    new THREE.BoxGeometry(saddle.width, saddle.height, saddle.depth),
    new THREE.MeshStandardMaterial({ color: 0xcad2d5, roughness: 0.18, metalness: 0.86 })
  );
  bracket.position.set(x, saddle.y, z);
  bracket.rotation.y = saddle.angle;
  group.add(bracket);

  saddle.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xe7edf0, roughness: 0.16, metalness: 0.88 })
    );
    screw.position.set(fastener.x, saddle.y + saddle.height / 2 + 0.006, fastener.z);
    group.add(screw);
  });
};

const addPlasticCover = (
  group: THREE.Group,
  cover: PlasticCover
) => {
  cover.standoffs.forEach((standoff) => {
    addElevatedSupportFoot(group, standoff.x, standoff.z, standoff.foot);

    const post = mesh(
      new THREE.CylinderGeometry(standoff.radius, standoff.radius, standoff.height, 18),
      new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.18, metalness: 0.82 })
    );
    post.position.set(standoff.x, standoff.height / 2, standoff.z);
    group.add(post);

    addElevatedSupportCollar(group, standoff.x, standoff.z, standoff.collar);

    const cap = mesh(
      new THREE.CylinderGeometry(standoff.capRadius, standoff.capRadius, 0.035, 18),
      new THREE.MeshStandardMaterial({ color: 0xe2e9ea, roughness: 0.16, metalness: 0.88 })
    );
    cap.position.set(standoff.x, cover.layerY + 0.045, standoff.z);
    group.add(cap);
  });

  const plastic = mesh(
    new THREE.BoxGeometry(cover.width, 0.055, cover.depth),
    new THREE.MeshStandardMaterial({
      color: cover.color,
      transparent: true,
      opacity: 0.62,
      roughness: 0.2,
      metalness: 0.02
    })
  );
  plastic.position.set(cover.x, cover.layerY, cover.z);
  plastic.rotation.y = cover.angle ?? 0;
  group.add(plastic);
};

const addLaneGuideCover = (group: THREE.Group, cover: LaneGuideCover) => {
  const plastic = mesh(
    new THREE.BoxGeometry(cover.width, 0.05, cover.depth),
    new THREE.MeshStandardMaterial({
      color: cover.color,
      transparent: true,
      opacity: 0.72,
      roughness: 0.24,
      metalness: 0.02
    })
  );
  plastic.position.set(cover.x, cover.layerY, cover.z);
  plastic.rotation.y = cover.angle ?? 0;
  group.add(plastic);

  cover.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.035, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e9ea, roughness: 0.16, metalness: 0.88 })
    );
    screw.position.set(fastener.x, cover.layerY + 0.04, fastener.z);
    group.add(screw);
  });
};

const addTargetBankHardware = (group: THREE.Group, targetBank: TargetBankHardware) => {
  targetBank.frameSegments.forEach((segment) => addTargetBankFrameSegment(group, segment));
  targetBank.posts.forEach((post) => addPost(group, post));
  addDeckLabel(group, targetBank.label, 0, -1.7, 2.5, 0.24, 0);
};

const addTargetBankFrameSegment = (group: THREE.Group, segment: TargetBankFrameSegment) => {
  addSegment(group, segment, 0.48);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.705, fastener.z);
    group.add(screw);
  });
};

const addTargetMountHardware = (group: THREE.Group, target: TargetDevice) => {
  addSegment(group, target.mountPlate, 0.2);
  target.mountFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.035, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.16, metalness: 0.86 })
    );
    screw.position.set(fastener.x, 0.28, fastener.z);
    group.add(screw);
  });
};

const addSaucerWallSegment = (group: THREE.Group, segment: SaucerWallSegment) => {
  addSegment(group, segment, segment.kind === "wire" ? 0.5 : 0.32);
  segment.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.022, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, segment.kind === "wire" ? 0.655 : 0.485, fastener.z);
    group.add(screw);
  });
};

const addSaucerEjectCoil = (group: THREE.Group, coil: SaucerEjectCoil) => {
  const coilBody = mesh(
    new THREE.CylinderGeometry(coil.coilRadius, coil.coilRadius, coil.coilDepth, 24),
    new THREE.MeshStandardMaterial({ color: 0x3a3030, roughness: 0.28, metalness: 0.55 })
  );
  coilBody.rotation.x = Math.PI / 2;
  coilBody.rotation.z = coil.angle;
  coilBody.position.set(coil.x, 0.4, coil.z);
  group.add(coilBody);

  const rod = mesh(
    new THREE.CylinderGeometry(coil.rodRadius, coil.rodRadius, coil.rodLength, 18),
    new THREE.MeshStandardMaterial({ color: 0xd6dee0, roughness: 0.16, metalness: 0.9 })
  );
  rod.rotation.x = Math.PI / 2;
  rod.rotation.z = coil.angle;
  rod.position.set(
    coil.x + Math.sin(coil.angle) * (coil.rodLength * 0.22),
    0.4,
    coil.z + Math.cos(coil.angle) * (coil.rodLength * 0.22)
  );
  group.add(rod);

  const bracket = mesh(
    new THREE.BoxGeometry(coil.bracket.width, 0.04, coil.bracket.depth),
    new THREE.MeshStandardMaterial({ color: 0xaeb8ba, roughness: 0.2, metalness: 0.86 })
  );
  bracket.rotation.y = coil.bracket.angle ?? 0;
  bracket.position.set(coil.bracket.x, 0.44, coil.bracket.z);
  group.add(bracket);

  coil.bracketFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.475, fastener.z);
    group.add(screw);
  });
};

const addArcadeHallContext = (scene: THREE.Scene, hall: ArcadeHallContext) => {
  const floor = mesh(
    new THREE.BoxGeometry(hall.floor.width, 0.08, hall.floor.depth),
    new THREE.MeshStandardMaterial({ color: hall.floor.color, roughness: 0.72 })
  );
  floor.position.set(hall.floor.x, hall.floor.y, hall.floor.z);
  floor.receiveShadow = true;
  scene.add(floor);

  hall.backWall.forEach((panel) => {
    const panelMesh = mesh(
      new THREE.BoxGeometry(panel.width, panel.height, panel.depth),
      new THREE.MeshStandardMaterial({
        color: panel.color,
        emissive: panel.emissive ?? 0x000000,
        emissiveIntensity: panel.emissive ? 0.32 : 0,
        roughness: 0.55
      })
    );
    panelMesh.position.set(panel.x, panel.y, panel.z);
    scene.add(panelMesh);
  });

  hall.sideMachines.forEach((machine) => {
    const cabinet = mesh(
      new THREE.BoxGeometry(machine.width, machine.height, machine.depth),
      new THREE.MeshStandardMaterial({ color: machine.cabinetColor, roughness: 0.42 })
    );
    cabinet.position.set(machine.x, machine.y, machine.z);
    cabinet.rotation.y = machine.angle;
    scene.add(cabinet);

    const screen = mesh(
      new THREE.BoxGeometry(machine.width * 0.7, machine.height * 0.24, 0.055),
      new THREE.MeshStandardMaterial({
        color: machine.screenColor,
        emissive: machine.screenColor,
        emissiveIntensity: 0.28,
        roughness: 0.18
      })
    );
    screen.position.set(
      machine.x - Math.sin(machine.angle) * (machine.depth / 2 + 0.035),
      machine.y + machine.height * 0.16,
      machine.z + Math.cos(machine.angle) * (machine.depth / 2 + 0.035)
    );
    screen.rotation.y = machine.angle;
    scene.add(screen);
  });

  hall.overheadLights.forEach((fixture) => {
    const shade = mesh(
      new THREE.CylinderGeometry(fixture.radius, fixture.radius * 1.15, 0.14, 24),
      new THREE.MeshStandardMaterial({
        color: fixture.color,
        emissive: fixture.color,
        emissiveIntensity: 0.32,
        roughness: 0.22
      })
    );
    shade.position.set(fixture.x, fixture.y, fixture.z);
    scene.add(shade);

    const light = new THREE.PointLight(fixture.color, fixture.intensity, 10);
    light.position.set(fixture.x, fixture.y - 0.28, fixture.z);
    scene.add(light);
  });
};

const addCabinetShell = (scene: THREE.Scene, cabinet: CabinetHardware) => {
  const body = mesh(
    new THREE.BoxGeometry(cabinet.body.width, cabinet.body.height, cabinet.body.depth),
    new THREE.MeshStandardMaterial({ color: cabinet.body.color, roughness: 0.48 })
  );
  body.position.set(cabinet.body.x, cabinet.body.y, cabinet.body.z);
  body.receiveShadow = true;
  scene.add(body);

  cabinet.sideArtPanels.forEach((panel) => addCabinetSideArtPanel(scene, panel));
  cabinet.controlButtons.forEach((button) => addCabinetControlButton(scene, button));

  cabinet.legs.forEach((leg) => {
    const legMesh = mesh(
      new THREE.BoxGeometry(leg.width, leg.height, leg.depth),
      new THREE.MeshStandardMaterial({ color: leg.color, roughness: 0.2, metalness: 0.78 })
    );
    legMesh.position.set(leg.x, leg.y, leg.z);
    legMesh.rotation.x = leg.tiltX;
    legMesh.rotation.z = leg.tiltZ;
    scene.add(legMesh);

    const leveler = mesh(
      new THREE.CylinderGeometry(leg.leveler.radius, leg.leveler.radius, leg.leveler.height, 24),
      new THREE.MeshStandardMaterial({ color: 0xc5ccd0, roughness: 0.16, metalness: 0.86 })
    );
    leveler.position.set(leg.leveler.x, leg.leveler.y, leg.leveler.z);
    scene.add(leveler);
  });

  const backbox = mesh(
    new THREE.BoxGeometry(cabinet.backbox.width, cabinet.backbox.height, cabinet.backbox.depth),
    new THREE.MeshStandardMaterial({ color: cabinet.backbox.color, roughness: 0.38 })
  );
  backbox.position.set(cabinet.backbox.x, cabinet.backbox.y, cabinet.backbox.z);
  scene.add(backbox);

  const dmd = mesh(
    new THREE.BoxGeometry(cabinet.dmdPanel.width, cabinet.dmdPanel.height, cabinet.dmdPanel.depth),
    new THREE.MeshStandardMaterial({
      color: cabinet.dmdPanel.color,
      emissive: cabinet.dmdPanel.emissive,
      roughness: 0.2
    })
  );
  dmd.position.set(cabinet.dmdPanel.x, cabinet.dmdPanel.y, cabinet.dmdPanel.z);
  scene.add(dmd);
  addCabinetHeaderPanel(scene, cabinet.headerPanel);
  cabinet.topperLights.forEach((light) => addCabinetTopperLight(scene, light));

  cabinet.speakerGrilles.forEach((grille) => {
    const panel = mesh(
      new THREE.BoxGeometry(grille.width, grille.height, grille.depth),
      new THREE.MeshStandardMaterial({ color: grille.color, roughness: 0.34 })
    );
    panel.position.set(grille.x, grille.y, grille.z);
    scene.add(panel);

    const slotCount = Math.max(grille.holeCount, 1);
    for (let index = 0; index < slotCount; index += 1) {
      const xOffset = ((index + 0.5) / slotCount - 0.5) * grille.width * 0.78;
      const slot = mesh(
        new THREE.BoxGeometry(grille.width / (slotCount * 2.8), grille.height * 0.72, grille.depth + 0.012),
        new THREE.MeshStandardMaterial({ color: 0x22282a, roughness: 0.22, metalness: 0.2 })
      );
      slot.position.set(grille.x + xOffset, grille.y, grille.z + grille.depth * 0.62);
      scene.add(slot);
    }
    grille.fasteners.forEach((fastener) => {
      const screw = mesh(
        new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
        new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
      );
      screw.rotation.x = Math.PI / 2;
      screw.position.set(fastener.x, fastener.y, fastener.z);
      scene.add(screw);
    });
  });
};

const addCabinetControlButton = (scene: THREE.Scene, button: CabinetControlButton) => {
  const normal =
    button.side === "left"
      ? new THREE.Vector3(-1, 0, 0)
      : button.side === "right"
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 0, 1);
  const base = new THREE.Vector3(button.x, button.y, button.z);
  const capPosition = base.clone().addScaledVector(normal, button.bezelDepth * 0.58);

  const orientFaceCylinder = (object: THREE.Object3D) => {
    if (button.side === "front") {
      object.rotation.x = Math.PI / 2;
      return;
    }
    object.rotation.z = Math.PI / 2;
  };

  const bezel = mesh(
    new THREE.CylinderGeometry(button.bezelRadius, button.bezelRadius, button.bezelDepth, 32),
    new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.16, metalness: 0.86 })
  );
  orientFaceCylinder(bezel);
  bezel.position.copy(base);
  scene.add(bezel);

  const cap = mesh(
    new THREE.CylinderGeometry(button.radius, button.radius, button.depth, 32),
    new THREE.MeshStandardMaterial({
      color: button.color,
      emissive: button.emissive,
      emissiveIntensity: 0.35,
      roughness: 0.24
    })
  );
  orientFaceCylinder(cap);
  cap.position.copy(capPosition);
  scene.add(cap);
};

const addCabinetSideArtPanel = (scene: THREE.Scene, panel: CabinetSideArtPanel) => {
  const sidePanel = mesh(
    new THREE.BoxGeometry(panel.width, panel.height, panel.depth),
    new THREE.MeshStandardMaterial({
      color: panel.color,
      emissive: panel.emissive,
      emissiveIntensity: 0.22,
      roughness: 0.34
    })
  );
  sidePanel.position.set(panel.x, panel.y, panel.z);
  scene.add(sidePanel);

  panel.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(fastener.x, fastener.y, fastener.z);
    scene.add(screw);
  });

  addCabinetSideArtLabel(
    scene,
    panel.label,
    panel.x + (panel.side === "left" ? -panel.width : panel.width),
    panel.y,
    panel.z,
    panel.depth * 0.64,
    panel.height * 0.42,
    panel.side === "left" ? -Math.PI / 2 : Math.PI / 2
  );
};

const addCabinetHeaderPanel = (scene: THREE.Scene, panel: CabinetHeaderPanel) => {
  const header = mesh(
    new THREE.BoxGeometry(panel.width, panel.height, panel.depth),
    new THREE.MeshStandardMaterial({
      color: panel.color,
      emissive: panel.emissive,
      emissiveIntensity: 0.38,
      roughness: 0.26
    })
  );
  header.position.set(panel.x, panel.y, panel.z);
  scene.add(header);

  panel.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(fastener.x, fastener.y, fastener.z);
    scene.add(screw);
  });

  addBackboxLabel(scene, panel.label, panel.x, panel.y, panel.z + panel.depth * 0.66, panel.width * 0.64, panel.height * 0.34);
};

const addCabinetTopperLight = (scene: THREE.Scene, light: CabinetTopperLight) => {
  const lamp = mesh(
    new THREE.CylinderGeometry(light.radius, light.radius * 0.92, light.height, 24),
    new THREE.MeshStandardMaterial({
      color: light.color,
      emissive: light.emissive,
      emissiveIntensity: 0.7,
      roughness: 0.18,
      metalness: 0.05
    })
  );
  lamp.position.set(light.x, light.y, light.z);
  lamp.rotation.x = Math.PI / 2;
  scene.add(lamp);
};

const addCabinetHardware = (group: THREE.Group, cabinet: CabinetHardware) => {
  cabinet.sideRails.forEach((segment) => addRail(
    group,
    segment.x,
    segment.z,
    segment.width,
    segment.depth,
    segment.angle ?? 0,
    0x6f7677,
    0.58,
    0,
    0.3
  ));
  cabinet.glassRims.forEach((segment) => {
    const rim = mesh(
      new THREE.BoxGeometry(segment.width, 0.035, segment.depth),
      new THREE.MeshStandardMaterial({
        color: 0x9fd0ff,
        transparent: true,
        opacity: 0.32,
        roughness: 0.08,
        metalness: 0.1
      })
    );
    rim.position.set(segment.x, 0.84, segment.z);
    rim.rotation.y = segment.angle ?? 0;
    group.add(rim);
  });
  const glassPanel = mesh(
    new THREE.BoxGeometry(cabinet.glassPanel.width, cabinet.glassPanel.thickness, cabinet.glassPanel.depth),
    new THREE.MeshStandardMaterial({
      color: cabinet.glassPanel.color,
      transparent: true,
      opacity: cabinet.glassPanel.opacity,
      roughness: 0.02,
      metalness: 0,
      depthWrite: false
    })
  );
  glassPanel.position.set(cabinet.glassPanel.x, cabinet.glassPanel.y, cabinet.glassPanel.z);
  group.add(glassPanel);
  addRail(
    group,
    cabinet.lockdownBar.x,
    cabinet.lockdownBar.z,
    cabinet.lockdownBar.width,
    cabinet.lockdownBar.depth,
    cabinet.lockdownBar.angle ?? 0,
    0xb7c4c7,
    0.54,
    0,
    0.2
  );
  cabinet.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.028, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, fastener.y, fastener.z);
    group.add(screw);
  });
};

const addBackboxLabel = (
  scene: THREE.Scene,
  label: string,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.fillStyle = "#1b0d0a";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffe6ac";
  context.font = "bold 44px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const labelMesh = mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map: texture,
      emissive: 0x5f2c12,
      emissiveIntensity: 0.22,
      roughness: 0.3,
      side: THREE.DoubleSide
    })
  );
  labelMesh.position.set(x, y, z);
  scene.add(labelMesh);
};

const addCabinetSideArtLabel = (
  scene: THREE.Scene,
  label: string,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  rotationY: number
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.fillStyle = "#2a100c";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffe6ac";
  context.font = "bold 44px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const labelMesh = mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map: texture,
      emissive: 0x5f2c12,
      emissiveIntensity: 0.2,
      roughness: 0.3,
      side: THREE.DoubleSide
    })
  );
  labelMesh.position.set(x, y, z);
  labelMesh.rotation.y = rotationY;
  scene.add(labelMesh);
};

const addDeckLabel = (
  group: THREE.Group,
  label: string,
  x: number,
  z: number,
  width: number,
  depth: number,
  angle: number,
  y = 0.07
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.fillStyle = "#111111";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f9e7a8";
  context.font = "bold 34px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const labelMesh = mesh(
    new THREE.BoxGeometry(width, 0.025, depth),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.45 })
  );
  labelMesh.position.set(x, y, z);
  labelMesh.rotation.y = angle;
  group.add(labelMesh);
};

const addTargetDecal = (
  group: THREE.Group,
  label: string,
  x: number,
  z: number,
  angle: number,
  color: number
) => {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.fillStyle = "#1b1b1b";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  context.font = "bold 62px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const decal = mesh(
    new THREE.PlaneGeometry(0.28, 0.34),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.42 })
  );
  decal.position.set(x, 0.42, z);
  decal.rotation.y = angle;
  group.add(decal);
};

const addPlungerHardware = (group: THREE.Group, plunger: PlungerDevice) => {
  const groove = mesh(
    new THREE.BoxGeometry(plunger.laneGroove.width, 0.08, plunger.laneGroove.depth),
    new THREE.MeshStandardMaterial({ color: 0x141b1b, roughness: 0.7 })
  );
  groove.position.set(plunger.laneGroove.x, 0.06, plunger.laneGroove.z);
  group.add(groove);

  plunger.lowerGuides.forEach((segment) => addSegment(group, segment, 0.3));
  plunger.guideFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 18),
      new THREE.MeshStandardMaterial({ color: 0xc8d3d5, roughness: 0.18, metalness: 0.85 })
    );
    screw.position.set(fastener.x, 0.335, fastener.z);
    group.add(screw);
  });
  addSegment(group, plunger.housing, 0.34);
  plunger.housingFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 18),
      new THREE.MeshStandardMaterial({ color: 0xc8d3d5, roughness: 0.18, metalness: 0.85 })
    );
    screw.position.set(fastener.x, 0.375, fastener.z);
    group.add(screw);
  });

  const rod = mesh(
    new THREE.CylinderGeometry(0.045, 0.045, plunger.rodLength, 20),
    new THREE.MeshStandardMaterial({ color: 0xd4dee0, roughness: 0.18, metalness: 0.88 })
  );
  rod.rotation.x = Math.PI / 2;
  rod.position.set(plunger.rodX, 0.28, plunger.rodZ);
  group.add(rod);

  const spring = mesh(
    new THREE.TorusGeometry(plunger.spring.radius, plunger.spring.tubeRadius, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.2, metalness: 0.8 })
  );
  spring.position.set(plunger.spring.x, 0.28, plunger.spring.z);
  spring.rotation.x = Math.PI / 2;
  group.add(spring);

  plunger.springRetainers.forEach((retainer) => {
    const washer = mesh(
      new THREE.CylinderGeometry(retainer.radius, retainer.radius, retainer.depth, 24),
      new THREE.MeshStandardMaterial({ color: 0xc8d3d5, roughness: 0.16, metalness: 0.88 })
    );
    washer.rotation.x = Math.PI / 2;
    washer.position.set(retainer.x, 0.28, retainer.z);
    group.add(washer);
  });

  const collar = mesh(
    new THREE.CylinderGeometry(plunger.stopCollar.radius, plunger.stopCollar.radius, plunger.stopCollar.depth, 24),
    new THREE.MeshStandardMaterial({ color: 0xaebabc, roughness: 0.18, metalness: 0.9 })
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.set(plunger.stopCollar.x, 0.28, plunger.stopCollar.z);
  group.add(collar);

  const knob = mesh(
    new THREE.CylinderGeometry(plunger.knob.radius, plunger.knob.radius, plunger.knob.depth, 24),
    new THREE.MeshStandardMaterial({ color: 0x121416, roughness: 0.34, metalness: 0.08 })
  );
  knob.rotation.x = Math.PI / 2;
  knob.position.set(plunger.knob.x, 0.28, plunger.knob.z);
  group.add(knob);

  addSegment(group, plunger.gate, 0.42);
  addPost(group, plunger.gateHingePost);
  addPost(group, plunger.gateStopPost);
};

const createFlipper = (flipperDevice: FlipperDevice, color: number) => {
  const flipper = new THREE.Group();
  const sleeveCapsuleLength = Math.max(flipperDevice.rubberSleeve.length - flipperDevice.rubberSleeve.radius * 2, 0.1);
  const rubber = mesh(
    new THREE.CapsuleGeometry(flipperDevice.rubberSleeve.radius, sleeveCapsuleLength, 8, 18),
    new THREE.MeshStandardMaterial({
      color: flipperDevice.rubberSleeve.color,
      roughness: 0.44,
      metalness: 0
    })
  );
  rubber.rotation.z = Math.PI / 2;
  rubber.position.x = flipperDevice.rubberSleeve.localX;
  flipper.add(rubber);

  const coreRadius = Math.max(
    flipperDevice.batRadius - flipperDevice.rubberSleeve.thickness * 0.28,
    flipperDevice.batRadius * 0.72
  );
  const capsuleLength = Math.max(flipperDevice.length - coreRadius * 2, 0.1);
  const body = mesh(
    new THREE.CapsuleGeometry(coreRadius, capsuleLength, 8, 18),
    new THREE.MeshStandardMaterial({ color, roughness: 0.28 })
  );
  body.rotation.z = Math.PI / 2;
  body.position.x = flipperDevice.length / 2;
  flipper.add(body);
  const post = mesh(
    new THREE.CylinderGeometry(flipperDevice.pivotRadius, flipperDevice.pivotRadius, 0.26, 24),
    new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.22, metalness: 0.75 })
  );
  flipper.add(post);
  const pivotCap = mesh(
    new THREE.CylinderGeometry(flipperDevice.pivotCap.radius, flipperDevice.pivotCap.radius, flipperDevice.pivotCap.height, 28),
    new THREE.MeshStandardMaterial({ color: 0xd5dddf, roughness: 0.14, metalness: 0.86 })
  );
  pivotCap.position.y = 0.16;
  flipper.add(pivotCap);
  flipperDevice.batFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.localX, 0.18, fastener.localZ);
    flipper.add(screw);
  });
  return flipper;
};

const addDrainAndTrough = (group: THREE.Group, drain: DrainDevice) => {
  const drainMouth = drain.drainGuides.find((segment) => segment.id === "drain.center-mouth");
  const drainPlateWidth = drainMouth?.width ?? drain.radius * 1.75;
  if (!drainMouth) {
    console.warn("Missing drain.center-mouth in table blueprint.");
  }
  const apron = mesh(
    new THREE.BoxGeometry(drain.apron.width, 0.08, drain.apron.depth),
    new THREE.MeshStandardMaterial({ color: 0x3b2219, roughness: 0.42 })
  );
  apron.position.set(drain.apron.x, 0.04, drain.apron.z);
  group.add(apron);

  const drainPlate = mesh(
    new THREE.BoxGeometry(drainPlateWidth, 0.08, 0.52),
    new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.2 })
  );
  drainPlate.position.set(drain.x, 0.08, drain.z);
  group.add(drainPlate);

  const trough = mesh(
    new THREE.BoxGeometry(drain.trough.width, 0.12, drain.trough.depth),
    new THREE.MeshStandardMaterial({ color: 0x1b1c1b, roughness: 0.35, metalness: 0.45 })
  );
  trough.position.set(drain.trough.x, 0.12, drain.trough.z);
  group.add(trough);

  drain.drainGuides.forEach((guide) => addDrainGuide(group, guide));
  drain.trough.walls.forEach((segment) => addSegment(group, segment, 0.28));
  addSegment(group, drain.trough.feedGuide, 0.3);
  drain.trough.fasteners.forEach((fastener) => addTroughFastener(group, fastener));
  drain.apronCards.forEach((card) => addApronCard(group, card));
  drain.apronFasteners.forEach((fastener) => addApronFastener(group, fastener));
  drain.apronLamps.forEach((lamp) => addLampInsert(group, lamp, 0.14));
  drain.trough.ballSlots.forEach((slot) => {
    const slotMesh = mesh(
      new THREE.CylinderGeometry(slot.radius, slot.radius, 0.035, 24),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.28, metalness: 0.35 })
    );
    slotMesh.position.set(slot.x, 0.2, slot.z);
    group.add(slotMesh);
  });
  drain.trough.slotRims.forEach((rim) => {
    const ringMesh = mesh(
      new THREE.TorusGeometry(
        (rim.innerRadius + rim.outerRadius) / 2,
        (rim.outerRadius - rim.innerRadius) / 2,
        10,
        32
      ),
      new THREE.MeshStandardMaterial({ color: 0xc8ccd0, roughness: 0.18, metalness: 0.85 })
    );
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(rim.x, 0.225 + rim.height / 2, rim.z);
    group.add(ringMesh);
  });
  drain.trough.optoPairs.forEach((opto) => addTroughOptoPair(group, opto));
  addTroughEjectCoil(group, drain.trough.ejectCoil);
  addDeckLabel(group, "SILVERBALL SOCIAL", drain.apron.x, drain.apron.z - 0.05, 3.4, 0.28, 0);
};

const addTroughOptoPair = (group: THREE.Group, opto: TroughOptoPair) => {
  [opto.emitter, opto.receiver].forEach((eye) => {
    const eyeMesh = mesh(
      new THREE.CylinderGeometry(eye.radius, eye.radius, eye.height, 16),
      new THREE.MeshStandardMaterial({
        color: eye.color,
        emissive: eye.color,
        emissiveIntensity: eye.kind === "opto-emitter" ? 0.22 : 0.12,
        roughness: 0.2,
        metalness: 0.35
      })
    );
    eyeMesh.position.set(eye.x, 0.32, eye.z);
    group.add(eyeMesh);
  });

  const beam = mesh(
    new THREE.BoxGeometry(opto.beam.width, 0.012, opto.beam.depth),
    new THREE.MeshStandardMaterial({
      color: opto.beam.color,
      emissive: opto.beam.color,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0.34,
      roughness: 0.3
    })
  );
  beam.position.set(opto.beam.x, 0.315, opto.beam.z);
  group.add(beam);
};

const addTroughEjectCoil = (group: THREE.Group, coil: TroughEjectCoil) => {
  const coilBody = mesh(
    new THREE.CylinderGeometry(coil.coilRadius, coil.coilRadius, coil.coilDepth, 24),
    new THREE.MeshStandardMaterial({ color: 0x3a3030, roughness: 0.28, metalness: 0.55 })
  );
  coilBody.rotation.x = Math.PI / 2;
  coilBody.rotation.z = coil.angle;
  coilBody.position.set(coil.x, 0.35, coil.z);
  group.add(coilBody);

  const rod = mesh(
    new THREE.CylinderGeometry(coil.rodRadius, coil.rodRadius, coil.rodLength, 18),
    new THREE.MeshStandardMaterial({ color: 0xd6dee0, roughness: 0.16, metalness: 0.9 })
  );
  rod.rotation.x = Math.PI / 2;
  rod.rotation.z = coil.angle;
  rod.position.set(
    coil.x + Math.sin(coil.angle) * (coil.rodLength * 0.24),
    0.35,
    coil.z + Math.cos(coil.angle) * (coil.rodLength * 0.24)
  );
  group.add(rod);

  const bracket = mesh(
    new THREE.BoxGeometry(coil.bracket.width, 0.04, coil.bracket.depth),
    new THREE.MeshStandardMaterial({ color: 0xaeb8ba, roughness: 0.2, metalness: 0.86 })
  );
  bracket.rotation.y = coil.bracket.angle ?? 0;
  bracket.position.set(coil.bracket.x, 0.42, coil.bracket.z);
  group.add(bracket);

  coil.bracketFasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.455, fastener.z);
    group.add(screw);
  });
};

const addDrainGuide = (group: THREE.Group, guide: DrainGuide) => {
  addSegment(group, guide, 0.28);
  guide.fasteners.forEach((fastener) => {
    const screw = mesh(
      new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
    );
    screw.position.set(fastener.x, 0.43, fastener.z);
    group.add(screw);
  });
};

const addTroughFastener = (group: THREE.Group, fastener: TroughFastener) => {
  const screw = mesh(
    new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.024, 16),
    new THREE.MeshStandardMaterial({ color: 0xd8e0e2, roughness: 0.14, metalness: 0.88 })
  );
  screw.position.set(fastener.x, 0.43, fastener.z);
  group.add(screw);
};

const addApronCard = (group: THREE.Group, card: ApronCard) => {
  const cardMesh = mesh(
    new THREE.BoxGeometry(card.width, 0.028, card.depth),
    new THREE.MeshStandardMaterial({ color: card.color, roughness: 0.32, metalness: 0.02 })
  );
  cardMesh.position.set(card.x, 0.105, card.z);
  cardMesh.rotation.y = card.angle ?? 0;
  group.add(cardMesh);
  addDeckLabel(group, card.label, card.x, card.z, card.width * 0.8, card.depth * 0.5, card.angle ?? 0, 0.145);
  addApronCardProtector(group, card.protector);
};

const addApronCardProtector = (group: THREE.Group, protector: ApronCardProtector) => {
  const plate = mesh(
    new THREE.BoxGeometry(protector.width, protector.thickness, protector.depth),
    new THREE.MeshStandardMaterial({
      color: 0xccecff,
      transparent: true,
      opacity: 0.32,
      roughness: 0.08,
      metalness: 0.02
    })
  );
  plate.position.set(protector.x, 0.18, protector.z);
  plate.rotation.y = protector.angle ?? 0;
  group.add(plate);
};

const addApronFastener = (group: THREE.Group, fastener: ApronFastener) => {
  const screw = mesh(
    new THREE.CylinderGeometry(fastener.radius, fastener.radius, 0.025, 18),
    new THREE.MeshStandardMaterial({ color: 0xc8d3d5, roughness: 0.18, metalness: 0.85 })
  );
  screw.position.set(fastener.x, 0.135, fastener.z);
  group.add(screw);
};
