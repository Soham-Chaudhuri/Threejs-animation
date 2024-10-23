import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// import { RGBELoader } from 'three/examples/jsm/Addons.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


const loader = new GLTFLoader();
let mixer;
let actions = [];
let currentActionIndex = 0;

loader.load('./assets/animated_triceratops_skeleton.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Initialize AnimationMixer
    mixer = new THREE.AnimationMixer(model);

    // Create and store animation actions
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        actions.push(action);
    });

    // Start playing animations sequentially
    playAnimationSequence();

    // Add event listener for when an animation finishes
    mixer.addEventListener('finished', () => {
        currentActionIndex++;
        if (currentActionIndex < actions.length) {
            playAnimationSequence();
        } else {
            currentActionIndex = 0; // Reset to start if needed
            playAnimationSequence(); // Loop through animations
        }
    });
});

// Function to play the current animation
function playAnimationSequence() {
    if (actions[currentActionIndex]) {
        actions[currentActionIndex].reset();
        actions[currentActionIndex].setLoop(THREE.LoopOnce); // Play once
        actions[currentActionIndex].play();
    }
}

const ambienceLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambienceLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

camera.position.set(0, 5, 10);
const canvas = document.querySelector('#canvas' );
const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );


const controls = new OrbitControls( camera, renderer.domElement );
// controls.autoRotate = true;
// controls.enableRotate = true;
// controls.autoRotateSpeed = 200;
controls.enableDamping = true;
controls.dampingFactor =0.45;
function animate() {
  window.requestAnimationFrame(animate);
  controls.update();
  const delta = clock.getDelta();
  if(mixer)
  mixer.update(delta);
	renderer.render( scene, camera );

}
const clock = new THREE.Clock();
animate();




//blending animations
//crossfade animations
//animation controls
//event triggers