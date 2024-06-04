import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "Shadow",
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

export const CastAndReceiveShadow = {
  render: () => {
    return (
      <>
        <directionalLight intensity={10} position={[3, 2, -1]} castShadow />
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>

        <mesh position={[0, -1, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[10, 10, 2]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </>
    );
  },
};
