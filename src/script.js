import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { randomSpheres, sphereUvs } from "./spheres";
// Canvas
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
const atmosphereFragment = `
varying vec3 vertexNormal;

void main(){
  float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0,0.0,1.0)),2.0);
 gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}`;

const atmosphereVertex = `
varying vec3 vertexNormal;

void main(){
  vertexNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;
const sphereGeo = new THREE.SphereGeometry(3, 64, 64);

const atmosphereShader = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertex,
  fragmentShader: atmosphereFragment,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});
const atmosphere = new THREE.Mesh(sphereGeo, atmosphereShader);
atmosphere.scale.set(1.2, 1.2, 1.2);
atmosphere.position.set(0.5, 0, 0);

let sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  normalMap: sphereNormalMap,
  shininess: 0,
  displacementMap: sphereDisplacementMap,
  displacementScale: 0.1,
  map: sphereImageMap,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);

//add pin
scene.add(atmosphere);
const pin = new THREE.Mesh(
  new THREE.SphereGeometry(0.035, 20, 30),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const pinTwo = new THREE.Mesh(
  new THREE.SphereGeometry(0.035, 20, 30),
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
const tubeFragment = `
varying vec2 vertexUV; 
void main(){
    gl_FragColor = vec4(vertexUV.x,0.,0.0,1.);
}`;

const tubeVertex = `
varying vec2 vertexUV; 
void main(){
  vertexUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix *vec4(position,1);
}`;

const materialShader = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
  },
  vertexShader: tubeVertex,
  fragmentShader: tubeFragment,
});

function convertLongLatToCartesian(longitude, lattitude) {
  let radius = 3.1;
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
const group = new THREE.Group();

getCurve(position, position2);

function getCurve(p1, p2) {
  let v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
  let v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

  let points = [];

  for (let i = 0; i < 20; i++) {
    let p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);

    p.multiplyScalar(1 + 0.1 * Math.sin((Math.PI * i) / 20));
    points.push(p);
  }

  let path = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.TubeGeometry(path, 20, 0.01, 8, false);
  const material = materialShader;
  const tubeMesh = new THREE.Mesh(geometry, material);
  tubeMesh.name = "tubeMesh";
  group.add(tubeMesh);
}
pin.name = "pin";
pinTwo.name = "pinTwo";

group.add(sphere);
group.add(pin);
group.add(pinTwo);
scene.add(group);
const sizes = {
  //This is not dynamic we will have to establish an event listener to listen for
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera

const canvasContainer = document.querySelector("#canvasContainer");

//this camera we are establishing is what ALL our view will go through.
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(-4, 0, 7);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(-10, 0, 10);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5);
pointLight2.position.set(0, 10, 0);
scene.add(pointLight2);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starVert = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 3000 - 50;
  starVert.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVert, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);

const highestLevelGroup = new THREE.Group();

highestLevelGroup.add(group);
highestLevelGroup.add(stars);

scene.add(highestLevelGroup);
const clock = new THREE.Clock();
const mouse = {
  x: undefined,
  y: undefined,
};
function setCameraPosition() {
  if (screen.width < 640) {
    camera.position.set(0, 4, 7);
    atmosphere.position.set(0, -0.5, 0);
  } else if (screen.width > 640) {
    camera.position.set(-4, 0, 7);
    atmosphere.position.set(0.5, 0, 0);
  }
}

function animate() {
  const elapsedTime = clock.getElapsedTime();
  setCameraPosition();
  group.rotation.y = 0.05 * elapsedTime;
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setCameraPosition();
  });
  window.requestAnimationFrame(animate);
  // controls.update();
  highestLevelGroup.rotation.y = mouse.x * 0.2;
  highestLevelGroup.rotation.x = mouse.y * 0.2;
  renderer.render(scene, camera);
}

addEventListener("mousemove", () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});

animate();

document.getElementById("wireFrameButton").onclick = function () {
  sphere.material.wireframe = !sphere.material.wireframe;
  sphereMaterial.wireframeLinewidth = 3;
  // atmosphereShader.wireframe = !atmosphereShader.wireframe;
  atmosphereShader.visible = !atmosphereShader.visible;
};

document.getElementById("revertToEarth").onclick = function () {
  sphere.material = sphereMaterial;
  atmosphereShader.visible = true;
  sphere.material.wireframe = false;
  scene.getObjectByName("tubeMesh").visible = true;
  pin.material.visible = true;
  pinTwo.material.visible = true;
};

document.getElementById("randomize").onclick = function () {
  pin.material.visible = false;
  pinTwo.material.visible = false;

  let randomizeSphere = randomSpheres(sphereUvs);
  if (randomizeSphere === "texture cube") {
    scene.background = randomizeSphere.scene;
    sphere.material = randomizeSphere.sphere;
  } else {
    sphere.material = randomizeSphere.sphere;
  }
  // sphere.material = randomSpheres().sphere;
  window.requestAnimationFrame(animate);
  scene.getObjectByName("tubeMesh").visible = false;
};
