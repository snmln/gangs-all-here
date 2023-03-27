import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();

// Objects
const torousGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
let torousMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeee4 });
const tourous = new THREE.Mesh(torousGeometry, torousMaterial);

const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeee4 });
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
sphere.position.set(-3, 0, 0);

const dodecahedronGeo = new THREE.DodecahedronGeometry(1);
let dodecahedronMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeee4 });
const dodecahedron = new THREE.Mesh(dodecahedronGeo, dodecahedronMaterial);
dodecahedron.position.set(3, 0, 0);

let floorGeometry = new THREE.BoxGeometry(9, 1, 9);
let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, material);
floor.position.set(0, -1.5, 0);

// Mesh
scene.add(sphere);
scene.add(dodecahedron);
scene.add(tourous);
scene.add(floor);

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
camera.position.z = 2;
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

const backLight = new THREE.PointLight(0xffffff, 1);
backLight.position.x = 3;
backLight.position.y = 2;
backLight.position.z = -10;
scene.add(backLight);

/* Orbit contorls */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
//We need to instantiate an instance of WEBGL to render all of our elements.

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
