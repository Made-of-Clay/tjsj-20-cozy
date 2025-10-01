import GUI from 'lil-gui';

let gui: GUI;

export function getGui() {
    return gui || (gui = new GUI({ title: '🐞 Debug GUI', width: 300 }));
}