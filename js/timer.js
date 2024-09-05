// Timer class for handling all timer-related functionality
export default class Timer {
    constructor(displayElement) {
        this.time = 0;
        this.interval = null;
        this.displayElement = displayElement;
    }

    start() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.time++;
                this.updateDisplay();
            }, 1000);
        }
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.time = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayElement.innerText = this.time + "s";
    }

    getTime() {
        return this.time;
    }
}
