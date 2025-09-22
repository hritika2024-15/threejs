import "./style.css";
import gsap from 'gsap';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


// Get the canvas element
const canvas = document.getElementById('canvas');


// Make the canvas resize responsively with the window
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  // If you have a camera, update its aspect ratio here
  if (typeof camera !== "undefined" && camera.isCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', onWindowResize);



// Create the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;

function throttleWheelHandler(event){
 
  const currentTime = Date.now();
if(currentTime - lastWheelTime >= throttleDelay){
  
  lastWheelTime = currentTime;
const direction = event.deltaY>0?"down" : "up";

scrollCount = (scrollCount + 1) % 4;


const headings = document.querySelectorAll(".heading");
gsap.to(headings,{
  duration:1,
  y: `-=${100}%`,
  ease: "power2.inOut",
});

gsap.to(spheres.rotation,{
  duration: 1,
  y: `-=${Math.PI/2}%`,
  ease: "power2.inOut",

});

if(scrollCount===0){
  gsap.to(headings,{
    duration:1,
    y: `0`,
    ease: "power2.inOut",
  });
}
}
}

window.addEventListener('wheel',throttleWheelHandler);



// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, -.25, 9);

// Create a big sphere with a star texture
const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load('./stars.jpg'); // Make sure this file exists
starTexture.colorSpace = THREE.SRGBColorSpace;

const bigSphereGeometry = new THREE.SphereGeometry(10, 128, 128);
const bigSphereMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  side: THREE.BackSide // Render inside of sphere for skybox effect
});
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);


const spheresMesh = [];



const radius=1.3;
const segments=64;
const colors=[0x00ff00,0x0000ff,0xff0000,0xffff00];
const spheres = new THREE.Group();
const textures = ["./csilla/color.png","./earth/map.jpg","./venus/map.jpg","./volcanic/color.png"];
const orbitRadius=4.5;

for(let i=0;i<4;i++){
  const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(textures[i]);
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.SphereGeometry(radius, segments, segments);
const material = new THREE.MeshStandardMaterial({ map: texture});
const sphere = new THREE.Mesh(geometry, material);

spheresMesh.push(sphere);


// material.needsUpdate = true;


const angle = (i/4) * (Math.PI * 2);
sphere.position.x = orbitRadius* Math.cos(angle);
sphere.position.z = orbitRadius* Math.sin(angle);

spheres.add(sphere);
}
spheres.rotation.x = 0.1;
spheres.position.y = -1;

scene.add(spheres);

// setInterval(()=>{
//   gsap.to(spheres.rotation,{
//   y:`+=${Math.PI/2}`,
//   duration:2,
//   ease:"expo.easeInOut",
// });
// },2500);

// Add a light
// Load an HDRI environment map for realistic lighting
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/light.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
 
}, undefined, function(error) {
  console.error('Failed to load HDRI', error);
});

// Fallback lights so MeshStandardMaterial renders even if HDR fails
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
// dirLight.position.set(5, 5, 5);
// scene.add(dirLight);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  for(let i=0;i<spheresMesh.length;i++){
    const sphere = spheresMesh[i];
    sphere.rotation.y = clock.getElapsedTime()*0.02;
  }
  renderer.render(scene, camera);
}
animate();


