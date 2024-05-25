import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "BasicScene",
  decorators: [
    (Story) => (
      <Canvas
        camera={{
          position: [2, 2, 5],
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

export const Primary: StoryObj = {
  render: () => {
    return (
      <>
        <mesh>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="purple" opacity={0.5} />
        </mesh>
      </>
    );
  },
};
