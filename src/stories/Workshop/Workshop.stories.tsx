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
import {
  Color,
  DirectionalLightHelper,
  DoubleSide,
  Mesh,
  Vector3,
} from "three";
import Level1 from "./components/Level_1";
import Level2 from "./components/Level_2";
import Level3 from "./components/Level_3";
import Level4 from "./components/Level_4";

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
          <directionalLight
            intensity={5}
            position={[10, 10, 10]}
            // Increase area of casting shadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-top={200}
            shadow-camera-right={200}
            shadow-camera-bottm={-200}
            shadow-camera-left={-200}
            castShadow
          />
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
          <meshStandardMaterial color="orange" side={DoubleSide} />
        </mesh>
      </RigidBody>
    </Physics>
  );
};

const LEVEL_WIDTH = 20;
const LEVEL_DEPTH = 20;
const LEVEL_COUNT = 5;

export const CameraPosition = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      {/* Player */}
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
      <RigidBody type="fixed">
        <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="orange" side={DoubleSide} />s
        </mesh>
      </RigidBody>
    </Physics>
  );
};

export const BasicLevel = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      {/* Player */}
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
      <Level1
        position={[0, 0, 0]}
        color={new Color("orange")}
        width={LEVEL_WIDTH}
        depth={LEVEL_DEPTH}
      />
      {[...Array(LEVEL_COUNT)].map((_, i) => (
        <Level1
          key={i}
          color={new Color(["green", "blue", "red", "pink"][i])}
          position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
        />
      ))}
    </Physics>
  );
};

export const LevelWithObstacle = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      {/* Player */}
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
      <Level2
        withObstacle={false}
        position={[0, 0, 0]}
        color={new Color("orange")}
        width={LEVEL_WIDTH}
        depth={LEVEL_DEPTH}
      />
      {[...Array(LEVEL_COUNT)].map((_, i) => (
        <Level2
          key={i}
          color={new Color(["green", "blue", "red", "pink"][i])}
          position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
          withObstacle={i + 1 !== LEVEL_COUNT}
        />
      ))}
    </Physics>
  );
};

export const LevelWithMovingObstacle = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      {/* Player */}
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
      <Level3
        withObstacle={false}
        position={[0, 0, 0]}
        color={new Color("orange")}
        width={LEVEL_WIDTH}
        depth={LEVEL_DEPTH}
      />
      {[...Array(LEVEL_COUNT)].map((_, i) => (
        <Level3
          key={i}
          color={new Color(["green", "blue", "red", "pink"][i])}
          position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
          withObstacle={i + 1 !== LEVEL_COUNT}
        />
      ))}
    </Physics>
  );
};

export const WithGoal = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const moodengModel = useGLTF("./models/moodeng.glb"); // "Moo Deng" (https://skfb.ly/prBvu) by CzernO is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  return (
    <Physics>
      {/* Player */}
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
      <Level3
        withObstacle={false}
        position={[0, 0, 0]}
        color={new Color("orange")}
        width={LEVEL_WIDTH}
        depth={LEVEL_DEPTH}
      />
      {[...Array(LEVEL_COUNT)].map((_, i) => (
        <Level3
          key={i}
          color={new Color(["green", "blue", "red", "pink"][i])}
          position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
          withObstacle={i + 1 !== LEVEL_COUNT}
        />
      ))}

      {/* Goal */}
      <group>
        <Center
          position-x={2.2}
          position-y={1.5}
          position-z={-LEVEL_DEPTH * LEVEL_COUNT}
        >
          <RigidBody>
            <Text3D size={2} font={"/fonts/helvetiker_regular.typeface.json"}>
              Goal
              <meshStandardMaterial color="green" />
            </Text3D>
          </RigidBody>
        </Center>
        <RigidBody
          colliders="hull"
          rotation-y={-Math.PI / 4}
          mass={0.05}
          position-x={-2.8}
          position-y={2.3}
          position-z={-LEVEL_DEPTH * LEVEL_COUNT}
        >
          <primitive object={moodengModel.scene} scale={4} />
        </RigidBody>
      </group>
    </Physics>
  );
};

export const WithShadow = () => {
  const ballModel = useGLTF("./models/soccer_ball.glb");
  const moodengModel = useGLTF("./models/moodeng.glb"); // "Moo Deng" (https://skfb.ly/prBvu) by CzernO is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  const ballRef = useRef<RapierRigidBody | null>(null);

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

          // Prevent double jump in the air
          if (ballY < 1.2) {
            ballRef.current?.applyImpulse({ x: 0, y: 40, z: 0 }, true);
          }
        }
      }
    );
  }, []);

  // Enable shadow casting for 3d model
  useEffect(() => {
    ballModel.scene.traverse((children) => {
      if (children instanceof Mesh) {
        children.castShadow = true;
      }
    });
  }, [ballModel.scene]);

  useEffect(() => {
    moodengModel.scene.traverse((children) => {
      if (children instanceof Mesh) {
        children.castShadow = true;
      }
    });
  }, [moodengModel.scene]);

  return (
    <>
      <Physics>
        {/* Player */}
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
        <Level4
          withObstacle={false}
          position={[0, 0, 0]}
          color={new Color("orange")}
          width={LEVEL_WIDTH}
          depth={LEVEL_DEPTH}
        />
        {[...Array(LEVEL_COUNT)].map((_, i) => (
          <Level4
            key={i}
            color={new Color(["green", "blue", "red", "pink"][i])}
            position={[0, 0, -LEVEL_DEPTH * (i + 1)]}
            width={LEVEL_WIDTH}
            depth={LEVEL_DEPTH}
            withObstacle={i + 1 !== LEVEL_COUNT}
          />
        ))}

        {/* Goal */}
        <group>
          <Center
            position-x={2.2}
            position-y={1.5}
            position-z={-LEVEL_DEPTH * LEVEL_COUNT}
          >
            <RigidBody>
              <Text3D size={2} font={"/fonts/helvetiker_regular.typeface.json"}>
                Goal
                <meshStandardMaterial color="green" />
              </Text3D>
            </RigidBody>
          </Center>
          <RigidBody
            colliders="hull"
            rotation-y={-Math.PI / 4}
            mass={0.05}
            position-x={-2.8}
            position-y={2.3}
            position-z={-LEVEL_DEPTH * LEVEL_COUNT}
          >
            <primitive object={moodengModel.scene} scale={4} />
          </RigidBody>
        </group>
      </Physics>
    </>
  );
};
