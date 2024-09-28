import { MeshProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import { Color } from "three";

type LevelProps = MeshProps & {
  color?: Color;
  width?: number;
  height?: number;
  depth?: number;
};

const Level = (props: LevelProps) => {
  const { width = 10, height = 0.5, depth = 20 } = props;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh {...props}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </RigidBody>
  );
};

export default Level;
