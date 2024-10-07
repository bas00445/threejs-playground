import {
  Center,
  Environment,
  OrbitControls,
  Text,
  Text3D,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";

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

export const TextWith2D = () => {
  return (
    <Text fontSize={1.2} color="red">
      Hello world
    </Text>
  );
};

export const TextWith3D = () => {
  return (
    <Text3D font={"/fonts/helvetiker_regular.typeface.json"}>
      Hello world
      <meshStandardMaterial color="green" />
    </Text3D>
  );
};

export const TextWithCenter = () => {
  return (
    <>
      <ambientLight intensity={4} />
      <Center>
        <Text3D font={"/fonts/helvetiker_regular.typeface.json"}>
          Text with Center
          <meshStandardMaterial color="purple" />
        </Text3D>
      </Center>
    </>
  );
};
