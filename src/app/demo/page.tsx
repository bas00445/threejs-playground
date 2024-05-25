"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const DemoPage = () => {
  return (
    <Canvas
      camera={{
        position: [2, 2, 5],
      }}
    >
      <OrbitControls makeDefault />
      <Environment preset="city" />

      {/* Lights */}
      <ambientLight intensity={2} />

      {/* Objects */}
      <mesh scale={1.2}>
        <boxGeometry args={[2, 2, 4]} />
        <meshStandardMaterial color="purple" opacity={0.5} />
      </mesh>
    </Canvas>
  );
};

export default DemoPage;
