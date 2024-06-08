// @ts-nocheck

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { useRef } from "react";
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
