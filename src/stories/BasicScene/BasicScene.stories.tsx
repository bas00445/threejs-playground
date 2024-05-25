import { Environment, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { useRef } from "react";
import { DirectionalLightHelper, PointLightHelper } from "three";

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

export const Primary = {
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

export const AmbientLight = {
  render: () => {
    return (
      <>
        <ambientLight intensity={2} />
        <mesh>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="purple" opacity={0.5} />
        </mesh>
      </>
    );
  },
};

export const DirectionalLight = {
  render: () => {
    const lightRef = useRef<any>();

    useHelper(lightRef, DirectionalLightHelper, 1);

    return (
      <>
        <directionalLight
          ref={lightRef}
          position={[3, 2, -3]}
          color={"red"}
          intensity={3}
        />
        <mesh>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="white" opacity={0.5} />
        </mesh>
      </>
    );
  },
};

export const PointLight = {
  render: () => {
    const lightRef = useRef<any>();
    useHelper(lightRef, PointLightHelper, 1);

    return (
      <>
        <color attach={"background"} args={["black"]} />

        <pointLight
          ref={lightRef}
          position={[3, 2, 0]}
          color={"orange"}
          intensity={100}
          distance={10}
        />
        <mesh>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </>
    );
  },
};
