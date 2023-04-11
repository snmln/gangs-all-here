import * as THREE from "three";

const TextureLoader = new THREE.TextureLoader();

let golfBallNormalMap = TextureLoader.load(
  "/normalMaps/golf-ball-bump-map.jpeg"
);
let uvMap = TextureLoader.load("/imageMap/uv-map.png");

let sphereNormalMap = TextureLoader.load("/normalMaps/normal-map-world.jpeg");
let sphereImageMap = TextureLoader.load("/imageMap/earth-image-map.jpeg");
let sphereDisplacementMap = TextureLoader.load(
  "/imageMap/earth-displacement-map.jpg"
);
let earthLights = TextureLoader.load("/imageMap/earth_lights_2048.png");
const cubeLoader = new THREE.CubeTextureLoader();
cubeLoader.setPath("imageMap/Bridge/");

let textureCube = cubeLoader.load([
  "posx.jpeg",
  "negx.jpeg",
  "posy.jpeg",
  "negy.jpeg",
  "posz.jpeg",
  "negz.jpeg",
]);

const sphereUvs = [
  {
    uv: "golf ball",
    sphere: new THREE.MeshPhysicalMaterial({
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 1.0,
      normalMap: golfBallNormalMap,
      clearcoatNormalScale: new THREE.Vector2(2.0, -2.0),
    }),
  },
  {
    uv: "earth night",
    sphere: new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      transparent: false,
      depthTest: false,
      map: earthLights,
      normalMap: sphereNormalMap,
      displacementMap: sphereDisplacementMap,
      displacementScale: 0.1,
      map: sphereImageMap,
    }),
  },
  {
    uv: "uv map",
    sphere: new THREE.MeshLambertMaterial({
      map: uvMap,
    }),
  },
  {
    uv: "texture cube",
    sphere: new THREE.MeshBasicMaterial({ envMap: textureCube }),
    scene: textureCube,
  },
];

export function randomSpheres() {
  console.log("first run", sphereUv);
  const sphereUv = sphereUvs[Math.floor(Math.random() * sphereUvs.length)];
  console.log("second run", sphereUv);

  return sphereUv;
}
