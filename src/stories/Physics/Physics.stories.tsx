import {
  Center,
  Environment,
  OrbitControls,
  Text3D,
  useGLTF,
  useHelper,
} from "@react-three/drei";
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
        <directionalLight intensity={10} position={[3, 2, 1]} castShadow />
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

import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";
import { useRef } from "react";

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

export const CuboidCollider = () => {
  return (
    <Physics debug>
      {/* Box */}
      <RigidBody colliders="trimesh">
        <mesh rotation-x={-Math.PI / 2}>
          <torusGeometry args={[2, 1, 16]} />
          <meshStandardMaterial color="rgb(255, 207, 13)" />
        </mesh>
      </RigidBody>

      {/* Floor */}
      <RigidBody>
        <mesh rotation-x={-Math.PI / 2} position-y={-3}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

export const ColliderWithModel = () => {
  const model = useGLTF("./models/hamburger.glb");

  return (
    <Physics debug>
      {/* Model */}
      <RigidBody colliders="hull">
        <primitive object={model.scene} scale={0.7} />
      </RigidBody>

      {/* Floor */}
      <RigidBody>
        <mesh rotation-x={-Math.PI / 2} position-y={-3}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

export const JumpingCube = () => {
  const cubeRef = useRef<RapierRigidBody | null>(null);

  const cubeJump = () => {
    cubeRef.current?.applyImpulse({ x: 0, y: 60, z: 0 }, true);
    cubeRef.current?.applyTorqueImpulse(
      { x: Math.random() * 10, y: Math.random() * 10, z: Math.random() * 10 },
      true
    );
  };

  return (
    <Physics>
      <RigidBody ref={cubeRef} colliders="cuboid">
        <mesh onClick={cubeJump} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* Floor */}
      <RigidBody>
        <mesh rotation-x={-Math.PI / 2} position-y={-3} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};
