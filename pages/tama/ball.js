import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js";
import { useEffect } from "react";

export default function Ball() {
  let scene, camera, renderer;
  let ball, table;

  let gui;

  let lightProbe;
  let directionalLight;

  // linear color space
  const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1,
    materialColor: {
      r: "0.09",
      g: "0.78",
      b: "0.56",
    },
  };

  function init() {
    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(233, 227, 213)");
    // scene.environment = new THREE.Color("rgb(240, 234, 218)");

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
      ball.position.y = 5;
      scene.add(ball);

      // shadow
      renderShadow();

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

    // on window resize
    window.addEventListener("resize", onWindowResize, false);

    // animate
    animate();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function renderShadow() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(190,190,190,0.1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.5)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const shadowTexture = new THREE.CanvasTexture(canvas);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      color: new THREE.Color('rgba(255, 242, 204, 1)'),
      metalness: 0,
      roughness: 0,
    });
    const shadowGeo = new THREE.PlaneGeometry(100, 100, 1, 1);

    table = new THREE.Mesh(shadowGeo, shadowMaterial);
    table.position.y = -13;
    table.rotation.x = -Math.PI / 2;
    scene.add(table);
  }

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();
  }

  function animate() {
    window.requestAnimationFrame(animate);

    if (ball) {
      ball.rotation.x += 0.005;
      ball.rotation.y += 0.005;
    }

    render();
  }

  useEffect(() => {
    init();
  });

  return null;
}
