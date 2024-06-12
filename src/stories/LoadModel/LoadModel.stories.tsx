/* eslint-disable storybook/context-in-play-function */

import {
  Environment,
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { useControls } from "leva";
import { useEffect } from "react";
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

export const UseLoader = () => {
  const model = useLoader(GLTFLoader, "./models/Fox.glb");

  return (
    <>
      <primitive object={model.scene} scale={0.05} />
    </>
  );
};

export const UseGLTF = () => {
  const model = useGLTF("./models/Fox.glb");

  return <primitive object={model.scene} scale={0.05} />;
};

export const ModelAnimation = () => {
  const model = useGLTF("./models/Fox.glb");
  const animations = useAnimations(model.animations, model.scene);

  useEffect(() => {
    const action = animations.actions.Run;
    action?.play();
  }, []);

  return <primitive object={model.scene} scale={0.05} />;
};

export const SwitchAnimation = () => {
  const model = useGLTF("./models/Fox.glb");
  const animations = useAnimations(model.animations, model.scene);

  const { animationName, scale, positionY } = useControls({
    animationName: { options: animations.names },
    scale: {
      value: 0.05,
      min: 0.01,
      max: 0.5,
      step: 0.01,
    },
    positionY: {
      value: -1,
      min: -3,
      max: 3,
      step: 0.05,
    },
  });

  useEffect(() => {
    const action = animations.actions[animationName];
    action?.reset().fadeIn(1).play();

    return () => {
      action?.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive object={model.scene} scale={scale} position-y={positionY} />
  );
};
