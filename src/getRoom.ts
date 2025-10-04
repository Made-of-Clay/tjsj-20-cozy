import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager } from './getLoadingManager';

export function getRoom(): Promise<GLTF['scene']> {
    const gltfLoader = new GLTFLoader(getLoadingManager());

    return new Promise((resolve) => {
        gltfLoader.load('/spaceship-room.gltf', gltf => {
            resolve(gltf.scene);
        });
    });
}
