import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;

let fbx, run, attack;

init();
moveForward()
animate();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // model
    const loader = new FBXLoader();

    loader.load('../models/fbx/Monk.fbx', function (object) {

        fbx = object;
        mixer = new THREE.AnimationMixer(fbx);
        run = object.animations[4];
        attack = object.animations[6];
        
        const action = mixer.clipAction(run);
        action.play();

        // テクスチャー読み込み
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../models/texture/Monk_Texture.png');

        fbx.position.z = -200

        fbx.traverse(function (child) {

            if (child.isMesh) {
                
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;

            }

        });

        scene.add(fbx);

    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function moveForward() {
    requestAnimationFrame(moveForward);
    if(fbx){
        if(fbx.position.z == -10) {
            mixer.uncacheAction(run)
            mixer.clipAction(attack).play();
        } else {
            fbx.position.z += 5
        }
    }

    renderer.render(scene, camera);
}

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

    stats.update();

}