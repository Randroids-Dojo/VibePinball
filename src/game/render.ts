import * as THREE from "three";
import type { PhysicsSnapshot } from "./physics";
import {
  rampSidePoint,
  silverballSocialBlueprint,
  type DrainDevice,
  type LampInsert,
  type FlipperDevice,
  type RampPath,
  type SlingDevice,
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
  group.rotation.x = -0.08;
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xf8e7c2, 1.15);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.7);
  key.position.set(-4, 10, 6);
  key.castShadow = true;
  scene.add(key);

  const warmLamp = new THREE.PointLight(0xf1c453, 4.4, 22);
  warmLamp.position.set(0, 3.2, -3.2);
  scene.add(warmLamp);

  const playfield = mesh(
    new THREE.BoxGeometry(blueprint.scale.playfieldWidth + 0.1, 0.18, blueprint.scale.playfieldLength - 1.6),
    new THREE.MeshStandardMaterial({ color: 0x8d3f2f, roughness: 0.38, metalness: 0.05 })
  );
  playfield.position.y = -0.13;
  playfield.receiveShadow = true;
  group.add(playfield);

  const art = mesh(
    new THREE.BoxGeometry(7.42, 0.035, 14.55),
    new THREE.MeshStandardMaterial({ color: 0x2b6b5e, roughness: 0.42, metalness: 0.02 })
  );
  art.position.y = 0;
  group.add(art);

  blueprint.boundaries.forEach((segment) => addSegment(group, segment, 0.28));
  blueprint.laneWalls.forEach((segment) => addSegment(group, segment, 0.36));
  blueprint.rolloverWires.forEach((segment) => addSegment(group, segment, 0.18));
  blueprint.flipperStops.forEach((segment) => addSegment(group, segment, 0.32));
  blueprint.posts.forEach((post) => addPost(group, post.x, post.z, post.radius, post.kind));
  blueprint.lanes.forEach((lane) => addInsert(group, lane.x, lane.z, lane.side === "top" ? 0x5fd4ff : 0xf1c453));
  blueprint.lampInserts.forEach((insert) => addLampInsert(group, insert));
  blueprint.orbits.forEach((orbit) => {
    addInsert(group, orbit.entry.x, orbit.entry.z, 0x76ff8f);
    addInsert(group, orbit.exit.x, orbit.exit.z, 0x5fd4ff);
  });
  addDrainAndTrough(group, blueprint.drain);
  blueprint.plastics.forEach((cover) => addPlasticCover(group, cover));
  addPlungerHardware(group);

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

  const bumperMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c453,
    emissive: 0x5c3c05,
    roughness: 0.25
  });
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
    const skirt = mesh(
      new THREE.CylinderGeometry(device.skirtRadius, device.skirtRadius, 0.08, 32),
      bumperMaterial
    );
    skirt.position.set(device.x, 0.12, device.z);
    group.add(skirt);
    addRing(group, device.x, device.z, device.radius, 0xb7c4c7);
  });

  const targetMaterial = new THREE.MeshStandardMaterial({
    color: 0xd94b4b,
    emissive: 0x3a0707,
    roughness: 0.35
  });
  blueprint.targets.forEach((device) => {
    const target = mesh(new THREE.BoxGeometry(0.36, 0.72, 0.14), targetMaterial);
    target.position.set(device.x, 0.38, device.z);
    target.rotation.y = device.angle;
    group.add(target);
    addSegment(group, device.rearStop, 0.28);
    addTargetDecal(group, device.label, device.x, device.z + 0.075, device.angle, device.decalColor);
    addDeckLabel(group, device.label, device.x, device.z - 0.05, 0.34, 0.28, device.angle);
    addInsert(group, device.x, device.z + 0.42, 0xffd56f);
  });

  blueprint.saucers.forEach((saucer) => {
    const cup = mesh(
      new THREE.CylinderGeometry(0.5, 0.62, 0.16, 32),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.25, metalness: 0.65 })
    );
    cup.position.set(saucer.x, 0.18, saucer.z);
    group.add(cup);
    saucer.walls.forEach((segment) => addSegment(group, segment, segment.kind === "wire" ? 0.5 : 0.32));
    saucer.posts.forEach((post) => addPost(group, post.x, post.z, post.radius, post.kind));
    const heldBall = mesh(
      new THREE.SphereGeometry(blueprint.scale.ballRadius * 0.72, 24, 14),
      new THREE.MeshStandardMaterial({ color: 0xbec7ca, roughness: 0.18, metalness: 0.82 })
    );
    heldBall.position.set(saucer.holdX, 0.35, saucer.holdZ);
    heldBall.visible = false;
    group.add(heldBall);
    saucerHoldMarkers.set(saucer.id, heldBall);
    addInsert(group, saucer.x, saucer.z + 0.64, 0xff4b4b);
  });

  blueprint.ramps.forEach((rampDevice) => {
    addRampDevice(group, rampDevice);
  });

  blueprint.handoffs.forEach((handoff) => {
    handoff.segments.forEach((segment) => addSegment(group, segment, segment.kind === "metal" ? 0.5 : 0.78));
  });

  blueprint.wireforms.forEach((wireform) => addWireformPath(group, wireform));

  blueprint.slings.forEach((sling) => {
    addSlingTriangle(group, sling);
    addSegment(group, sling.rubberFace, 0.46);
    addLampInsert(group, sling.lamp);
  });

  const shooter = mesh(
    new THREE.BoxGeometry(0.7, 0.08, 4.1),
    new THREE.MeshStandardMaterial({ color: 0x141b1b, roughness: 0.7 })
  );
  shooter.position.set(3.18, 0.06, 5.3);
  group.add(shooter);

  const cabinet = mesh(
    new THREE.BoxGeometry(9.8, 1.3, 17.2),
    new THREE.MeshStandardMaterial({ color: 0x24140f, roughness: 0.48 })
  );
  cabinet.position.set(0, -0.92, 0.25);
  cabinet.receiveShadow = true;
  scene.add(cabinet);

  const backbox = mesh(
    new THREE.BoxGeometry(8.8, 3.2, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x161b1b, roughness: 0.38 })
  );
  backbox.position.set(0, 1.4, -8.9);
  scene.add(backbox);

  const dmd = mesh(
    new THREE.BoxGeometry(5.4, 0.9, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xf1c453, emissive: 0x6f3f06, roughness: 0.2 })
  );
  dmd.position.set(0, 1.55, -8.5);
  scene.add(dmd);

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

  const sideRailY = centerY + ramp.floorThickness / 2 + ramp.sideRailHeight / 2;
  const leftRail = rampSidePoint(ramp, -ramp.sideRailOffset);
  const rightRail = rampSidePoint(ramp, ramp.sideRailOffset);
  addRail(group, leftRail.x, leftRail.z, 0.07, slopedDepth, ramp.angle, 0x9fd0ff, sideRailY, pitch, ramp.sideRailHeight);
  addRail(group, rightRail.x, rightRail.z, 0.07, slopedDepth, ramp.angle, 0x9fd0ff, sideRailY, pitch, ramp.sideRailHeight);
  addSegment(group, ramp.entranceLip, ramp.startY + 0.12);

  ramp.supports.forEach((support) => {
    const supportMesh = mesh(
      new THREE.CylinderGeometry(support.radius, support.radius, support.height, 16),
      new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.18, metalness: 0.82 })
    );
    supportMesh.position.set(support.x, support.height / 2, support.z);
    group.add(supportMesh);
  });
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

const addPost = (
  group: THREE.Group,
  x: number,
  z: number,
  radius: number,
  kind: "rubber" | "metal"
) => {
  const post = mesh(
    new THREE.CylinderGeometry(radius, radius, 0.42, 20),
    new THREE.MeshStandardMaterial({
      color: kind === "rubber" ? 0x111111 : 0xb7c4c7,
      roughness: 0.24,
      metalness: kind === "metal" ? 0.75 : 0.05
    })
  );
  post.position.set(x, 0.32, z);
  group.add(post);
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

const addInsert = (group: THREE.Group, x: number, z: number, color: number) => {
  const insert = mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.035, 24),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.28, roughness: 0.38 })
  );
  insert.position.set(x, 0.045, z);
  group.add(insert);
};

const addLampInsert = (group: THREE.Group, insert: LampInsert) => {
  if (insert.shape === "circle") {
    addInsert(group, insert.x, insert.z, insert.color);
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
    bar.position.set(insert.x, 0.045, insert.z);
    group.add(bar);
    addDeckLabel(group, insert.label, insert.x, insert.z, insert.radius * 2.5, insert.radius, 0);
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
  arrow.position.set(insert.x, 0.055, insert.z);
  arrow.rotation.y = Math.PI;
  group.add(arrow);
};

const addRing = (group: THREE.Group, x: number, z: number, radius: number, color: number) => {
  const ring = mesh(
    new THREE.TorusGeometry(radius, 0.035, 8, 32),
    new THREE.MeshStandardMaterial({ color, roughness: 0.22, metalness: 0.78 })
  );
  ring.position.set(x, 0.48, z);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
};

const addWireformPath = (group: THREE.Group, wireform: WireformPath) => {
  wireform.segments.forEach((segment) => addWireformPair(group, wireform, segment));
  wireform.supports.forEach((support) => {
    const supportMesh = mesh(
      new THREE.CylinderGeometry(support.radius, support.radius, support.height, 16),
      new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.18, metalness: 0.82 })
    );
    supportMesh.position.set(support.x, support.height / 2, support.z);
    group.add(supportMesh);
  });
  addInsert(group, wireform.exit.x, wireform.exit.z, 0x76ff8f);
};

const addWireformPair = (
  group: THREE.Group,
  wireform: WireformPath,
  segment: { x: number; z: number; depth: number; angle?: number }
) => {
  addRail(
    group,
    segment.x - wireform.railOffset,
    segment.z,
    0.035,
    segment.depth,
    segment.angle ?? 0,
    0xf4d35e,
    wireform.railY,
    0,
    wireform.railHeight
  );
  addRail(
    group,
    segment.x + wireform.railOffset,
    segment.z,
    0.035,
    segment.depth,
    segment.angle ?? 0,
    0xf4d35e,
    wireform.railY,
    0,
    wireform.railHeight
  );
  const tie = mesh(
    new THREE.BoxGeometry(wireform.tieWidth, 0.035, 0.055),
    new THREE.MeshStandardMaterial({ color: 0xf4d35e, roughness: 0.18, metalness: 0.8 })
  );
  tie.position.set(segment.x, wireform.railY, segment.z);
  tie.rotation.y = segment.angle ?? 0;
  group.add(tie);
};

const addPlasticCover = (
  group: THREE.Group,
  cover: {
    x: number;
    z: number;
    width: number;
    depth: number;
    angle?: number;
    color: number;
    layerY: number;
  }
) => {
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

const addDeckLabel = (
  group: THREE.Group,
  label: string,
  x: number,
  z: number,
  width: number,
  depth: number,
  angle: number
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
  labelMesh.position.set(x, 0.07, z);
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

const addPlungerHardware = (group: THREE.Group) => {
  const plunger = silverballSocialBlueprint.plunger;
  const rod = mesh(
    new THREE.CylinderGeometry(0.045, 0.045, plunger.rodLength, 20),
    new THREE.MeshStandardMaterial({ color: 0xd4dee0, roughness: 0.18, metalness: 0.88 })
  );
  rod.rotation.x = Math.PI / 2;
  rod.position.set(plunger.rodX, 0.28, plunger.rodZ);
  group.add(rod);

  const spring = mesh(
    new THREE.TorusGeometry(0.16, 0.018, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.2, metalness: 0.8 })
  );
  spring.position.set(plunger.rodX, 0.28, plunger.springZ);
  spring.rotation.x = Math.PI / 2;
  group.add(spring);

  addSegment(group, plunger.gate, 0.42);
};

const createFlipper = (flipperDevice: FlipperDevice, color: number) => {
  const flipper = new THREE.Group();
  const capsuleLength = Math.max(flipperDevice.length - flipperDevice.batRadius * 2, 0.1);
  const body = mesh(
    new THREE.CapsuleGeometry(flipperDevice.batRadius, capsuleLength, 8, 18),
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

  drain.drainGuides.forEach((segment) => addSegment(group, segment, 0.28));
  drain.trough.walls.forEach((segment) => addSegment(group, segment, 0.28));
  addSegment(group, drain.trough.feedGuide, 0.3);
  drain.trough.ballSlots.forEach((slot) => {
    const slotMesh = mesh(
      new THREE.CylinderGeometry(slot.radius, slot.radius, 0.035, 24),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.28, metalness: 0.35 })
    );
    slotMesh.position.set(slot.x, 0.2, slot.z);
    group.add(slotMesh);
  });
  addDeckLabel(group, "SILVERBALL SOCIAL", drain.apron.x, drain.apron.z - 0.05, 3.4, 0.28, 0);
};
