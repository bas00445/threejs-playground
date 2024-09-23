import {
  Center,
  Environment,
  KeyboardControls,
  OrbitControls,
  Text3D,
  useGLTF,
  useHelper,
  useKeyboardControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useEffect, useRef, useState } from "react";
import { DoubleSide, Mesh, Vector3 } from "three";

const meta = {
  title: "Workshop",
  decorators: [
    (Story) => (
      <KeyboardControls
        map={[
          { keys: ["ArrowUp", "KeyW"], name: "forward" },
          { keys: ["ArrowDown", "KeyS"], name: "backward" },
          { keys: ["ArrowLeft", "KeyA"], name: "left" },
          { keys: ["ArrowRight", "KeyD"], name: "right" },
          { keys: ["Space"], name: "jump" },
        ]}
      >
        <Canvas
          shadows
          camera={{
            position: [2, 2, 8],
          }}
        >
          <directionalLight intensity={10} position={[3, 2, 1]} castShadow />
          {/* <OrbitControls makeDefault /> */}
          <Environment preset="city" />
          {/* <ControlBall /> */}
          <Story />
        </Canvas>
      </KeyboardControls>
    ),
  ],
} satisfies Meta;

export default meta;

export const ControlBall = () => {
  const model = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);

  //  Listen to keyboard input
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 30 * delta; // to move object
    const torqueStrength = 30 * delta; // to rotate object

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    // if (jump) {
    //   impulse.y += 7;
    // }

    ballRef.current?.applyImpulse(impulse);
    ballRef.current?.applyTorqueImpulse(torque);
  });

  useEffect(() => {
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          ballRef.current?.applyImpulse({ x: 0, y: 100, z: 0 });
        }
      }
    );
  }, []);

  return (
    <Physics>
      <RigidBody
        ref={ballRef}
        colliders="hull"
        restitution={0.5} // make the ball bouncy
        linearDamping={0.5} // slow down movement of the ball
        angularDamping={0.5} // slow down rotation of the ball
        canSleep={false}
      >
        <primitive object={model.scene} scale={1.2} />
      </RigidBody>

      {/* Floor */}
      <RigidBody type="fixed">
        <mesh rotation-x={-Math.PI / 2} position-y={-3} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

export const Camera = () => {
  const model = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);
  const floorRef = useRef<Mesh>(null);

  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  //  Listen to keyboard input
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    //  Controls
    const { forward, backward, left, right, jump } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 30 * delta; // to move object
    const torqueStrength = 30 * delta; // to rotate object

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    // if (jump) {
    //   impulse.y += 7;
    // }

    ballRef.current?.applyImpulse(impulse);
    ballRef.current?.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const ballPosition = ballRef.current?.translation();

    const cameraPosition = new Vector3();
    cameraPosition.copy(ballPosition);
    cameraPosition.z += 6;
    cameraPosition.y += 1.5;

    const cameraTarget = new Vector3();
    cameraTarget.copy(ballPosition);
    cameraTarget.y += 1;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  useEffect(() => {
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          ballRef.current?.applyImpulse({ x: 0, y: 100, z: 0 });
        }
      }
    );
  }, []);

  return (
    <Physics>
      <RigidBody
        ref={ballRef}
        colliders="ball"
        restitution={0.5} // make the ball bouncy
        linearDamping={0.5} // slow down movement of the ball
        angularDamping={0.5} // slow down rotation of the ball
        canSleep={false}
      >
        <primitive object={model.scene} scale={1.2} />
      </RigidBody>

      {/* Floor */}
      <RigidBody type="fixed">
        <mesh
          rotation-x={-Math.PI / 2}
          position-y={-3}
          receiveShadow
          ref={floorRef}
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};
