import {
  Center,
  Environment,
  KeyboardControls,
  OrbitControls,
  Text,
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
import { Color, DoubleSide, Mesh, Vector3 } from "three";
import Level from "./components/Level";

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
          <OrbitControls makeDefault />
          <Environment preset="city" far={200} />
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
    const { forward, backward, left, right } = getKeys();

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
          const ballY = ballRef.current?.translation().y ?? 0;

          // Prevent double jump
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 100, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      <RigidBody
        position-y={2}
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
        <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="rgb(182, 240, 140)" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

const LEVEL_WIDTH = 15;
const LEVEL_DEPTH = 20;
const LEVEL_COUNT = 5;

export const Main = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const moodengModel = useGLTF("./models/moodeng.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);
  const floorRef = useRef<Mesh>(null);

  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new Vector3());

  //  Listen to keyboard input
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    //  Controls
    const { forward, backward, left, right } = getKeys();

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
          const ballY = ballRef.current?.translation().y ?? 0;

          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      <RigidBody
        position={[0, 3, 0]} // make sure to add position to <RigidBody/> not <primitive/>
        ref={ballRef}
        colliders="ball"
        restitution={0.5} // make the ball bouncy
        linearDamping={0.2} // slow down movement of the ball
        angularDamping={0.2} // slow down rotation of the ball
        canSleep={false}
      >
        <primitive object={ballModel.scene} scale={1} />
      </RigidBody>

      {/* Floor */}
      <Level
        withObstacle={false}
        position={[0, 0, 0]}
        color={new Color("orange")}
        width={LEVEL_WIDTH}
        depth={LEVEL_DEPTH}
      />
      {[...Array(LEVEL_COUNT)].map((_, i) => (
        <Level
          key={i}
          color={new Color(["green", "blue", "red", "pink"][i])}
          position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
          withObstacle={i + 1 !== LEVEL_COUNT}
        />
      ))}

      {/* Walls */}

      {/* Left wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[-LEVEL_WIDTH / 2, 0, -((LEVEL_WIDTH * 5) / 2) - 10]}
        rotation-z={Math.PI / 2}
      >
        <mesh>
          <boxGeometry args={[LEVEL_WIDTH / 2, 0.5, LEVEL_DEPTH * 5]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[LEVEL_WIDTH / 2, 0, -((LEVEL_WIDTH * 5) / 2) - 10]}
        rotation-z={Math.PI / 2}
      >
        <mesh>
          <boxGeometry args={[LEVEL_WIDTH / 2, 0.5, LEVEL_DEPTH * 5]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Goal */}

      <group>
        <Center position-y={1.5} position-z={-LEVEL_DEPTH * LEVEL_COUNT}>
          <Text3D size={2} font={"/fonts/helvetiker_regular.typeface.json"}>
            Goal
            <meshStandardMaterial color="green" />
          </Text3D>
        </Center>
        <primitive
          position-y={0}
          position-z={-LEVEL_DEPTH * LEVEL_COUNT}
          object={moodengModel.scene}
          scale={0.8}
          position-x={-5}
        />
      </group>
    </Physics>
  );
};
