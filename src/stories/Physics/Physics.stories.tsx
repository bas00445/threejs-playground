import { Center, Environment, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "Physics",
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

import { Physics, RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";

export const InitialSetup = () => {
  return (
    <Physics debug>
      {/* Box */}
      <RigidBody>
        <mesh>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* Floor */}
      <RigidBody>
        <mesh rotation-x={-Math.PI / 2} position-y={-3}>
          <planeGeometry args={[10, 20, 3]} />
          <meshStandardMaterial color="green" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};
