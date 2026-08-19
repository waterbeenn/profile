"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type KeySpec = [
  label: string,
  code: string | null,
  ratio: number,
  isModifier?: boolean,
];

// [label, event.code, width ratio, isModifier] — same 65% layout as the reference build.
const ROWS: KeySpec[][] = [
  [
    ["esc", "Escape", 1.3],
    ["1", "Digit1", 1],
    ["2", "Digit2", 1],
    ["3", "Digit3", 1],
    ["4", "Digit4", 1],
    ["5", "Digit5", 1],
    ["6", "Digit6", 1],
    ["7", "Digit7", 1],
    ["8", "Digit8", 1],
    ["9", "Digit9", 1],
    ["0", "Digit0", 1],
    ["-", "Minus", 1],
    ["=", "Equal", 1],
    ["\\", "Backslash", 1.3],
    ["`", "Backquote", 1],
  ],
  [
    ["tab", "Tab", 1.5],
    ["ㅂ", "KeyQ", 1],
    ["ㅈ", "KeyW", 1],
    ["ㄷ", "KeyE", 1],
    ["ㄱ", "KeyR", 1],
    ["ㅅ", "KeyT", 1],
    ["ㅛ", "KeyY", 1],
    ["ㅕ", "KeyU", 1],
    ["ㅑ", "KeyI", 1],
    ["ㅐ", "KeyO", 1],
    ["ㅔ", "KeyP", 1],
    ["[", "BracketLeft", 1],
    ["]", "BracketRight", 1],
    ["del", "Backspace", 1.7, true],
  ],
  [
    ["ctrl", "ControlLeft", 1.8, true],
    ["ㅁ", "KeyA", 1],
    ["ㄴ", "KeyS", 1],
    ["ㅇ", "KeyD", 1],
    ["ㄹ", "KeyF", 1],
    ["ㅎ", "KeyG", 1],
    ["ㅗ", "KeyH", 1],
    ["ㅓ", "KeyJ", 1],
    ["ㅏ", "KeyK", 1],
    ["ㅣ", "KeyL", 1],
    [";", "Semicolon", 1],
    ["'", "Quote", 1],
    ["return", "Enter", 2],
  ],
  [
    ["shift", "ShiftLeft", 2.3, true],
    ["ㅋ", "KeyZ", 1],
    ["ㅌ", "KeyX", 1],
    ["ㅊ", "KeyC", 1],
    ["ㅍ", "KeyV", 1],
    ["ㅠ", "KeyB", 1],
    ["ㅜ", "KeyN", 1],
    ["ㅡ", "KeyM", 1],
    [",", "Comma", 1],
    [".", "Period", 1],
    ["/", "Slash", 1],
    ["shift", "ShiftRight", 1.8, true],
    ["fn", null, 1, true],
  ],
  [
    ["opt", "AltLeft", 1.2, true],
    ["cmd", "MetaLeft", 1.5, true],
    ["", "Space", 6],
    ["cmd", "MetaRight", 1.5, true],
    ["opt", "AltRight", 1.2, true],
  ],
];

const UNIT = 1;
const GAP = 0.08;
const KEY_DEPTH = 0.85;
const KEY_HEIGHT = 0.32;
const ROW_GAP = 0.1;
const CASE_HEIGHT = 1.0;
const Z_STEP = KEY_DEPTH + ROW_GAP;
const TARGET_UNITS = ROWS[0].reduce((sum, key) => sum + key[2], 0);
const KEY_BEVEL = 0.015;
const BIG_CODES = new Set([
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
  "Backslash",
  "Backquote",
]);
const LABEL_FONT =
  "'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif";
const NO_SCROLL_CODES = new Set(["Tab", "Space"]);

function roundedRectShape(width: number, depth: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function buildRoundedBox(
  width: number,
  depth: number,
  height: number,
  radius: number,
  bevel: number,
) {
  const shape = roundedRectShape(width, depth, radius);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 5,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.computeBoundingBox();
  geometry.translate(0, -(geometry.boundingBox?.min.y ?? 0), 0);
  return geometry;
}

function makeLabelTexture(text: string, color: string, big?: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  if (big) {
    ctx.font = (text.length > 3 ? "600 26px " : "600 46px ") + LABEL_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 68);
  } else {
    ctx.font = "600 18px " + LABEL_FONT;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(text, 118, 10);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function makeRainbowTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#6a4bd6");
  gradient.addColorStop(0.32, "#3b7fe0");
  gradient.addColorStop(0.6, "#2fc9c9");
  gradient.addColorStop(0.82, "#3b7fe0");
  gradient.addColorStop(1, "#c751a8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return new THREE.CanvasTexture(canvas);
}

function buildKey(
  width: number,
  depth: number,
  label: string,
  isModifier: boolean,
  big: boolean,
) {
  const group = new THREE.Group();
  const baseColor = isModifier ? 0xc9e3f5 : 0xfbf9f0;
  const box = new THREE.Mesh(
    buildRoundedBox(width, depth, KEY_HEIGHT, 0.1, KEY_BEVEL),
    new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.42,
      metalness: 0.04,
    }),
  );
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);

  if (label) {
    const texture = makeLabelTexture(
      label,
      isModifier ? "#0f3350" : "#3a3a38",
      big,
    );
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.72, depth * 0.72),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = KEY_HEIGHT + KEY_BEVEL * 2 + 0.004;
    plane.renderOrder = 1;
    group.add(plane);
  }

  group.userData.box = box;
  group.userData.baseColor = baseColor;
  group.userData.pressColor = isModifier ? 0x21506e : 0x3f6f9e;
  group.userData.pressed = false;
  return group;
}

/**
 * Interactive 3D keyboard: press a physical key (anywhere on the page,
 * including while typing into the name field) and the matching keycap
 * lights up and dips. Drag to orbit. Sized to its parent container
 * rather than the viewport, so it can sit inline in a normal page layout.
 */
export default function KeyboardScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 9, 8.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.1, 1.0);
    controls.enabled = false;
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xcfe4ff, 0.36);
    fillLight.position.set(-6, 3, 8);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.13 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -CASE_HEIGHT - 0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    const keyMeshes: Record<string, THREE.Group> = {};
    const rig = new THREE.Group();

    ROWS.forEach((row, rowIndex) => {
      const rowSum = row.reduce((sum, key) => sum + key[2], 0);
      const scale = TARGET_UNITS / rowSum;
      let cursor = -(TARGET_UNITS * UNIT) / 2;
      const z = rowIndex * Z_STEP;
      row.forEach(([label, code, ratio, isModifier]) => {
        const big = code ? BIG_CODES.has(code) : false;
        const width = ratio * scale * UNIT - GAP;
        const group = buildKey(
          width,
          KEY_DEPTH - GAP,
          label,
          !!isModifier,
          big,
        );
        group.position.set(cursor + (width + GAP) / 2, 0, z);
        if (code) keyMeshes[code] = group;
        rig.add(group);
        cursor += ratio * scale * UNIT;
      });
    });

    const totalDepth = (ROWS.length - 1) * Z_STEP + KEY_DEPTH;
    const caseWidth = TARGET_UNITS * UNIT + 1.0;
    const caseDepth = totalDepth + 0.6;

    const caseMesh = new THREE.Mesh(
      buildRoundedBox(caseWidth, caseDepth, CASE_HEIGHT, 0.4, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0xf6f0e0,
        roughness: 0.55,
        metalness: 0.04,
      }),
    );
    caseMesh.position.set(
      0,
      -CASE_HEIGHT - 0.02,
      ((ROWS.length - 1) * Z_STEP) / 2 + 0.15,
    );
    caseMesh.castShadow = true;
    caseMesh.receiveShadow = true;
    rig.add(caseMesh);

    // Underglow deck sits just under the keycaps so RGB light leaks through every gap.
    const deckGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(TARGET_UNITS * UNIT + 0.2, totalDepth + 0.2),
      new THREE.MeshBasicMaterial({ map: makeRainbowTexture(512, 128) }),
    );
    deckGlow.rotation.x = -Math.PI / 2;
    deckGlow.position.set(0, -0.015, ((ROWS.length - 1) * Z_STEP) / 2);
    rig.add(deckGlow);

    // RGB underglow strip along the front edge of the case.
    const glowStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(caseWidth - 0.5, 0.14),
      new THREE.MeshBasicMaterial({ map: makeRainbowTexture(256, 32) }),
    );
    glowStrip.position.set(
      0,
      -CASE_HEIGHT + 0.07,
      (ROWS.length - 1) * Z_STEP + KEY_DEPTH / 2 + 0.32,
    );
    rig.add(glowStrip);

    rig.position.z = -totalDepth / 2;
    scene.add(rig);

    function setSize() {
      const width = container!.clientWidth || 1;
      const height = container!.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    setSize();
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    function handleKeyDown(event: KeyboardEvent) {
      const group = keyMeshes[event.code];
      const focusedTag = document.activeElement?.tagName;
      if (
        NO_SCROLL_CODES.has(event.code) &&
        focusedTag !== "INPUT" &&
        focusedTag !== "TEXTAREA"
      ) {
        event.preventDefault();
      }
      if (group && !group.userData.pressed) {
        group.userData.pressed = true;
        group.userData.box.material.color.setHex(group.userData.pressColor);
      }
    }
    function handleKeyUp(event: KeyboardEvent) {
      const group = keyMeshes[event.code];
      if (group) {
        group.userData.pressed = false;
        group.userData.box.material.color.setHex(group.userData.baseColor);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let rafId = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      Object.values(keyMeshes).forEach((group) => {
        const targetY = group.userData.pressed ? -0.12 : 0;
        group.position.y += (targetY - group.position.y) * 0.35;
      });
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
