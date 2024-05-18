"use client";

import {
  MeshReflectorMaterial,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import CircleButton from "./components/CircleButton";

const COLUMN_GAP = 2.5;
const CIRCLE_BUTTON_WIDTH = 1;
const CENTER_CAL_POSITION = new Vector3(
  3.6999999999999997,
  -3.75,
  0.04999999999999988
);

export default function Experience() {
  const cube = useRef();
  const sphere = useRef();
  const calculatorRef = useRef();

  const [equation, setEquation] = useState("");
  const { camera, scene } = useThree();

  // useFrame((state) => {
  //   var box = new Box3().setFromObject(calculatorRef.current);

  //   const center = new Vector3();
  //   const centerCal = box.getCenter(center);

  //   state.camera.lookAt(CENTER_CAL_POSITION);
  // });

  const handleClickButton = (key) => {
    if (key === "C") {
      setEquation("");
    } else if (key === "=") {
      let result = "";

      try {
        result = Function(`"use strict";return (${equation})`)();
        setEquation(result);
      } catch (error) {
        result = error;
      }
    } else if (key === "x") {
      setEquation(equation + "*");
    } else {
      setEquation(equation + key);
    }
  };

  return (
    <>
      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={4} />
      <ambientLight intensity={0.5} />

      {/* Numpad */}
      <group ref={calculatorRef} castShadow position-x={-4}>
        <group>
          <RoundedBox
            args={[COLUMN_GAP * 4, COLUMN_GAP, 1]}
            position-y={COLUMN_GAP + 0.5}
            position-x={COLUMN_GAP + 1.2}
            radius={0.4}
          >
            {/* <boxGeometry args={[COLUMN_GAP * 4, COLUMN_GAP, 1]} /> */}
            <meshToonMaterial />
            <Text
              fontSize={1.2}
              position-y={-0.1}
              position-z={0.6}
              color="#444444"
              overflowWrap="break-word"
              whiteSpace="overflowWrap"
            >
              {equation}
            </Text>
          </RoundedBox>
        </group>
        <group>
          {/* row 1 */}
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            label={7}
            onClick={() => handleClickButton("7")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-x={COLUMN_GAP * 1}
            label={8}
            onClick={() => handleClickButton("8")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-x={COLUMN_GAP * 2}
            label={9}
            onClick={() => handleClickButton("9")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#aaaaaa"
            position-x={COLUMN_GAP * 3}
            label={"+"}
            onClick={() => handleClickButton("+")}
          />

          {/* row 2 */}
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 1}
            label={4}
            onClick={() => handleClickButton("4")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 1}
            position-x={COLUMN_GAP * 1}
            label={5}
            onClick={() => handleClickButton("5")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 1}
            position-x={COLUMN_GAP * 2}
            label={6}
            onClick={() => handleClickButton("6")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#aaaaaa"
            position-y={-COLUMN_GAP * 1}
            position-x={COLUMN_GAP * 3}
            label={"-"}
            onClick={() => handleClickButton("-")}
          />

          {/* row 3 */}
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 2}
            label={1}
            onClick={() => handleClickButton("1")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 2}
            position-x={COLUMN_GAP * 1}
            label={2}
            onClick={() => handleClickButton("2")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 2}
            position-x={COLUMN_GAP * 2}
            label={3}
            onClick={() => handleClickButton("3")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#aaaaaa"
            position-y={-COLUMN_GAP * 2}
            position-x={COLUMN_GAP * 3}
            label={"x"}
            onClick={() => handleClickButton("x")}
          />

          {/* row 4 */}
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 3}
            label={0}
            onClick={() => handleClickButton("0")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 3}
            position-x={COLUMN_GAP * 1}
            label={"."}
            onClick={() => handleClickButton(".")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#ffffff"
            position-y={-COLUMN_GAP * 3}
            position-x={COLUMN_GAP * 2}
            label={"C"}
            onClick={() => handleClickButton("C")}
          />
          <CircleButton
            color="#444444"
            width={CIRCLE_BUTTON_WIDTH}
            backgroundColor="#aaaaaa"
            position-y={-COLUMN_GAP * 3}
            position-x={COLUMN_GAP * 3}
            label={"/"}
            onClick={() => handleClickButton("/")}
          />

          <group
            position-y={-COLUMN_GAP * 4 - 0.5}
            position-x={COLUMN_GAP + 1.2}
          >
            <motion.mesh
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClickButton("=")}
            >
              <RoundedBox args={[COLUMN_GAP * 4, COLUMN_GAP, 1]} radius={0.4}>
                <meshToonMaterial color="#3ee6a4" />
              </RoundedBox>
            </motion.mesh>
            <Text
              fontSize={1.5}
              position-z={0.6}
              position-y={-0.1}
              color={"#ffffff"}
            >
              =
            </Text>
          </group>
        </group>
        <mesh
          receiveShadow
          position-y={-COLUMN_GAP * 5 - 0.5}
          position-x={CENTER_CAL_POSITION.x}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[100, 100, 2]} />
          <MeshReflectorMaterial
            color="#222222"
            resolution={1024}
            blur={[1000, 1000]}
            mixBlur={0.7}
            mirror={0.5}
          />
        </mesh>
      </group>
    </>
  );
}
