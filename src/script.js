import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc2f2f0);
const TextureLoader = new THREE.TextureLoader();
let uvMap = TextureLoader.load("/imageMap/uv-map.png");

let sphereNormalMap = TextureLoader.load("/normalMaps/normal-map-world.jpeg");
let sphereImageMap = TextureLoader.load("/imageMap/earth-image-map.jpeg");
let sphereDisplacementMap = TextureLoader.load(
  "/imageMap/earth-displacement-map.jpg"
);

let torusNormalMap = TextureLoader.load("/normalMaps/torus-normal-map.jpeg");
let dodecahedronNormalMap = TextureLoader.load(
  "/normalMaps/shape-normal-map.jpeg"
);
// Objects
const torousGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
let torousMaterial = new THREE.MeshToonMaterial({
  color: 0xeeeee4,
  normalMap: torusNormalMap,
  map: uvMap,
});
const tourous = new THREE.Mesh(torousGeometry, torousMaterial);

const sphereGeo = new THREE.SphereGeometry(1, 64, 64);

let sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  normalMap: sphereNormalMap,
  shininess: 0,
  displacementMap: sphereDisplacementMap,
  displacementScale: 0.1,
  map: sphereImageMap,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
sphere.position.set(-3, 0, 0);

const dodecahedronGeo = new THREE.DodecahedronGeometry(1);
let dodecahedronMaterial = new THREE.MeshNormalMaterial({
  color: 0xeeeee4,
  normalMap: dodecahedronNormalMap,
});
const dodecahedron = new THREE.Mesh(dodecahedronGeo, dodecahedronMaterial);
dodecahedron.position.set(3, 0, 0);

let floorGeometry = new THREE.BoxGeometry(9, 1, 9);
let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, material);
floor.position.set(0, -1.5, 0);

//texure

// Mesh
scene.add(sphere);
scene.add(dodecahedron);
scene.add(tourous);
scene.add(floor);

// var geo = new THREE.EdgesGeometry(sphere.geometry); // or WireframeGeometry
// var mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
// var wireframe = new THREE.LineSegments(geo, mat);
// sphere.add(wireframe);

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

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 1;
pointLight.position.y = 2;
pointLight.position.z = 10;
scene.add(pointLight);
pointLight;

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
gui.add(dodecahedronMaterial, "wireframe").onChange(function (val) {
  if (val === true) {
    dodecahedronMaterial.wireframe = true;
    sphereMaterial.wireframe = true;
    torousMaterial.wireframe = true;
  } else {
    dodecahedronMaterial.wireframe = false;
    sphereMaterial.wireframe = false;
    torousMaterial.wireframe = false;
  }
});
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.5 * elapsedTime;
  dodecahedron.rotation.y = 0.5 * elapsedTime;
  tourous.rotation.y = 0.5 * elapsedTime;

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
