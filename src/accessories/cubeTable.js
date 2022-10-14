import * as THREE from "three";

const CubeTable = ({
  positon = [0, -18, 0],
  args,
  color = "white",
  ...props
}) => {
  return (
    <mesh
      receiveShadow
      position={positon}
      rotation={[-Math.PI / 2, 0, 0]}
      {...props}
    >
      <meshLambertMaterial color={color} side={THREE.DoubleSide} />
      <boxGeometry args={args} />
    </mesh>
  );
};

export default CubeTable;
