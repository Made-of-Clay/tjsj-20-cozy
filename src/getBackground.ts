import { getLoadingManager } from './getLoadingManager';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

export class Background {
    object: GLTF['scene'] | null = null;

    async init() {
        await this.#setObject().catch(error => {
            console.error('Background failed to load >', error);
        });
    }

    async #setObject() {
        const gltfLoader = new GLTFLoader(getLoadingManager());

        return new Promise<void>((resolve) => {
            gltfLoader.load('/deep_space_skybox/scene.gltf', (gltf) => {
                this.object = gltf.scene;
                resolve();
            });
        });
    }

    tick() {
        this.object?.rotateY(0.0005);
    }
}