import { MeshProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import { Color } from "three";

type LevelProps = MeshProps & {
  color?: Color;
  size?: number;
};

const Level = (props: LevelProps) => {
  const { size = 10 } = props;

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh {...props}>
        <boxGeometry args={[size, 0.5, size]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </RigidBody>
  );
};

export default Level;
