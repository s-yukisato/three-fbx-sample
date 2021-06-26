import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';

window.addEventListener('load', function () {
    init();
});

let scene, camera, renderer;
let controls;
let water;

function init() {
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 3, 100);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //OrbitControls
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    controls = new OrbitControls(camera, renderer.domElement);

    //canvasを作成
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    //ウィンドウのリサイズに対応
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    threeWorld();
    setLight();
    rendering();
}

function threeWorld() {
    //PlaneGeometry
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

    //Water
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('../../three-fbx-sample/assets/Water_1_M_Normal.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            waterColor: 0x3e89ce,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    //シーンに追加
    scene.add(water);
    water.rotation.x = - Math.PI / 2;

    //Sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    //Skyの設定
    const sky_uniforms = sky.material.uniforms;
    sky_uniforms['turbidity'].value = 10;
    sky_uniforms['rayleigh'].value = 2;
    // sky_uniforms['luminance'].value = 1;
    sky_uniforms['mieCoefficient'].value = 0.005;
    sky_uniforms['mieDirectionalG'].value = 0.8;

    //Sun
    const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    scene.add(sunSphere);

    //Sunの設定
    const sun_uniforms = sky.material.uniforms;
    sun_uniforms['turbidity'].value = 10;
    sun_uniforms['rayleigh'].value = 2;
    sun_uniforms['mieCoefficient'].value = 0.005;
    sun_uniforms['mieDirectionalG'].value = 0.8;
    // sun_uniforms['luminance'].value = 1;

    const theta = Math.PI * (-0.01);
    const phi = 2 * Math.PI * (-0.25);
    const distance = 400000;
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = true;
    sun_uniforms['sunPosition'].value.copy(sunSphere.position);
}

function setLight() {
    //環境光
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);
}

function rendering() {
    //アニメーション
    water.material.uniforms['time'].value += 1.0 / 60.0;
    if (controls) controls.update();
    requestAnimationFrame(rendering);
    renderer.render(scene, camera);
}