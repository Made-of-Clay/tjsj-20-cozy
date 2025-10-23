import { AxesHelper, GridHelper, PCFSoftShadowMap, Scene, WebGLRenderer } from 'three';
import Stats from 'stats.js';
import { resizeRendererToDisplaySize } from './helpers/responsiveness';
import './style.css';
import { getLights } from './getLights';
import { getGui } from './getGui';
import { getRoom } from './getRoom';
import { Camera, DevCamera } from './getCamera';
import { Background } from './getBackground';

const gui = getGui();

// ===== 🖼️ CANVAS, RENDERER, & SCENE =====
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const scene = new Scene();

const { ambientLight, pointLight, pointLightHelper } = getLights();
scene.add(ambientLight, pointLight, pointLightHelper);

const camera = new Camera(canvas);

// ===== 🪄 HELPERS =====
const axesHelper = new AxesHelper(4);
axesHelper.visible = false;
scene.add(axesHelper);

const gridHelper = new GridHelper(20, 20, 'teal', 'darkgray');
gridHelper.position.y = -0.01;
gridHelper.visible = false;
scene.add(gridHelper);

gui.add(gridHelper, 'visible').name('Grid Visibility');

// ===== 📈 STATS & CLOCK =====
// const clock = new Clock();
const stats = new Stats();
document.body.appendChild(stats.dom);

// ==== 🐞 DEBUG GUI ====
const helpersFolder = gui.addFolder('Helpers');
gui.addFolder('Helpers');
helpersFolder.add(axesHelper, 'visible').name('axes');
helpersFolder.add(pointLightHelper, 'visible').name('pointLight');

// Objects
const room = await getRoom();
scene.add(room);

// reset GUI state button
function resetGui() {
    localStorage.removeItem('guiState');
    gui.reset();
}
gui.add({ resetGui }, 'resetGui').name('RESET');

// gui.close();

// deep_space_skybox
const background = new Background();
background.init().then(() => background.object && scene.add(background.object));

const devCamera = new DevCamera(canvas);

const useDevCamera = false;

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    if (useDevCamera) {
        renderer.render(scene, devCamera.camera);
        devCamera.tick();
    } else {
        if (resizeRendererToDisplaySize(renderer)) {
            camera.updateAspect(renderer.domElement.clientWidth / renderer.domElement.clientHeight);
        }

        camera.tick();
        background.tick();

        renderer.render(scene, camera.perspective);
    }
    stats.end();
}

animate();
