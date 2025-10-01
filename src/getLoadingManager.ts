import { LoadingManager } from 'three';

let loadingManager: LoadingManager;

export function getLoadingManager() {
    return loadingManager
        || (loadingManager = new LoadingManager(console.log, console.log, console.error));
}
