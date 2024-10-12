import { MeshProps, useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef, useState } from "react";
import { Color, Vector3 } from "three";

type LevelProps = {
  withObstacle?: boolean;
  position?: Vector3;
  color?: Color;
  width?: number;
  height?: number;
  depth?: number;
};

const Level = (props: LevelProps) => {
  const {
    width = 10,
    position,
    withObstacle = true,
    height = 0.5,
    depth = 20,
  } = props;

  const [timeOffset] = useState(Math.random() * Math.PI * 2);

  const blockRef = useRef<RapierRigidBody | null>(null);

  useFrame((state, delta) => {
    if (blockRef.current) {
      const position = blockRef.current?.translation();

      blockRef.current?.setNextKinematicTranslation({
        x: position.x,
        y: Math.sin(state.clock.elapsedTime * 3 + timeOffset) * 1.5 + 2.5,
        z: position.z,
      });
    }
  });

  return (
    <>
      {withObstacle && (
        <RigidBody
          type="kinematicPosition"
          ref={blockRef}
          position={[position[0], position[1], position[2]]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, 1, 0.8]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      )}
      <RigidBody type="fixed" position={position}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={props.color} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Level;
