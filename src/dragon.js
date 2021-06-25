import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer;
// 移動用オブジェクト
let fbx;
// 座標リスト
let points = [];
// 半径
const radius = 200;

// 円形に360分割した点を格納
for (let index = 0; index <= 360; index++) {
    var rad = (index * Math.PI) / 180;
    var x = radius * Math.cos(rad);
    var z = radius * Math.sin(rad);
    points.push(new THREE.Vector3(x, 0, z));
}

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

    const bgTexture = textureLoader.load("../three-fbx-sample/assets/Dungeon.png")
    scene.background = bgTexture

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

    loader.load('../three-fbx-sample/models/fbx/Dragon.fbx', function (object) {
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

// フレーム毎に更新します。
function update() {
    requestAnimationFrame(update);
    // フレーム数をインクリメント
    frame++;
    // もしフレーム数が360以上であれば0に戻す
    if (frame > 359) frame = 0;
    // ドラゴンの位置を修正
    if (fbx) {
        let normal = getNormal(points[frame], points[frame + 1])
        fbx.position.copy(points[frame]);
        fbx.up.set(normal.x, normal.y, normal.z)
        fbx.lookAt(points[frame + 1])
    }
    renderer.render(scene, camera);
}

// 現在位置と次フレームの位置から法線を算出します。
function getNormal(currentPoint, nextPoint) {
    var vAB = nextPoint
        .clone()
        .sub(currentPoint)
        .normalize();
    var vAZ = new THREE.Vector3(0, 0, 1);
    // 法線ベクトルがプラスを向くよう調整
    var normalVec = currentPoint.z >= 0 ? vAB.cross(vAZ) : vAZ.cross(vAB);
    return normalVec;
}

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

    stats.update();
}