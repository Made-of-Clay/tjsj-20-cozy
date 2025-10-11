import { PerspectiveCamera } from 'three';
import { getGui } from './getGui';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const gui = getGui();
let cameraFolder: GUI;

export class Camera {
    perspective: PerspectiveCamera;
    #initialYRotation = 0;

    constructor(renderCanvas: HTMLCanvasElement) {
        this.perspective = new PerspectiveCamera(75, renderCanvas.clientWidth / renderCanvas.clientHeight, 0.1, 1000); 

        this.perspective.position.set(0, 1, 3.5);
        this.perspective.updateProjectionMatrix();

        this.#initialYRotation = this.perspective.rotation.y;

        this.attachMouseRotation();

        if (!gui.folders.find(folder => folder._title === 'Camera')) {
            cameraFolder = gui.addFolder('Camera');
            cameraFolder.add(this.perspective.position, 'x').min(-10).max(10).step(0.01).name('Position X');
            cameraFolder.add(this.perspective.position, 'y').min(-10).max(10).step(0.01).name('Position Y');
            cameraFolder.add(this.perspective.position, 'z').min(-10).max(10).step(0.01).name('Position Z');
            // The following min/max are good for position (0, 1, 3.5)
            cameraFolder.add(this.perspective.rotation, 'x').min(-Math.PI * 0.1).max(Math.PI * 0.1).step(0.01).name('Rotation X');
            cameraFolder.add(this.perspective.rotation, 'y').min(-Math.PI * 0.1).max(Math.PI * 0.1).step(0.01).name('Rotation Y');
        }
    }

    attachMouseRotation() {
        // * mouse move rotations work now b/c I hacked the room model rotation in getRoom()
        window.addEventListener('mousemove', (event) => {
            const x = event.clientX;
            const y = event.clientY;
            const width = window.innerWidth;
            const height = window.innerHeight;

            const halfCircle = Math.PI; // radians

            // * Normalized values from -0.5 to 0.5
            // Yaw: left/right
            const yawNormalized = (x / width) - 0.5;
            const yaw = -yawNormalized * (halfCircle * 0.2);

            // Pitch: up/down
            const pitchNormalized = (y / height) - 0.5;
            const pitch = -pitchNormalized * (halfCircle * 0.35);

            this.perspective.rotation.x = pitch;
            this.perspective.rotation.y = this.#initialYRotation + yaw;
        });
    }

    tick() {
        // this.controls.update();
    }

    updateAspect(newAspect: number) {
        this.perspective.aspect = newAspect;
        this.perspective.updateProjectionMatrix();
    }
}

export class DevCamera {
    camera: PerspectiveCamera;
    controls: OrbitControls;

    constructor(renderCanvas: HTMLCanvasElement) {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix();

        // for some reason, OrbitControls messes with lil-gui
        this.controls = new OrbitControls(this.camera, renderCanvas);
        this.controls.enableDamping = true;
    }

    tick() {
        // this.controls.update();
    }

    updateAspect(newAspect: number) {
        this.camera.aspect = newAspect;
        this.camera.updateProjectionMatrix();
    }
}