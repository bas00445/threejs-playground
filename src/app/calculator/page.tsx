"use client";

import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";
import Calculator from "./Calculator";

const CalculatorPage = () => {
  return (
    <Canvas
      style={{ backgroundColor: "#222222" }}
      gl={{
        antialias: true,
        toneMapping: NoToneMapping,
        toneMappingExposure: 1.5,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-5, 8, 35],
      }}
    >
      <Calculator />
    </Canvas>
  );
};

export default CalculatorPage;
