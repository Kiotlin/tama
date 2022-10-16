import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { DynamicProps } from "../utilities";
import { CubeTable, SolidBall } from "../accessories";
import { useTweaks, makeFolder } from "use-tweaks";

// linear color space
const API = DynamicProps({
  directionalLightIntensity: 0.2,
  envMapIntensity: 1,
  ballColor: '#c54545',
  groundColor: '#3778ac',
});

export default function Ball() {
  const dLight = useRef();
  const { dli, enm, ball, table } = useTweaks("", {
    ...makeFolder(
      "Intensity",
      {
        dli: { value: API.directionalLightIntensity, min: 0.0, max: 1.0 },
        enm: { value: API.envMapIntensity, min: 0.0, max: 1.0 },
      },
      false
    ),
    ...makeFolder("Color", {
      ball: { value: API.ballColor },
      table: { value: API.groundColor },
    }, false),
  });
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
        args={[0xfffffff, dli]}
        position={[0, 30, 0]}
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-d, d, d, -d]} />
      </directionalLight>
      <Suspense fallback={null}>
        <group>
          <SolidBall
            args={[8, 64, 32]}
            color={ball}
            envMapIntensity={enm}
          />
          <CubeTable
            args={[100, 100, 1]}
            color={table}
          />
        </group>
      </Suspense>
    </>
  );
}
