import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js";
import { useEffect } from "react";

export default function Ball() {
  let scene, camera, renderer, control;
  let ball, table;

  let gui;

  let lightProbe;
  let directionalLight;

  let isPause = false;

  // linear color space
  const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1,
    ballColor: { r: 0.6745, g: 0.1642, b: 0.1613 },
    groundColor: { r: 0.1716, g: 0.4615, b: 0.3669 },
    play: () => {
      isPause = !isPause;
      animate();
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // renderer toneMapping
    renderer.toneMapping = THREE.NoToneMapping;

    // output encoding
    renderer.outputEncoding = THREE.sRGBEncoding;

    // axes helper
    // const axesHelper = new THREE.AxesHelper(200);
    // scene.add(axesHelper);

    // control
    control = new OrbitControls(camera, renderer.domElement);
    control.addEventListener("change", render);
    control.minDistance = 40;
    control.maxDistance = 150;
    control.enablePan = false;
    control.autoRotate = !isPause;

    // probe
    lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    // light
    directionalLight = new THREE.DirectionalLight(
      0xffffff,
      API.directionalLightIntensity
    );
    directionalLight.position.set(0, 30, 0);
    directionalLight.castShadow = true;

    // shadow range
    const d = 50;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    // shadow resolution
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    scene.add(directionalLight);

    //Create a helper for the shadow camera (optional)
    const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 8);
    scene.add(dLightHelper);

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
        color: new THREE.Color(
          API.ballColor.r,
          API.ballColor.g,
          API.ballColor.b
        ),
        metalness: 0,
        roughness: 0,
        envMap: texture,
        envMapIntensity: API.envMapIntensity,
      });

      // mesh
      ball = new THREE.Mesh(geometry, material);
      ball.castShadow = true;
      scene.add(ball);

      render();
    });

    // shadow
    renderShadow();

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

    const guiColor = gui.addFolder("Colorization");
    guiColor
      .addColor(API, "ballColor")
      .name("ball color")
      .onChange(() => {
        ball.material.color = API.ballColor;
        render();
      });
    guiColor
      .addColor(API, "groundColor")
      .name("ground color")
      .onChange(() => {
        table.material.color = API.groundColor;
        render();
      });
    gui.add(API, "play").name("play / pause");

    // on window resize
    window.addEventListener("resize", onWindowResize, false);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function renderShadow() {
    // table (ground)
    const shadowMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(
        API.groundColor.r,
        API.groundColor.g,
        API.groundColor.b
      ),
      side: THREE.DoubleSide,
    });
    const shadowGeo = new THREE.BoxGeometry(100, 100, 1);

    table = new THREE.Mesh(shadowGeo, shadowMaterial);
    table.position.y = -18;
    table.rotation.x = -Math.PI / 2;
    table.receiveShadow = true;
    scene.add(table);
  }

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();
  }

  function animate() {
    if (!isPause) {
      window.requestAnimationFrame(animate);

      control.update();
      render();
    }
  }

  useEffect(() => {
    init();
    animate();
  });

  return null;
}
