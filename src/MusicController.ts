const MAX_VOL = 1;
const STEP_VOL = 0.02;
const VOL_FADE_RATE = 100; // in ms

export class MusicController {
    #audio: HTMLAudioElement;
    whenLoaded: Promise<void>;
    playing = false;

    constructor() {
        this.#audio = new Audio('/satie-gymnopedie.mp3');
        this.whenLoaded = new Promise((resolve) => {
            this.#audio.onload = () => resolve(); // would assign directly but TS complains
        });
        this.#audio.loop = true;
        this.#audio.volume = 0.2;
        this.#audio.preload = 'auto';
        document.body.appendChild(this.#audio);
    }

    play() {
        // add fade-in effect
        this.#audio.volume = 0;
        this.#audio.play();
        const fadeIn = setInterval(() => {
            if (this.#audio.volume < MAX_VOL) {
                this.#audio.volume += STEP_VOL;
            } else {
                clearInterval(fadeIn);
            }
        }, VOL_FADE_RATE);
    }

    pause() {
        const fadeOut = setInterval(() => {
            if (this.#audio.volume > 0) {
                this.#audio.volume -= STEP_VOL;
            } else {
                clearInterval(fadeOut);
            }
        }, VOL_FADE_RATE);
    }
}
