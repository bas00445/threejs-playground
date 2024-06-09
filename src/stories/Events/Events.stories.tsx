// @ts-nocheck

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { useRef } from "react";

const meta = {
  title: "Events",
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

export const Primary = {
  render: () => {
    const cubeRef = useRef<any>();
    const onClickCube = (event) => {
      console.log(event);

      //  Random color of the cube
      cubeRef.current.material.color.set(
        `hsl(${Math.random() * 360}, 100%, 75%)`
      );
    };

    return (
      <>
        <mesh ref={cubeRef} onClick={onClickCube}>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="purple" opacity={0.5} />
        </mesh>
      </>
    );
  },
};

export const Occluding = {
  render: () => {
    const onClickCube = (event) => {
      event.stopPropagation();
      console.log("onClickCube");
    };

    const onClickSphere = (event) => {
      console.log("onClickSphere");
    };

    return (
      <>
        <mesh onClick={onClickCube}>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="purple" />
        </mesh>

        <mesh onClick={onClickSphere} position-z={-5}>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </>
    );
  },
};
