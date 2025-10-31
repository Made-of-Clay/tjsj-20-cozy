import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { getLoadingManager } from './getLoadingManager';
import { degreeToRadian } from './helpers/degreeToRadian';
import { getGui } from './getGui';
import { findDeepMeshChild } from './findDeepMeshChild';
import { Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Scene, TextureLoader } from 'three';

export function getRoom(scene: Scene): Promise<GLTF['scene']> {
    const gltfLoader = new GLTFLoader(getLoadingManager());
    const shouldCastFuglyShadows = location.search.includes('fuglyShadows');

    return new Promise((resolve) => {
        gltfLoader.load('/spaceship-room.gltf', gltf => {
            const gui = getGui();
            console.log(gltf);
            gltf.scene.rotateY(degreeToRadian(-40)); // hack to make camera look controls easier for now

            const roomFolder = gui.addFolder('Room');

            const roomMesh = findDeepMeshChild(gltf.scene, 'Room');
            if (roomMesh) {
                if (shouldCastFuglyShadows) {
                    roomMesh.castShadow = true;
                    roomMesh.receiveShadow = true;
                }
                roomFolder.add(roomMesh.material as MeshStandardMaterial, 'envMapIntensity').min(0).max(5).step(0.1);
                roomFolder.add(roomMesh.material as MeshStandardMaterial, 'metalness').min(0).max(5).step(0.1);
                roomFolder.add(roomMesh.material as MeshStandardMaterial, 'roughness').min(0).max(5).step(0.1);
            }
            if (shouldCastFuglyShadows) {
                // not sure yet what's making them fugly, but for now, I'm going to fake it with a baked shadow
                const chairBody = findDeepMeshChild(gltf.scene, 'FinalpSphere6_Chair2_0');
                if (chairBody) {
                    chairBody.castShadow = true;
                    chairBody.receiveShadow = true;
                }
                const chairLegs = findDeepMeshChild(gltf.scene, 'FinalpSphere6_Legs1_0');
                if (chairLegs) {
                    chairLegs.castShadow = true;
                    chairLegs.receiveShadow = true;
                }
                const lampShade = findDeepMeshChild(gltf.scene, 'LAMP_SHADE');
                if (lampShade) {
                    lampShade.castShadow = true;
                }
                const lampBody = findDeepMeshChild(gltf.scene, 'STEEL_MATT_GREY'); // spelling error from original model that I didn't fix - whoops
                if (lampBody) {
                    lampBody.castShadow = true;
                }
                const endTable = findDeepMeshChild(gltf.scene, 'side_table_tall_01_0');
                if (endTable) {
                    endTable.castShadow = true;
                    endTable.receiveShadow = true;
                }
            } else {
                const textureLoader = new TextureLoader(getLoadingManager());
                const simpleShadow = textureLoader.load('/textures/chair-shadow.jpg')
                const shadowMaterial = new MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    alphaMap: simpleShadow,
                    opacity: 0.75,
                });
                const chairShadow = new Mesh(
                    new PlaneGeometry(3, 3),
                    shadowMaterial,
                );
                chairShadow.position.set(0.1, 0, -0.6);
                chairShadow.rotation.x = -Math.PI / 2;
                roomFolder.add(chairShadow.position, 'x').min(-5).max(5).step(0.1).name('Chair Shadow X');
                roomFolder.add(chairShadow.position, 'y').min(-5).max(5).step(0.1).name('Chair Shadow Y');
                roomFolder.add(chairShadow.position, 'z').min(-5).max(5).step(0.1).name('Chair Shadow Z');
                roomFolder.add(chairShadow.material, 'wireframe').name('Chair Shadow Wireframe');
                scene.add(chairShadow); // not the most consistent, but I'm low on time
            }

            resolve(gltf.scene);
        });
    });
}
