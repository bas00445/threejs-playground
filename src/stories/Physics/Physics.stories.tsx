import {
  Center,
  Environment,
  KeyboardControls,
  OrbitControls,
  Text3D,
  useGLTF,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
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

export const TypeOfColliders = () => {
  return (
    <Physics debug>
      {/* Box */}
      <RigidBody colliders="cuboid">
        <mesh rotation-x={-Math.PI / 2} position-x={-10}>
          <torusGeometry args={[1, 1, 16]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>

      <RigidBody colliders="ball">
        <mesh rotation-x={-Math.PI / 2} position-x={-4}>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      <RigidBody colliders="hull">
        <mesh rotation-x={-Math.PI / 2} position-x={1.5}>
          <torusGeometry args={[2, 1, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      <RigidBody colliders="trimesh">
        <mesh rotation-x={-Math.PI / 2} position-x={8}>
          <torusGeometry args={[2, 1, 16]} />
          <meshStandardMaterial color="orange" />
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

export const MoveRigidBody = () => {
  const cubeRef = useRef<RapierRigidBody | null>(null);

  useFrame((state) => {
    if (cubeRef.current) {
      // Moving the cube up and down
      cubeRef.current.setNextKinematicTranslation({
        x: 0,
        y: Math.sin(state.clock.elapsedTime) * 2,
        z: 0,
      });
    }
  });

  return (
    <Physics>
      <RigidBody ref={cubeRef} colliders="cuboid" type="kinematicPosition">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* Floor */}
      {/* ... */}
    </Physics>
  );
};

export const RigidBodyEvents = () => {
  const cubeRef = useRef<RapierRigidBody | null>(null);

  const cubeJump = () => {
    cubeRef.current?.applyImpulse({ x: 0, y: 60, z: 0 }, true);
    cubeRef.current?.applyTorqueImpulse(
      { x: Math.random() * 10, y: Math.random() * 10, z: Math.random() * 10 },
      true
    );
  };

  return (
    <Physics debug>
      {/* Box */}
      <RigidBody
        ref={cubeRef}
        onCollisionEnter={() => console.log("Hit floor")}
        onCollisionExit={() => console.log("Left floor")}
      >
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
