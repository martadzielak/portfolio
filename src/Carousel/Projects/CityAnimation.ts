import * as THREE from "three";
import { PointLight } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { PixelShader } from "three/examples/jsm/shaders/PixelShader";

PixelShader.vertexShader = [
  "varying highp vec2 vUv;",

  "void main() {",

  "vUv = uv;",
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

  "}",
].join("\n");

PixelShader.fragmentShader = [
  "uniform sampler2D tDiffuse;",
  "uniform float pixelSize;",
  "uniform vec2 resolution;",

  "varying highp vec2 vUv;",

  "void main(){",

  "vec2 dxy = pixelSize / resolution;",
  "vec2 coord = dxy * floor( vUv / dxy );",
  "gl_FragColor = texture2D(tDiffuse, coord);",

  "}",
].join("\n");

const setUpRenderer = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor(0x2e7c95);

  return { renderer, scene, camera };
};

const setUpScene = (scene) => {
  scene.fog = new THREE.FogExp2(0x3690ae, 0.0085);

  const groundGeo = new THREE.PlaneGeometry(400, 400, 4, 4);
  const groundMat = new THREE.MeshPhongMaterial({ color: 0x244876 });
  groundMat.shininess = 100;

  const ground = new THREE.Mesh(groundGeo, groundMat);
  scene.add(ground);

  ground.position.x = 140;
  ground.position.y = 0;
  ground.position.z = -150;
  ground.rotation.x = -1.55;

  return scene;
};

const setUpCamera = (camera) => {
  camera.position.x = 0;
  camera.position.y = 25;
  camera.position.z = 0;

  camera.rotation.y = -0.785398163;
  camera.rotation.z = -0.28;
  camera.rotation.x = -0.4;

  return camera;
};

const setUpLight = (scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-20, 10, 30);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xff0000, 10, 100);
  scene.add(pointLight);

  return { scene, pointLight };
};

const addBuildings = (scene) => {
  const monolith = [];
  const monolithGeo = new THREE.BoxGeometry(4, 4, 4);
  const monolithMat = new THREE.MeshPhongMaterial({ color: 0x244876 });
  monolithMat.shininess = 100;
  let rowZ = 0;

  for (let r = 0; r < 35; r++) {
    rowZ -= 10;

    for (let i = 0; i < 35; i++) {
      monolith[i] = new THREE.Mesh(monolithGeo, monolithMat);
      monolith[i].position.x = i * 10;
      monolith[i].position.y = 0;
      monolith[i].position.z = rowZ;

      const rand = Math.ceil(Math.random() * 10);
      monolith[i].scale.y = rand;
      scene.add(monolith[i]);
    }
  }
  return scene;
};

const postprocess = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
  const pixelPass = new ShaderPass(PixelShader);
  /* tslint:disable:no-string-literal */
  pixelPass.uniforms["pixelSize"].value = 10;
  pixelPass.uniforms["resolution"].value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );
  pixelPass.uniforms["resolution"].value.multiplyScalar(
    window.devicePixelRatio
  );
  /* tslint:enable:no-string-literal */
  composer.addPass(pixelPass);

  return composer;
};

const animate = ({ composer, camera, pointLight }) => {
  requestAnimationFrame(() => animate({ composer, camera, pointLight }));

  camera.position.z -= 0.1;
  camera.position.x += 0.1;

  pointLight.position.set(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );

  composer.render();
};

export const runCityAnimation = (id) => {
  let { scene, camera, renderer } = setUpRenderer();
  scene = setUpLight(setUpScene(scene)).scene;
  addBuildings(scene);
  camera = setUpCamera(camera);
  const composer = postprocess(renderer, scene, camera);
  const pointLight = scene.children[2];
  console.log(scene);
  animate({ composer, camera, pointLight });
  const canvas = document.getElementById(id).appendChild(renderer.domElement);
  canvas.id = "city-canvas";
};

export const stopCityAnimation = () => {
  document.getElementById("city-canvas").remove();
};
