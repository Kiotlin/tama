import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { DynamicProps } from "../utilities";
import { CubeTable, SolidBall } from "../accessories";

// linear color space
const API = DynamicProps({
  lightProbeIntensity: 1.0,
  directionalLightIntensity: 0.2,
  envMapIntensity: 1,
  ballColor: { r: 0.6745, g: 0.1642, b: 0.1613 },
  groundColor: { r: 0.1716, g: 0.4615, b: 0.3669 },
});

export default function Ball() {
  const dLight = useRef();
  const d = 8;

  useHelper(dLight, THREE.DirectionalLightHelper, 2, "hotpink");

  return (
    <>
      <perspectiveCamera
        fov={40}
        position={[0, 0, 70]}
        aspect={window.innerWidth / window.innerHeight}
      />
      <lightProbe />
      <directionalLight
        castShadow
        ref={dLight}
        args={[0xfffffff, API.directionalLightIntensity]}
        position={[0, 30, 0]}
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-d, d, d, -d]} />
      </directionalLight>
      <Suspense fallback={null}>
        <group>
          <SolidBall
            args={[8, 64, 32]}
            color={Object.values(API.ballColor)}
            envMapIntensity={API.envMapIntensity}
          />
          <CubeTable
            args={[100, 100, 1]}
            color={Object.values(API.groundColor)}
          />
        </group>
      </Suspense>
    </>
  );
}
