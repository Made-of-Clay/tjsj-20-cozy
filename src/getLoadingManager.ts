import { LoadingManager } from 'three';

let loadingManager: LoadingManager;

export function getLoadingManager() {
    return loadingManager
        || (loadingManager = new LoadingManager(console.log, undefined, console.error));
}
