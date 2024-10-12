import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
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
    withObstacle = true,
    position,
    height = 0.5,
    depth = 20,
  } = props;

  return (
    <>
      {withObstacle && (
        <RigidBody
          type="kinematicPosition"
          position={[position[0], position[1] + 0.7, position[2]]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, 1, 0.8]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      )}

      {/* Floor */}
      <RigidBody type="fixed" position={position}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={props.color} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Level;
