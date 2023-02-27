import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

// Objects
const torousGeometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
let torousMaterial = new THREE.MeshBasicMaterial({color: 0xeeeee4});
const tourous = new THREE.Mesh(torousGeometry, torousMaterial)

    let floorGeometry = new THREE.BoxGeometry(50, 1, 50);
    let material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const floor = new THREE.Mesh( floorGeometry, material );
    floor.position.set(0, -1.5, 0);

// Mesh
scene.add(tourous)
scene.add(floor);

const sizes = {
    //This is not dynamic we will have to establish an event listener to listen for 
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
//this camera we are establishing is what ALL our view will go through. 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
//We need to instantiate an instance of WEBGL to render all of our elements. 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
   
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)
