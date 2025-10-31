import { AxesHelper, EquirectangularReflectionMapping, GridHelper, MeshPhysicalMaterial, MeshStandardMaterial, PCFSoftShadowMap, PMREMGenerator, Scene, WebGLRenderer } from 'three';
import Stats from 'stats.js';
import { resizeRendererToDisplaySize } from './helpers/responsiveness';
import './style.css';
import { getLights } from './getLights';
import { getGui } from './getGui';
import { getRoom } from './getRoom';
import { Camera, DevCamera } from './getCamera';
import { Background } from './getBackground';
import { getProgress } from './Progress';
import { MusicController } from './MusicController';
import { findDeepMeshChild } from './findDeepMeshChild';

const gui = getGui();

// ===== 🖼️ CANVAS, RENDERER, & SCENE =====
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const scene = new Scene();

const progress = getProgress();
progress.onComplete(() => {
    console.log('All assets loaded!');
    document.getElementById('loader')?.style.setProperty('opacity', '0');
    setTimeout(() => {
        document.getElementById('loader')?.remove();
    }, 3000);
    musicController.play();
});

const musicProgressKey = 'music';
progress.track(musicProgressKey);
const musicController = new MusicController();
musicController.whenLoaded.then(() => {
    console.log('music loaded')
    progress.finish(musicProgressKey);
});

// Handle music toggle
document.querySelector('#toggle-music')?.addEventListener('click', async () => {
    const svg = document.querySelector('#toggle-music svg');
    if (musicController.playing) {
        svg?.setAttribute('style', '--color: red');
        await musicController.pause();
    } else {
        svg?.setAttribute('style', '--color: white');
        await musicController.play();
    }
});

document.querySelector('menu')?.style.setProperty(
    '--vol-fade-rate',
    musicController.volumeFadeRateMs * 0.001 + 's'
);

const lights = getLights();
scene.add(...Object.values(lights).filter(obj => typeof obj !== 'function')/*  as any[] */);

const camera = new Camera(canvas);

// ===== 🪄 HELPERS =====
const helpersFolder = gui.addFolder('Helpers');

const axesHelper = new AxesHelper(4);
axesHelper.visible = false;
scene.add(axesHelper);
helpersFolder.add(axesHelper, 'visible').name('axes');

const gridHelper = new GridHelper(20, 20, 'teal', 'darkgray');
gridHelper.position.y = -0.01;
gridHelper.visible = false;
scene.add(gridHelper);
helpersFolder.add(gridHelper, 'visible').name('Grid Visibility');

// ===== 📈 STATS & CLOCK =====
// const clock = new Clock();
const stats = new Stats();
document.body.appendChild(stats.dom);

// Objects
const roomProgressKey = 'room';

progress.track(roomProgressKey);
const pendingRoom = getRoom(scene).then(room => {
    progress.finish(roomProgressKey);
    scene.add(room);
    return room;
});

const backgroundProgressKey = 'background';

progress.track(backgroundProgressKey);
const background = new Background();
const pendingBackground = background.init().then(() => {
    if (background.object) 
        scene.add(background.object)
    progress.finish(backgroundProgressKey);
});

Promise.all([pendingBackground, pendingRoom]).then(([, room]) => {
    // apply deep space image from background to room material.envMap
    const sphere = background.object ? findDeepMeshChild(background.object, 'Sphere_Deep_Space_0') : null;
    const roomMesh = findDeepMeshChild(room, 'Room');
    if (!sphere || !roomMesh)
        return console.warn('Background sphere (1) or room (2) could not be found:', sphere, room);

    // Use PMREM to prefilter the equirectangular map so PBR materials respond properly
    const bgTexture = (sphere.material as MeshPhysicalMaterial).map;
    console.log(bgTexture);
    if (bgTexture) {
        bgTexture.mapping = EquirectangularReflectionMapping;

        const pmrem = new PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const envRenderTarget = pmrem.fromEquirectangular(bgTexture);
        const envMap = envRenderTarget.texture;

        const mat = roomMesh.material as MeshStandardMaterial;
        mat.envMap = envMap;
        mat.envMapIntensity = 0.6;
        mat.metalness = Math.max((mat as any).metalness ?? 0, 0.05);
        mat.roughness = Math.min((mat as any).roughness ?? 1, 0.9);
        mat.needsUpdate = true;

        pmrem.dispose();
    } else {
        console.warn('background texture not found on sphere');
    }
});

const devCamera = new DevCamera(canvas);
const cameraParams = {
    devCamera: false,
};
gui.folders.find(folder => folder._title === 'Camera')
    ?.add(cameraParams, 'devCamera')
    ?.name('Use Dev Camera');

let showingTools = false;
document.querySelector('#toggle-tools')?.addEventListener('click', () => {
    showingTools = !showingTools;
    handleToolDisplay();
});

function handleToolDisplay() {
    if (showingTools) {
        gui.show();
        stats.dom.style.display = 'block';
    } else {
        gui.hide();
        stats.dom.style.display = 'none';
    }
}
handleToolDisplay();

// reset GUI state button
function resetGui() {
    localStorage.removeItem('guiState');
    gui.reset();
}
gui.add({ resetGui }, 'resetGui').name('RESET');

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    if (cameraParams.devCamera) {
        renderer.render(scene, devCamera.camera);
        devCamera.tick();
    } else {
        if (resizeRendererToDisplaySize(renderer)) {
            camera.updateAspect(renderer.domElement.clientWidth / renderer.domElement.clientHeight);
        }

        camera.tick();
        renderer.render(scene, camera.perspective);
    }
    
    background.tick();
    lights.tick();

    stats.end();
}

animate();
