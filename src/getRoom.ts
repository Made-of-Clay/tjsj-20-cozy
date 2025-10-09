import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager } from './getLoadingManager';
import { degreeToRadian } from './helpers/degreeToRadian';

export function getRoom(): Promise<GLTF['scene']> {
    const gltfLoader = new GLTFLoader(getLoadingManager());

    return new Promise((resolve) => {
        gltfLoader.load('/spaceship-room.gltf', gltf => {
            gltf.scene.rotateY(degreeToRadian(-40)); // hack to make camera look controls easier for now
            resolve(gltf.scene);
        });
    });
}
