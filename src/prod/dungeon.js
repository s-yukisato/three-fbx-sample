import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let camera, scene, renderer;

const clock = new THREE.Clock();
let ball, front;
let mixer;
// 移動用オブジェクト
let monk;
let run, attack;

init()
update()

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // シーンを作成
    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x000000, 50, 2000);

    // カメラを作成
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    // カメラの初期座標を設定
    camera.position.set(0, 200, 1000);

    // カメラコントローラーを作成
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.update();

    const loader = new FBXLoader();
    loader.load('../../three-fbx-sample/models/fbx/Monk.fbx', function (object) {
        monk = object;
        mixer.monk = new THREE.AnimationMixer(monk);

        const texture = textureLoader.load('../../three-fbx-sample/models/texture/Monk_Texture.png');
        attack = monk.animations[0]
        run = monk.animations[10]
        const action = mixer.monk.clipAction(run);
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


    // テクスチャー読み込み
    var textureLoader = new THREE.TextureLoader();
    // 地面用
    let texture = textureLoader.load("https://s-yukisato.github.io/img/ground.jpg")
    let mat = new THREE.MeshPhongMaterial();
    mat.map = texture;
    // bump
    let bump = textureLoader.load('https://s-yukisato.github.io/img/ground-bump.jpg');
    mat.bumpMap = bump;
    mat.bumpScale = 0.4;

    // 地面用2
    let texture1 = textureLoader.load("https://s-yukisato.github.io/img/tone.jpg")
    let mat1 = new THREE.MeshPhongMaterial();
    mat1.map = texture1;
    // bump
    let bump1 = textureLoader.load('https://s-yukisato.github.io/img/tone-bump.jpg');
    mat1.bumpMap = bump1;
    mat1.bumpScale = 0.4;

    let texture2 = textureLoader.load("https://s-yukisato.github.io/img/brick.jpg")
    let mat2 = new THREE.MeshPhongMaterial();
    mat2.map = texture2;
    // bump
    let bump2 = textureLoader.load('https://s-yukisato.github.io/img/brick-bump.jpg');
    mat2.bumpMap = bump2;
    mat2.bumpScale = 0.4;

    // 階段用
    let texture_stairs = textureLoader.load("https://s-yukisato.github.io/img/concrete.jpg")
    let mat_s = new THREE.MeshPhongMaterial();
    mat_s.map = texture_stairs;
    // bump
    let bump_stairs = textureLoader.load('https://s-yukisato.github.io/img/concrete-bump.jpg');
    mat_s.bumpMap = bump_stairs;
    mat_s.bumpScale = 0.3;

    let texture_tobira = textureLoader.load("https://s-yukisato.github.io/img/tobira.jpg")
    let mat_t = new THREE.MeshPhongMaterial();
    mat_t.map = texture_tobira;

    var texture_wood = textureLoader.load('https://s-yukisato.github.io/img/wood.jpg');
    var mat_w = new THREE.MeshPhongMaterial();
    mat_w.map = texture_wood;

    // normal
    let normal_w = textureLoader.load('https://s-yukisato.github.io/img/wood-nor.jpg');
    mat_w.normalMap = normal_w;
    mat_w.normalScale = new THREE.Vector2(1, -1)


    // 床
    scene.add(createFloor(mat1, 400, 150, -900))
    scene.add(createFloor(mat1, 400, 150, -500))

    scene.add(createFloor(mat1, 0, 150, -900))
    scene.add(createFloor(mat1, 0, 150, -500))
    scene.add(createFloor(mat1, 0, 150, -100))
    scene.add(createFloor(mat, 0, 0, 400))
    scene.add(createFloor(mat, 0, 0, 800))
    scene.add(createFloor(mat, 0, 0, 1200))


    // 正面壁
    front = createWall(mat_t, 0, 0, 200, 300)
    scene.add(front)
    scene.add(createWall(mat2, 0, 0, 350, -1000))
    scene.add(createWall(mat2, 0, 400, 350, -1000))
    // 左壁
    scene.add(createWall(mat2, 0.5, -200, 350, -1200))
    scene.add(createWall(mat2, 0.5, -200, 350, -800))
    scene.add(createWall(mat2, 0.5, -200, 350, -400))

    scene.add(createWall(mat2, 0.5, -200, 200, 0))
    scene.add(createWall(mat_w, 0.5, -200, 200, 400))
    scene.add(createWall(mat_w, 0.5, -200, 200, 800))
    // 右回転
    scene.add(createWall(mat2, -0.5, 600, 350, -800))
    // wall = createWall(mat2, -0.5, 210, 350, -800)
    // scene.add(wall)
    scene.add(createWall(mat2, -0.5, 200, 350, -400))

    scene.add(createWall(mat2, -0.5, 200, 200, 0))
    scene.add(createWall(mat_w, -0.5, 200, 200, 400))
    scene.add(createWall(mat_w, -0.5, 200, 200, 800))


    // 宝箱をスプライトで作成
    var texture0 = textureLoader.load("https://s-yukisato.github.io/img/silver_treasure_illust_1995.png");
    const material0 = new THREE.SpriteMaterial({ map: texture0 });

    const sprite = new THREE.Sprite(material0);
    sprite.position.x = 450;
    sprite.position.y = 240;
    sprite.position.z = -800;
    sprite.scale.set(200, 200, 200);
    scene.add(sprite);

    // 街灯をスプライトで作成
    var texture_light = textureLoader.load("https://s-yukisato.github.io/img/light.png");
    const material_light = new THREE.SpriteMaterial({ map: texture_light });

    function strite_light(x, y, z) {
        const sprite_light = new THREE.Sprite(material_light);
        sprite_light.position.set(x, y, z)
        sprite_light.scale.set(200, 200, 200);
        return sprite_light
    }
    scene.add(strite_light(-200, 240, -100));
    scene.add(strite_light(200, 240, -100));
    scene.add(strite_light(-200, 240, -300));
    scene.add(strite_light(200, 240, -300));

    let texture_ = textureLoader.load("https://s-yukisato.github.io/img/stone.jpg")
    let mat_ = new THREE.MeshPhongMaterial();
    mat_.map = texture_;

    var texture_block = textureLoader.load('https://s-yukisato.github.io/img/block.jpg');
    var mat_b = new THREE.MeshPhongMaterial();
    mat_b.map = texture_block;

    // normal
    let normal = textureLoader.load('https://s-yukisato.github.io/img/block-normal.jpg');
    mat_b.normalMap = normal;
    mat_b.normalScale = new THREE.Vector2(1, -1)

    // 球を作成(原点に作成)
    var geometry = new THREE.SphereGeometry(200, 32, 32);
    ball = new THREE.Mesh(geometry, mat_b);
    ball.position.set(0, 350, -1000)
    scene.add(ball);


    // 箱を作成(階段用)
    var geometry = new THREE.BoxGeometry(50, 50, 50);

    for (let z = 125; z <= 225; z += 50) {
        let y = 0;
        if (z == 125) y = 125
        else if (z == 175) y = 75
        else if (z == 225) y = 25
        for (let x = -175; x <= 175; x += 50) {
            var box = new THREE.Mesh(geometry, mat_s)
            box.position.x = x
            box.position.y = y
            box.position.z = z
            scene.add(box)
        }
    }

    light(100, 100, 100)
    light(-100, 100, 100)
    light(100, -100, -100)
    light(-100, -100, -100)

    function light(x, y, z) {
        // 平行光源
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(x, y, z);
        // シーンに追加
        scene.add(directionalLight);
    }

    const bgTexture = textureLoader.load("https://s-yukisato.github.io/img/d.png")
    scene.background = bgTexture
}

function createPlane(mat, width = 400, height = 400, color = 0xcccccc) {
    const planeGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    const planeMaterial = new THREE.MeshPhongMaterial({ color });
    const plane = new THREE.Mesh(planeGeometry, mat);
    return plane;
}

function createFloor(mat, p_x, p_y, p_z) {
    // floor
    const plane = createPlane(mat)
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = p_x;
    plane.position.y = p_y;
    plane.position.z = p_z;
    return plane
}

function createWall(mat, r_y, p_x, p_y, p_z) {
    const plane = createPlane(mat)
    plane.rotation.y = r_y * Math.PI;
    plane.position.x = p_x;
    plane.position.y = p_y;
    plane.position.z = p_z;
    return plane
}

// 初回実行
function update() {
    requestAnimationFrame(update);
    // orbitcontrols使ったらアニメーション停止
    if (camera.position.x != 0) {

    } else {
        const delta = clock.getDelta();
        if (ball.position.z < 100) {
            ball.rotation.x += 0.02
            ball.position.z += 3
        } else if (ball.position.z < 300) {
            ball.rotation.x += 0.03
            ball.position.z += 3
            ball.position.y -= 2
        } else if (ball.position.z < 450) {
            ball.rotation.x += 0.05
            ball.position.z += 5
        } else {
            ball.position.set(-400, 500, -300)
            if (mixer) {
                mixer.uncacheAction(run)
                mixer.clipAction(attack).play();
                mixer.update(delta);
            }
            
        }

        if (camera.rotation.y < -1.10) {
            // wall.position.z += 3
        } else if (camera.position.z < -600) {
            camera.rotation.y -= 0.005
            camera.rotation.z -= 0.001
        } else if (front.position.x > 400) {
            if (ball.position.z < 320) {
                camera.position.z += 5
                if (mixer) mixer.update(delta);
                if(monk) monk.position.z -= 3
            } else if (ball.position.y > -1500) {
                camera.position.z -= 3
            } else if (camera.position.y < 300) {
                camera.rotation.x -= 0.005
                camera.position.y += 2
                camera.position.z -= 2
            } else {
                camera.position.z -= 3
            }
        } else if (camera.position.z < 600) {
            if (camera.rotation.x > 0.03) {
                front.position.x += 3
                front.rotation.y -= 0.01
            } else {
                camera.rotation.x += 0.005
            }
        } else camera.position.z -= 3
    }

    renderer.render(scene, camera);
};

// function animate() {

//     requestAnimationFrame(animate);

//     const delta = clock.getDelta();

//     if (mixer) mixer.update(delta);

//     renderer.render(scene, camera);
// }