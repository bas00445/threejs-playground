// @ts-nocheck

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { motion } from "framer-motion-3d";
import { useEffect, useRef } from "react";
import { DoubleSide, Mesh } from "three";

const meta = {
  title: "Animation",
  decorators: [
    (Story) => (
      <Canvas
        shadows
        camera={{
          position: [2, 2, 8],
        }}
      >
        <OrbitControls makeDefault />
        <Environment preset="city" />

        <Story />
      </Canvas>
    ),
  ],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta;

export default meta;

export const Basic = {
  render: () => {
    const boxRef = useRef<Mesh>(null);

    useFrame((state) => {
      if (boxRef.current) {
        const speed = 2;

        console.log({ elapsedTime: state.clock.elapsedTime });
        boxRef.current.rotation.y = state.clock.elapsedTime * speed;
        boxRef.current.position.x = Math.sin(state.clock.elapsedTime) * 4;
      }
    });

    return (
      <>
        <mesh ref={boxRef}>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      </>
    );
  },
};

export const WithFramerMotion = {
  render: () => {
    return (
      <>
        <motion.mesh
          initial={{ scale: 0 }}
          animate={{ scale: 1.3 }}
          transition={{ bounce: 0.5, stiffness: 120, type: "spring" }}
          whileHover={{ scale: 1.8 }}
          whileTap={{ y: 3 }}
        >
          <boxGeometry args={[2, 2, 4]} />
          <motion.meshStandardMaterial
            initial={{ color: "#ff0000" }}
            animate={{ color: "#0000ff" }}
            transition={{ duration: 1 }}
          />
        </motion.mesh>
      </>
    );
  },
};
