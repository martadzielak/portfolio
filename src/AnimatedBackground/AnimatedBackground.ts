import * as THREE from "three";
import { Audio } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { PixelShader } from "three/examples/jsm/shaders/PixelShader";

// PixelShader.uniforms = {

//       "tDiffuse": { value: null },
//       "resolution": { value: null },
//       "pixelSize": { value: 8. },

//   },

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

export const run = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor(0x2e7c95);
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

  camera.position.x = 0;
  camera.position.y = 25;
  camera.position.z = 0;

  camera.rotation.y = -0.785398163;
  camera.rotation.z = -0.280;
  camera.rotation.x = -0.400;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-20, 10, 30);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xff0000, 10, 100);
  scene.add(pointLight);

  const monolith = [];
  const monolithGeo = new THREE.BoxGeometry(4, 4, 4);
  const monolithMat = new THREE.MeshPhongMaterial({ color: 0x244876 });
  monolithMat.shininess = 100;
  const monolithRow = [];
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

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
  const pixelPass = new ShaderPass(PixelShader);
  /* tslint:disable:no-string-literal */
  pixelPass.uniforms["pixelSize"].value = 10;
  pixelPass.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  pixelPass.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
  /* tslint:enable:no-string-literal */
  composer.addPass(pixelPass);

  let analyser;
  let frequencyData: Uint8Array;
  let audio: Audio;
  const listener = new THREE.AudioListener();
  analyser = new AnalyserNode(new AudioContext());
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  frequencyData = analyser.getByteFrequencyData(frequencyData);

  // Once the song is playable, the loader disappears and the init function start
  document.addEventListener("click", () => {

    audio = new Audio(listener);
    camera.add(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("Bio Unit - Steppe.mp3", (buffer) => {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();
    });
  });

  // const size = (frequencyData[0] / frequencyData.length);
  // scene.children.forEach((child) => { child.scale.y += size; });

  const render = () => {

    camera.position.z -= 0.1;
    camera.position.x += 0.1;
    pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);

    requestAnimationFrame(render);
    composer.render();
  };
  render();
  document.querySelector("#root").appendChild(renderer.domElement);

};

