import * as THREE from "three";

const TextureLoader = new THREE.TextureLoader();

let golfBallNormalMap = TextureLoader.load(
  "/normalMaps/golf-ball-bump-map.jpeg"
);
let uvMap = TextureLoader.load("/imageMaps/uv-map.jpeg");

let sphereNormalMap = TextureLoader.load("/normalMaps/normal-map-world.jpeg");
let sphereImageMap = TextureLoader.load("/imageMap/earth-image-map.jpeg");
let sphereDisplacementMap = TextureLoader.load(
  "/imageMap/earth-displacement-map.jpg"
);
let earthLights = TextureLoader.load("/imageMap/earth_lights_2048.png");
const sphereUvs = [
  {
    sphere: new THREE.MeshPhysicalMaterial({
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 1.0,
      normalMap: golfBallNormalMap,

      clearcoatNormalScale: new THREE.Vector2(2.0, -2.0),
    }),
  },
  {
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
    sphere: new THREE.MeshStandardMaterial({
      normalMap: uvMap,
    }),
  },
];

export function randomSpheres() {
  let sphereUv;
  sphereUv = sphereUvs[Math.floor(Math.random() * sphereUvs.length)];
  return sphereUv;
}
