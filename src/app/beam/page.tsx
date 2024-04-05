"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";

const BeamPage = () => {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [4, 2, 6],
      }}
    >
      <color attach={"background"} args={["black"]} />
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Canvas>
  );
};

export default BeamPage;
