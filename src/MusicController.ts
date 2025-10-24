const MAX_VOL = 1;
const STEP_VOL = 0.08;
const VOL_FADE_RATE = 100; // in ms

export class MusicController {
    #audio: HTMLAudioElement;
    #fadeInTimer?: number;
    #fadeOutTimer?: number;
    whenLoaded: Promise<void>;
    playing = false;

    get volumeFadeRateMs() {
        return VOL_FADE_RATE;
    }

    constructor() {
        this.#audio = new Audio('/satie-gymnopedie-no1.mp3');
        this.whenLoaded = new Promise((resolve, reject) => {
            this.#audio.addEventListener('canplaythrough', () => resolve());
            this.#audio.addEventListener('error', () => reject(new Error('failed to load audio')));
        });
        this.#audio.loop = true;
        this.#audio.volume = 0.2;
        this.#audio.preload = 'auto';
        document.body.appendChild(this.#audio);
    }

    play() {
        // clear any fade-out in progress
        if (this.#fadeOutTimer) {
            clearInterval(this.#fadeOutTimer);
            this.#fadeOutTimer = undefined;
        }

        this.#audio.volume = Math.max(0, this.#audio.volume);

        const playPromise = this.#audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch((err) => {
                // autoplay was probably blocked; don't crash — keep flag false
                // e.g. no user interactions yet
                console.warn('audio play() rejected:', err);
                this.playing = false;
            });
        }

        this.playing = true;
        // fade in toward MAX_VOL
        return new Promise<void>((resolve) => {
            this.#fadeInTimer = setInterval(() => {
                const next = Math.min(MAX_VOL, this.#audio.volume + STEP_VOL);
                this.#audio.volume = next;
                if (next >= MAX_VOL) {
                    clearInterval(this.#fadeInTimer);
                    this.#fadeInTimer = undefined;
                    console.log('playing', this.playing);
                    resolve();
                }
            }, VOL_FADE_RATE);
        });
    }

    pause() {
        // clear any fade-in in progress
        if (this.#fadeInTimer) {
            clearInterval(this.#fadeInTimer);
            this.#fadeInTimer = undefined;
        }

        if (this.#audio.volume <= 0 && this.#audio.paused) {
            this.playing = false;
            return Promise.resolve();
        }

        if (this.#fadeOutTimer) {
            clearInterval(this.#fadeOutTimer);
            this.#fadeOutTimer = undefined;
        }

        this.playing = false;
        
        return new Promise<void>((resolved, reject) => {
            this.#fadeOutTimer = setInterval(() => {
                const next = this.#audio.volume - STEP_VOL;
                this.#audio.volume = Math.max(0, next);
                if (this.#audio.volume <= 0) {
                    clearInterval(this.#fadeOutTimer);
                    this.#fadeOutTimer = undefined;
                    try {
                        this.#audio.pause();
                        resolved();
                    } catch (e) {
                        console.warn('audio pause() error', e);
                        reject(e);
                    }
                }
            }, VOL_FADE_RATE);
        });
    }
}
