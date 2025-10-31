import { Object3D, Mesh } from 'three';

export function findDeepMeshChild(objectLayer: Object3D, childName: string): Mesh | null {
    for (const obj of objectLayer.children) {
        if (obj.type === 'Mesh' && obj.name === childName)
            return obj as Mesh;
        const found = findDeepMeshChild(obj, childName);
        if (found) return found;
    }
    return null;
}
