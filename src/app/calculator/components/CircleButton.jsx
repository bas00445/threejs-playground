import { Text } from "@react-three/drei";
import React from "react";

import { motion } from "framer-motion-3d";

export default function CircleButton(props) {
  return (
    <motion.group {...props}>
      <motion.mesh
        rotation={[-Math.PI / 2, 0, 0]}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
      >
        <cylinderGeometry args={[props.width, props.width, 1]} />
        <meshToonMaterial color={props.backgroundColor} />
      </motion.mesh>
      <Text
        fontSize={1.2}
        position-y={-0.1}
        position-z={0.6}
        color={props.color}
      >
        {props.label}
      </Text>
    </motion.group>
  );
}
