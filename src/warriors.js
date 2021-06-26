import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer = {};
// 移動用オブジェクト
let warrior, monk, ranger;
// 座標リスト
let warrior_points = calcPoints(350)
let monk_points = calcPoints(250)
let ranger_points = calcPoints(450)

// フレーム数
let frame = 0;

init();
update()
animate();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(200, 300, 600);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xa0a0a0);

    const textureLoader = new THREE.TextureLoader();

    const bgTexture = textureLoader.load("../assets/Dungeon.png")
    scene.background = bgTexture

    // scene.fog = new THREE.Fog(0xa0a0a0, 500, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 980;
    dirLight.shadow.camera.bottom = - 1000;
    dirLight.shadow.camera.left = - 1000;
    dirLight.shadow.camera.right = 1000;
    scene.add(dirLight);

    // helper
    // var directionalLightShadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    // scene.add(directionalLightShadowHelper);

    // var directionalLightHelper = new THREE.DirectionalLightHelper(dirLight);
    // scene.add(directionalLightHelper);

    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
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

    // loader.load('../models/fbx/Warrior_Sword.fbx', function (objecct) {
    //     sword = objecct
    //     const texture = textureLoader.load('../models/texture/Warrior_Sword_Texture.png');

    //     sword.traverse(function (child) {

    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //             child.material.map = texture;
    //         }
    //     });
    //     scene.add(sword);
    // });

    loader.load('../models/fbx/Warrior.fbx', function (object) {
        warrior = object;
        mixer.warrior = new THREE.AnimationMixer(warrior);
        
        const texture = textureLoader.load('../models/texture/Warrior_Texture.png');

        const action = mixer.warrior.clipAction(warrior.animations[2]);
        action.play();

        warrior.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
            }
        });
        scene.add(warrior);
    });

    loader.load('../models/fbx/Monk.fbx', function (object) {
        monk = object;
        mixer.monk = new THREE.AnimationMixer(monk);

        const texture = textureLoader.load('../models/texture/Monk_Texture.png');

        const action = mixer.monk.clipAction(monk.animations[10]);
        action.play();

        monk.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
            }
        });
        scene.add(monk);
    });

    loader.load('../models/fbx/Ranger.fbx', function (object) {
        ranger = object;
        mixer.ranger = new THREE.AnimationMixer(ranger);
        
        const texture = textureLoader.load('../models/texture/Ranger_Texture.png');

        const action = mixer.ranger.clipAction(ranger.animations[8]);
        action.play();

        ranger.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
            }
        });
        scene.add(ranger);
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

// フレーム毎に更新します。
function update() {
    requestAnimationFrame(update);
    // フレーム数をインクリメント
    frame++;
    // もしフレーム数が360以上であれば0に戻す
    if (frame > 359) frame = 0;
    // ドラゴンの位置を修正
    if (warrior) {
        let normal = getNormal(warrior_points[frame + 30], warrior_points[frame + 31])
        warrior.position.copy(warrior_points[frame + 30]);
        warrior.up.set(normal.x, normal.y, normal.z)
        warrior.lookAt(warrior_points[frame + 31])
    }
    if (monk) {
        let normal = getNormal(monk_points[frame], monk_points[frame + 1])
        monk.position.copy(monk_points[frame]);
        monk.up.set(normal.x, normal.y, normal.z)
        monk.lookAt(monk_points[frame + 1])
    }
    if (ranger) {
        let normal = getNormal(ranger_points[frame + 10], ranger_points[frame + 11])
        ranger.position.copy(ranger_points[frame + 10]);
        ranger.up.set(normal.x, normal.y, normal.z)
        ranger.lookAt(ranger_points[frame + 11])
    }
    renderer.render(scene, camera);
}

function calcPoints(radius) {
    let points = [];
    // 円形に360分割した点を格納
    for (let index = 0; index <= 390; index++) {
        var rad = (index * Math.PI) / 180;
        var x = radius * Math.cos(rad);
        var z = radius * Math.sin(rad);
        points.push(new THREE.Vector3(x, 0, z));
    }
    return points;
}

// 現在位置と次フレームの位置から法線を算出します。
function getNormal(currentPoint, nextPoint) {
    var vAB = nextPoint
        .clone()
        .sub(currentPoint)
        .normalize();
    var vAZ = new THREE.Vector3(0, 0, 1);
    // 法線ベクトルが常にプラスを向くよう調整
    var normalVec = nextPoint.z >= 0 ? vAB.cross(vAZ) : vAZ.cross(vAB);
    return normalVec;
}

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer.warrior) mixer.warrior.update(delta);
    if (mixer.monk) mixer.monk.update(delta);
    if (mixer.ranger) mixer.ranger.update(delta);

    renderer.render(scene, camera);

    stats.update();
}