import { MeshProps, Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import { Color } from "three";

type LevelProps = {
  position?: Vector3;
  color?: Color;
  width?: number;
  height?: number;
  depth?: number;
};

const Level = (props: LevelProps) => {
  const { width = 10, position, height = 0.5, depth = 20 } = props;

  return (
    <RigidBody type="fixed">
      <mesh position={position}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </RigidBody>
  );
};

export default Level;
