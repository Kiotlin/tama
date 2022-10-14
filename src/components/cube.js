import * as Three from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const CubeMesh = () => {
  const cubeRef = useRef();
  const mColor = new Three.Color(0x00ff00);

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry />
      <meshBasicMaterial color={mColor} />
    </mesh>
  );
};

export default function Cube() {
  return (
    <>
      <perspectiveCamera
        position={[0, 0, 5]}
        fov={45}
        aspect={window.innerWidth / window.innerHeight}
      />
      <CubeMesh />
    </>
  );
}
