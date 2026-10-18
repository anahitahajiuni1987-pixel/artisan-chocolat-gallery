import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";

const CHOC_DARK = "#2b160e";
const CHOC_BOX = "#3a2016";
const CHOC_LID = "#47271a";
const GOLD = "#c9a24a";
const BURGUNDY = "#5a1620";
const MILK = "#7a4a2c";
const WHITE = "#efe4cf";

type Piece = { kind: "dome" | "truffle" | "square" | "heart" | "white"; pos: [number, number, number]; s: number; speed: number };

// Deterministic layout so the server and client agree and nothing random runs at module scope.
const PIECES: Piece[] = [
  { kind: "dome", pos: [2.7, 1.6, 0.6], s: 0.42, speed: 1.1 },
  { kind: "truffle", pos: [-2.6, 1.9, -0.4], s: 0.4, speed: 0.9 },
  { kind: "square", pos: [2.2, -0.3, 1.8], s: 0.38, speed: 1.3 },
  { kind: "white", pos: [-2.2, -0.2, 1.6], s: 0.34, speed: 1.0 },
  { kind: "heart", pos: [0.4, 2.7, -1.2], s: 0.36, speed: 0.8 },
  { kind: "dome", pos: [-1.0, 2.4, 1.4], s: 0.3, speed: 1.2 },
  { kind: "truffle", pos: [3.4, 0.6, -1.4], s: 0.32, speed: 1.4 },
  { kind: "square", pos: [-3.3, 0.7, -1.6], s: 0.3, speed: 1.05 },
];

function Gloss({ color, rough = 0.28 }: { color: string; rough?: number }) {
  return <meshPhysicalMaterial color={color} roughness={rough} clearcoat={1} clearcoatRoughness={0.12} sheen={0.2} />;
}

function Praline({ p }: { p: Piece }) {
  const s = p.s;
  switch (p.kind) {
    case "dome":
      return (
        <group scale={s}>
          <mesh castShadow>
            <sphereGeometry args={[1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Gloss color={CHOC_DARK} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2}>
            <circleGeometry args={[1, 48]} />
            <meshStandardMaterial color={CHOC_DARK} roughness={0.6} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0.15 * i - 0.15, 0.97 - i * 0.03, 0.1 * i]} rotation={[0.3 * i, i, 0.2]}>
              <boxGeometry args={[0.28, 0.02, 0.2]} />
              <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />
            </mesh>
          ))}
        </group>
      );
    case "truffle":
      return (
        <mesh castShadow scale={s}>
          <icosahedronGeometry args={[1, 4]} />
          <meshStandardMaterial color="#6b3f27" roughness={0.95} />
        </mesh>
      );
    case "white":
      return (
        <mesh castShadow scale={s}>
          <sphereGeometry args={[1, 48, 32]} />
          <Gloss color={WHITE} rough={0.4} />
        </mesh>
      );
    case "square":
      return (
        <RoundedBox args={[1.6 * s, 1.0 * s, 1.6 * s]} radius={0.12 * s} smoothness={4} castShadow>
          <Gloss color={BURGUNDY} rough={0.18} />
        </RoundedBox>
      );
    case "heart":
      return (
        <group scale={s} rotation-z={Math.PI}>
          <mesh castShadow position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.7, 40, 24]} />
            <Gloss color={MILK} rough={0.2} />
          </mesh>
          <mesh castShadow position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.7, 40, 24]} />
            <Gloss color={MILK} rough={0.2} />
          </mesh>
          <mesh castShadow position={[0, 0.55, 0]} rotation-z={Math.PI / 4}>
            <boxGeometry args={[1.05, 1.05, 1.0]} />
            <Gloss color={MILK} rough={0.2} />
          </mesh>
        </group>
      );
  }
}

function GiftBox() {
  const gold = <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.28} />;
  return (
    <group>
      <RoundedBox args={[3, 1.1, 3]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial color={CHOC_BOX} roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[3.12, 0.4, 3.12]} radius={0.05} smoothness={4} position={[0, 0.72, 0]} castShadow>
        <meshPhysicalMaterial color={CHOC_LID} roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.3} />
      </RoundedBox>
      {/* gold foil lip */}
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[3.14, 0.03, 3.14]} />
        {gold}
      </mesh>
      {/* ribbon */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.34, 1.55, 3.16]} />
        {gold}
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.16, 1.55, 0.34]} />
        {gold}
      </mesh>
      {/* bow */}
      <group position={[0, 1.02, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0.5]} position={[0.36, 0.08, 0]} scale={[1, 0.6, 1]}>
          <torusGeometry args={[0.36, 0.09, 20, 48]} />
          {gold}
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, -0.5]} position={[-0.36, 0.08, 0]} scale={[1, 0.6, 1]}>
          <torusGeometry args={[0.36, 0.09, 20, 48]} />
          {gold}
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.14, 24, 16]} />
          {gold}
        </mesh>
      </group>
    </group>
  );
}

function Rig({ still, offsetX }: { still: boolean; offsetX: number }) {
  const group = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    const intro = still ? 1 : 1 - Math.pow(1 - Math.min(t / 2.8, 1), 3);
    const cam = state.camera;
    const px = still ? 0 : state.pointer.x;
    const py = still ? 0 : state.pointer.y;
    const tz = 15 - 5.2 * intro;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, px * 0.7, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 1.9 + py * 0.45 + (1 - intro) * 2.5, 2.5, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 3, dt);
    cam.lookAt(offsetX * 0.6, 0.4, 0);
    if (group.current) {
      const ry = -0.65 + (still ? 0 : Math.sin(t * 0.25) * 0.12) + px * 0.25;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ry, 3, dt);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.12 - py * 0.08, 3, dt);
    }
  });
  return (
    <group position={[offsetX, 0, 0]}>
      <group ref={group}>
        <GiftBox />
      </group>
      {PIECES.map((p, i) => (
        <Float key={i} speed={still ? 0 : p.speed} rotationIntensity={still ? 0 : 0.6} floatIntensity={still ? 0 : 0.8}>
          <group position={p.pos} rotation={[0.4 * i, 0.7 * i, 0.2]}>
            <Praline p={p} />
          </group>
        </Float>
      ))}
      <ContactShadows position={[0, -0.56, 0]} opacity={0.65} scale={12} blur={2.6} far={3} color="#000000" />
    </group>
  );
}

export default function Hero3D({ still, offsetX, active, fallback }: { still: boolean; offsetX: number; active: boolean; fallback: ReactNode }) {
  return (
    <Canvas fallback={fallback} frameloop={active ? "always" : "never"} shadows dpr={[1, 1.5]} camera={{ position: [0, 4, 15], fov: 32 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 9, 6]} angle={0.4} penumbra={0.8} intensity={140} color="#ffe2b8" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-6, 2, -4]} intensity={30} color="#c46a3a" />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 6, 2]} scale={[8, 4, 1]} color="#fff1d6" />
        <Lightformer intensity={1.2} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color="#e3a36b" />
        <Lightformer intensity={0.8} position={[6, 0, -2]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} color="#ffd9a8" />
      </Environment>
      <Rig still={still} offsetX={offsetX} />
    </Canvas>
  );
}
