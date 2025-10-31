import { RepeatWrapping, PlaneGeometry, ShaderMaterial, DoubleSide, Uniform, Mesh, TextureLoader } from "three";
import { getLoadingManager } from "./getLoadingManager";
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl?raw';
import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl?raw';

export function getSteam() {
    const textureLoader = new TextureLoader(getLoadingManager());
    const perlinTexture = textureLoader.load('/textures/perlin.png');
    perlinTexture.wrapS = RepeatWrapping;
    perlinTexture.wrapT = RepeatWrapping;

    const steamGeometry = new PlaneGeometry(1, 1, 16, 16);
    steamGeometry.scale(0.07, 0.5, 0);

    const steamMaterial = new ShaderMaterial({
        vertexShader: coffeeSmokeVertexShader,
        fragmentShader: coffeeSmokeFragmentShader,
        side: DoubleSide,
        uniforms: {
            uTime: new Uniform(0),
            uPerlinTexture: new Uniform(perlinTexture),
        },
        transparent: true,
        wireframe: true,
    });

    const steam = new Mesh(steamGeometry, steamMaterial);
    steam.position.x = 0.98;
    steam.position.y = 1.05;
    steam.position.z = -0.41;

    function tick(elapsedTime: number) {
        // simple up animation for now - may add the twists later if too simple
        // but I think it's distant enough
        steamMaterial.uniforms.uTime.value = elapsedTime;
    }

    return { steam, tick };
}
