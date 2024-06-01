import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const meta = {
  title: "LoadModel",
  decorators: [
    (Story) => (
      <Canvas
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

export const UseLoader = {
  render: () => {
    const model = useLoader(GLTFLoader, "./models/Fox.glb");

    return (
      <>
        <primitive object={model.scene} scale={0.05} />
      </>
    );
  },
};

export const UseGLTF = {
  render: () => {
    const model = useGLTF("./models/Fox.glb");

    return <primitive object={model.scene} scale={0.05} />;
  },
};
