import { AmbientLight, PointLight, PointLightHelper } from 'three';
import { getGui } from './getGui';

export function getLights() {
    const gui = getGui();
    const lightsFolder = gui.addFolder('Lights');

    const ambientLight = new AmbientLight('white', 0.4);
    ambientLight.visible = false;
    lightsFolder.add(ambientLight, 'visible').name('ambient light');

    const pointLight = new PointLight('white', 20, 100, 4);
    pointLight.position.set(0, 2, 4);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 4;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 1000;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    lightsFolder.add(pointLight, 'visible').name('point light');

    const pointLightHelper = new PointLightHelper(pointLight, undefined, 'orange');
    pointLightHelper.visible = false;
    lightsFolder.add(pointLightHelper, 'visible').name('Point Light Helper');

    const lampPointLight = new PointLight(0xffeeaa, 2, 5, 2);
    lampPointLight.position.set(0.6, 2.2, 0.3);
    lampPointLight.castShadow = true;
    lampPointLight.shadow.radius = 4;
    const lampPointLightHelper = new PointLightHelper(lampPointLight, 0.25, 'yellow');
    lampPointLightHelper.visible = false;
    lampPointLightHelper.add(lampPointLight);
    const updateLampHelper = () => lampPointLightHelper.update();
    lightsFolder.add(lampPointLight, 'visible').name('Lamp Point Light');
    lightsFolder.add(lampPointLightHelper, 'visible').name('Lamp Point Light Helper');
    lightsFolder.add(lampPointLight.position, 'x').min(-10).max(10).step(0.1).name('Lamp Point Position X').onChange(updateLampHelper);
    lightsFolder.add(lampPointLight.position, 'y').min(-10).max(10).step(0.1).name('Lamp Point Position Y').onChange(updateLampHelper);
    lightsFolder.add(lampPointLight.position, 'z').min(-10).max(10).step(0.1).name('Lamp Point Position Z').onChange(updateLampHelper);
    lightsFolder.add(lampPointLight.shadow, 'radius').min(0).max(10).step(1).name('Lamp Shadow Radius').onChange(updateLampHelper);

    function tick() {
    }

    return {
        ambientLight,
        pointLight,
        pointLightHelper,
        lampPointLight,
        lampPointLightHelper,
        tick,
    };
}
