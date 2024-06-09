import { Environment, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { motion } from "framer-motion-3d";
import { useEffect, useRef } from "react";
import { DoubleSide, Mesh } from "three";

const meta = {
  title: "Text",
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

export const TextWith3D = {
  render: () => {
    return (
      <Text3D font={"/fonts/helvetiker_regular.typeface.json"}>
        Hello world
        <meshStandardMaterial color="green" />
      </Text3D>
    );
  },
};
