import { MeshProps, useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { Color, Vector3 } from "three";

type LevelProps = {
  position?: Vector3;
  color?: Color;
  width?: number;
  height?: number;
  depth?: number;
};

const Level = (props: LevelProps) => {
  const { width = 10, position, height = 0.5, depth = 20 } = props;

  const blockRef = useRef();

  useFrame((state, delta) => {
    if (blockRef.current) {
      blockRef.current.rotation.y += delta * 4;
    }
  });

  return (
    <>
      <RigidBody
        type="fixed"
        ref={blockRef}
        position={[position[0], position[1] + 0.5, position[2]]}
      >
        <mesh>
          <boxGeometry args={[width * 0.8, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={position}>
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={props.color} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Level;
