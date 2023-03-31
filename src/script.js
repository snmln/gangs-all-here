import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Mesh } from "three";
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xc2f2f0);
const TextureLoader = new THREE.TextureLoader();

let sphereNormalMap = TextureLoader.load("/normalMaps/normal-map-world.jpeg");
let sphereImageMap = TextureLoader.load("/imageMap/earth-image-map.jpeg");
let sphereDisplacementMap = TextureLoader.load(
  "/imageMap/earth-displacement-map.jpg"
);

// Objects

const sphereGeo = new THREE.SphereGeometry(3, 64, 64);

let sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  normalMap: sphereNormalMap,
  shininess: 0,
  // displacementMap: sphereDisplacementMap,
  // displacementScale: 0.1,
  map: sphereImageMap,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);

//add pin
const pin = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 30),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const pinTwo = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 30),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);

let ohio = {
  lattitude: 39.9612,
  longitude: -82.9988,
};
let insightCorp = {
  lattitude: 33.4255,
  longitude: -111.94,
};

function convertLongLatToCartesian(longitude, lattitude) {
  let radius = 3;
  var phi = (90 - lattitude) * (Math.PI / 180);
  var theta = (longitude + 180) * (Math.PI / 180);

  let x = -(radius * Math.sin(phi) * Math.cos(theta));
  let z = radius * Math.sin(phi) * Math.sin(theta);
  let y = radius * Math.cos(phi);
  return { x, y, z };
}

let position = convertLongLatToCartesian(
  insightCorp.longitude,
  insightCorp.lattitude
);
let position2 = convertLongLatToCartesian(ohio.longitude, ohio.lattitude);

pin.position.set(position.x, position.y, position.z);
pinTwo.position.set(position2.x, position2.y, position2.z);

scene.add(pin);
scene.add(pinTwo);

// Mesh
scene.add(sphere);

const sizes = {
  //This is not dynamic we will have to establish an event listener to listen for
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
//this camera we are establishing is what ALL our view will go through.
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 7;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   0.5,
//   0,
//   0
// );

// composer.addPass(bloomPass);
// Lights

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5);
pointLight2.position.set(0, 10, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 1.5);
pointLight3.position.set(0, -10, 0);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 1.5);
pointLight4.position.set(10, 0, 0);
scene.add(pointLight4);

const pointLight5 = new THREE.PointLight(0xffffff, 1.5);
pointLight5.position.set(-10, 0, 0);
scene.add(pointLight5);

const pointLight6 = new THREE.PointLight(0xffffff, 1.5);
pointLight6.position.set(0, 0, -10);

scene.add(pointLight6);
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(
  pointLight,
  sphereSize,
  0xff0000
);
scene.add(pointLightHelper);

/* Orbit contorls */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

//We need to instantiate an instance of WEBGL to render all of our elements.
const gui = new GUI();
const lightOne = gui.addFolder("Light One");
lightOne.add(pointLight.position, "x");
lightOne.add(pointLight.position, "y");
lightOne.add(pointLight.position, "z");

lightOne.open();
gui.add(sphereMaterial, "wireframe").onChange(function (val) {
  if (val === true) {
    sphereMaterial.wireframe = true;
  } else {
    sphereMaterial.wireframe = false;
  }
});
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  // sphere.rotation.y = 0.5 * elapsedTime;

  requestAnimationFrame(animate);
  controls.update();
  // renderer.render(scene, camera);

  composer.render(scene, camera);
}
animate();
