class Progress {
    #stack: string[] = [];
    #completions: string[] = [];

    get total() {
        return this.#stack.length;
    }

    get current() {
        return this.#completions.length;
    }

    finish(name: string) {
        if (this.#completions.includes(name)) {
            console.warn(`Progress: "${name}" has already been completed.`);
            return;
        }
        this.#completions.push(name);
        this.#checkCompletion();
    }

    track(name: string) {
        if (this.#stack.includes(name)) {
            console.warn(`Progress: "${name}" is already being tracked.`);
            return;
        }
        this.#stack.push(name);
    }

    #completionCallbacks: Function[] = [];
    onComplete(callback: Function) {
        this.#completionCallbacks.push(callback);
    }

    #checkCompletion() {
        if (this.current === this.total) {
            for (const callback of this.#completionCallbacks) {
                callback();
            }
        }
    }
}

const instance = new Progress();

export const getProgress = () => instance;
