import * as THREE from "three";
import type { PhysicsSnapshot } from "./physics";

export interface PinballScene {
  resize: () => void;
  render: (snapshot: PhysicsSnapshot) => void;
  dispose: () => void;
}

export const createPinballScene = (canvas: HTMLCanvasElement): PinballScene => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x14110d, 16, 34);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 12.2, 13.5);
  camera.lookAt(0, 0, -0.55);

  const group = new THREE.Group();
  group.rotation.x = -0.08;
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xf8e7c2, 0.72);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(-4, 10, 6);
  key.castShadow = true;
  scene.add(key);

  const warmLamp = new THREE.PointLight(0xf1c453, 2.6, 18);
  warmLamp.position.set(0, 3.2, -3.2);
  scene.add(warmLamp);

  const playfield = mesh(
    new THREE.BoxGeometry(8.2, 0.18, 15.2),
    new THREE.MeshStandardMaterial({ color: 0x6f2c24, roughness: 0.42, metalness: 0.05 })
  );
  playfield.position.y = -0.13;
  playfield.receiveShadow = true;
  group.add(playfield);

  const art = mesh(
    new THREE.BoxGeometry(7.45, 0.035, 14.4),
    new THREE.MeshStandardMaterial({ color: 0x203f3a, roughness: 0.5 })
  );
  art.position.y = 0;
  group.add(art);

  addRail(group, -4.22, 0, 0.25, 15.8);
  addRail(group, 4.22, 0, 0.25, 15.8);
  addRail(group, 0, -7.62, 8.4, 0.25);
  addRail(group, -2.35, 6.22, 2.25, 0.25, -0.34);
  addRail(group, 2.35, 6.22, 2.25, 0.25, 0.34);
  addRail(group, 2.72, 4.55, 0.15, 4.9);
  addRail(group, 3.36, 2.55, 0.18, 2.7, -0.42);
  addRail(group, 3.18, 6.45, 1.24, 0.22, -0.22);

  const leftFlipper = createFlipper(0xd9d3c4);
  leftFlipper.position.set(-1.35, 0.25, 4.72);
  leftFlipper.rotation.y = -0.22;
  group.add(leftFlipper);

  const rightFlipper = createFlipper(0xd9d3c4);
  rightFlipper.position.set(1.35, 0.25, 4.72);
  rightFlipper.rotation.y = Math.PI + 0.22;
  group.add(rightFlipper);

  const ball = mesh(
    new THREE.SphereGeometry(0.24, 32, 18),
    new THREE.MeshStandardMaterial({ color: 0xdce3e4, roughness: 0.16, metalness: 0.85 })
  );
  ball.castShadow = true;
  group.add(ball);

  const bumperMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c453,
    emissive: 0x5c3c05,
    roughness: 0.25
  });
  [
    [-1.25, -4.9],
    [1.15, -5.15],
    [0, -3.85]
  ].forEach(([x, z]) => {
    const bumper = mesh(new THREE.CylinderGeometry(0.46, 0.56, 0.38, 32), bumperMaterial);
    bumper.position.set(x, 0.27, z);
    group.add(bumper);
  });

  const targetMaterial = new THREE.MeshStandardMaterial({
    color: 0xd94b4b,
    emissive: 0x3a0707,
    roughness: 0.35
  });
  [-1.55, 0, 1.55].forEach((x, index) => {
    const target = mesh(new THREE.BoxGeometry(0.45, 0.7, 0.16), targetMaterial);
    target.position.set(x, 0.38, index === 1 ? -2.9 : -2.55);
    group.add(target);
  });

  const ramp = mesh(
    new THREE.BoxGeometry(0.55, 0.12, 4.1),
    new THREE.MeshStandardMaterial({ color: 0x74a8ff, transparent: true, opacity: 0.42 })
  );
  ramp.position.set(-2.28, 0.34, -1.6);
  ramp.rotation.y = -0.22;
  group.add(ramp);

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
    ball.position.set(snapshot.ball.x, snapshot.ball.y + 0.2, snapshot.ball.z);
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
          material.forEach((item) => item.dispose());
        } else {
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
  angle = 0
) => {
  const rail = mesh(
    new THREE.BoxGeometry(width, 0.4, depth),
    new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.22, metalness: 0.75 })
  );
  rail.position.set(x, 0.28, z);
  rail.rotation.y = angle;
  group.add(rail);
};

const createFlipper = (color: number) => {
  const flipper = new THREE.Group();
  const body = mesh(
    new THREE.BoxGeometry(1.45, 0.22, 0.34),
    new THREE.MeshStandardMaterial({ color, roughness: 0.28 })
  );
  body.position.x = 0.5;
  flipper.add(body);
  const post = mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.26, 24),
    new THREE.MeshStandardMaterial({ color: 0xb7c4c7, roughness: 0.22, metalness: 0.75 })
  );
  flipper.add(post);
  return flipper;
};
