import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;

let fbx;

let map, mesh_;

init();
animate();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(200, 300, 600);

    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    const bgTexture = textureLoader.load("../../three-fbx-sample/assets/Dungeon.png")
    scene.background = bgTexture


    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 980;
    dirLight.shadow.camera.bottom = - 500;
    dirLight.shadow.camera.left = - 500;
    dirLight.shadow.camera.right = 500;
    scene.add(dirLight);

    const map_ground = textureLoader.load("../../three-fbx-sample/models/texture/magma.png")
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000, 64, 64),
        new THREE.MeshLambertMaterial({ map: map_ground })
    );

    ground.rotation.x = Math.PI / -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // model
    const loader = new FBXLoader();

    loader.load('../models/fbx/Dragon.fbx', function (object) {
        fbx = object;
        mixer = new THREE.AnimationMixer(fbx);

        const action = mixer.clipAction(fbx.animations[4]);
        action.play();

        fbx.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        scene.add(fbx);

    });

    // テクスチャーを読み込みます。
    map = textureLoader.load('../models/texture/Thunder.jpg');

    // テクスチャーをあてた球のMeshを作成します。
    mesh_ = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 32),
        new THREE.MeshBasicMaterial({ map: map })
    );

    mesh_.position.set(0, 305, 180)
    mesh_.castShadow = true;

    // 縦横でリピートするように設定します。
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    scene.add(mesh_)

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

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (map) {
        map.offset.x += 0.005;
        map.offset.y += 0.005;
        map.offset.z += 0.01;
    }
    if (mesh_) {
        if (mesh_.position.y < 170) {
            mesh_.position.y = 270;
            mesh_.position.z = 170;
            mesh_.scale.set(1, 1, 1)
        }
        mesh_.position.y -= 1
        mesh_.position.z += 2
        mesh_.scale.x += 0.015
        mesh_.scale.y += 0.015
        mesh_.scale.z += 0.015
    }

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

    stats.update();
}