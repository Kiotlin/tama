import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js";
import { useEffect } from "react";

export default function Ball() {
  let scene, camera, renderer, ball;

  let gui;

  let lightProbe;
  let directionalLight;

  // linear color space
  const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1,
    materialColor: {
        r: '0.09',
        g: '0.78',
        b: '0.56',
    },
  };

  function init() {
    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(240, 234, 218)");
    scene.environment = new THREE.Color("rgb(240, 234, 218)");

    // camera
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 70);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // renderer toneMapping
    renderer.toneMapping = THREE.NoToneMapping;

    // output encoding
    renderer.outputEncoding = THREE.sRGBEncoding;

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.minDistance = 40;
    controls.maxDistance = 150;
    controls.enablePan = false;

    // probe
    lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    // light
    directionalLight = new THREE.DirectionalLight(
      0xffffff,
      API.directionalLightIntensity
    );
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // envmap
    const pisaMap = (function (prefix, postfix) {
      return [
        prefix + "px" + postfix,
        prefix + "nx" + postfix,
        prefix + "py" + postfix,
        prefix + "ny" + postfix,
        prefix + "pz" + postfix,
        prefix + "nz" + postfix,
      ];
    })("/textures/pisaRGBM16/", ".png");

    new THREE.CubeTextureLoader().load(pisaMap, (texture) => {
      texture.encoding = THREE.sRGBEncoding;

      lightProbe.copy(LightProbeGenerator.fromCubeTexture(texture));

      const geometry = new THREE.SphereGeometry(8, 64, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(API.materialColor),
        metalness: 0,
        roughness: 0,
        envMap: texture,
        envMapIntensity: API.envMapIntensity,
      });

      // mesh
      ball = new THREE.Mesh(geometry, material);
      scene.add(ball);

      render();
    });

    // gui control panel
    gui = new GUI();
    gui
      .add(API, "lightProbeIntensity", 0, 1, 0.02)
      .name("light probe")
      .onChange(() => {
        lightProbe.intensity = API.lightProbeIntensity;
        render();
      });
    gui
      .add(API, "directionalLightIntensity", 0, 1, 0.02)
      .name("directional light")
      .onChange(() => {
        directionalLight.intensity = API.directionalLightIntensity;
        render();
      });
    gui
      .add(API, "envMapIntensity", 0, 1, 0.02)
      .name("env map")
      .onChange(() => {
        ball.material.envMapIntensity = API.envMapIntensity;
        render();
      });
    gui
      .addColor(API, "materialColor")
      .name("color")
      .onChange(() => {
        ball.material.color = API.materialColor;
        render();
      });

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();
  }

  useEffect(() => {
    init();

    window.addEventListener("resize", onWindowResize, false);
  });

  return null;
}
