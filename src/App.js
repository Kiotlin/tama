import "./App.css";
import Ball from "./components/ball";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Cr } from "./utilities";

function App() {
  return (
    <>
      <Canvas className="canvas" shadows={{ type: THREE.PCFSoftShadowMap }} gl={{ toneMapping: THREE.NoToneMapping, outputEncoding: THREE.sRGBEncoding }} dpr={window.devicePixelRatio}>
        <Ball />
        <OrbitControls autoRotate enablePan={false} minDistance={40} maxDistance={150} />
      </Canvas>
      <Cr />
    </>
  );
}

export default App;
