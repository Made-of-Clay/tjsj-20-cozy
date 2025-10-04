import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { getGui } from './getGui';
import GUI from 'lil-gui';

const gui = getGui();
let cameraFolder: GUI;

export class Camera {
    perspective: PerspectiveCamera;
    controls: OrbitControls;

    constructor(renderCanvas: HTMLCanvasElement, target?: Vector3) {
        this.perspective = new PerspectiveCamera(75, renderCanvas.clientWidth / renderCanvas.clientHeight, 0.1, 1000); 
        this.perspective.position.set(2, 1, 2);

        this.controls = new OrbitControls(this.perspective, renderCanvas);
        this.controls.target = target ?? new Vector3(0, 0, 0);
        this.controls.enableDamping = true;
        this.controls.autoRotate = false;
        this.controls.update();

        if (!gui.folders.find(folder => folder._title === 'Camera')) {
            cameraFolder = gui.addFolder('Camera');
            cameraFolder.add(this.perspective.position, 'x').min(-10).max(10).step(0.01).name('Position X');
            cameraFolder.add(this.perspective.position, 'y').min(-10).max(10).step(0.01).name('Position Y');
            cameraFolder.add(this.perspective.position, 'z').min(-10).max(10).step(0.01).name('Position Z');
        }
    }

    tick() {
        this.controls.update();
    }

    updateAspect(newAspect: number) {
        this.perspective.aspect = newAspect;
        this.perspective.updateProjectionMatrix();
    }
}
