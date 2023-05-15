import "./style.css";
import * as THREE from "three";

// Establishing Canvas
const canvas = document.querySelector("canvas.webgl");
// Establishing Scene
const scene = new THREE.Scene();

// Establishing Objects
const torousGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
let torousMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeee4 });
const tourous = new THREE.Mesh(torousGeometry, torousMaterial);

let floorGeometry = new THREE.BoxGeometry(50, 1, 50);
let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const floor = new THREE.Mesh(floorGeometry, material);
floor.position.set(0, -1.5, 0);

// Addng objects to scene
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

/**
 * Renderer
 */
//We need to instantiate an instance of WEBGL to render all of our elements through it.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
