import { useLoader } from "@react-three/fiber";
import pisaRGBM16 from "../textures/pisaRGBM16";
import { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader";

const SolidBall = ({
  args,
  color,
  metalness = 0,
  roughness = 0,
  envMapIntensity,
  ...props
}) => {
  const [cubeTextureLoader] = useLoader(CubeTextureLoader, [pisaRGBM16]);

  return (
    <mesh castShadow {...props}>
      <sphereGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        envMap={cubeTextureLoader}
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
};

export default SolidBall;
