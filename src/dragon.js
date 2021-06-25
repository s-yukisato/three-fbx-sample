import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;

let fbx;

let degree = 0;

function calcObjPos(radius, degree, speed) {
    let sp = speed || 1.0;
    const rad = (degree * sp) * Math.PI / 180;
    const x = radius * Math.sin(rad);// X座標 = 半径 x Sinθ
    const y = radius * Math.cos(rad);// Y座標 = 半径 x Cosθ

    return { 'x': x, 'y': y };
}

init();
rotate()
animate();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(200, 300, 600);

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

    loader.load('..three-fbx-sample/models/fbx/Dragon.fbx', function (object) {
        fbx = object;
        mixer = new THREE.AnimationMixer(fbx);

        const action = mixer.clipAction(fbx.animations[0]);
        action.play();

        fbx.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

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

function rotate() {
    requestAnimationFrame(rotate);
    if (fbx) {
        degree++;
        const pos = calcObjPos(200, degree);
        const lookPos = calcObjPos(230, degree);
        fbx.position.set(pos['y'], 0, pos['x']);
        fbx.lookAt(new THREE.Vector3(lookPos['y'], 0, lookPos['x']))
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