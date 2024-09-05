import { Puzzle } from "./puzzle.js";

// Timer class for handling all timer-related functionality
class Timer {
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

// GameUI class for handling all UI-related tasks and DOM manipulation
class GameUI {
  constructor() {
    // Timer-related properties
    this.timer = new Timer(document.getElementById("clock"));

    // DOM Elements
    this.movesElem = document.getElementById("moves");
    this.boardElem = document.getElementById("puzzle-board");
    this.modelElem = document.getElementById("model");

    // Initialize the game
    this.puzzle = null;
    this.initializeGame(4);
    // Starting with grid size 4
  }

  initializeGame(size) {
    this.puzzle = new Puzzle(size);
    this.modelElem.innerHTML = "";
    this.boardElem.style.setProperty("--data-size", size);
    this.timer.stop();
    this.timer.reset();
    this.updateBoard();
  }

  updateBoard(movedNum) {
    this.movesElem.textContent = this.puzzle.moves;

    // Clear the puzzle board before adding new elements
    this.boardElem.innerHTML = "";

    this.puzzle.data.forEach((number) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");

      const numberCellDiv = document.createElement("div");
      numberCellDiv.classList.add("number-cell");
      numberCellDiv.id = number;

      // Add classes based on the number
      if (number === 0) {
        numberCellDiv.classList.add("number-cell-empty");
      }
      if (this.puzzle.isCorrect(number)) {
        numberCellDiv.classList.add("number-cell-correct");
      }

      // Handle bounce animation for moved number
      if (!movedNum || number === movedNum) {
        this.addAnimation(numberCellDiv, "bounceIn");
      }

      numberCellDiv.textContent = number;
      numberCellDiv.onclick = () => this.play(number);

      cellDiv.appendChild(numberCellDiv);
      this.boardElem.appendChild(cellDiv);
    });
  }

  addAnimation(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener("animationend", function handleAnimationEnd() {
      element.classList.remove(animationClass);
      element.removeEventListener("animationend", handleAnimationEnd);
    });
  }

  play(number) {
    if (this.puzzle.canMove(number)) {
      this.timer.start();
      // Start the clock on the first move
      this.puzzle.switcher(number);
      this.updateBoard(number);

      // Check if the puzzle is solved
      if (this.puzzle.isSolved()) {
        this.showModel();
        this.timer.stop();
        // Stop the clock
      }
    } else {
      const numberCellDiv = document.getElementById(number);
      this.addAnimation(numberCellDiv, "jiggle");
    }
  }

  showModel() {
    this.modelElem.innerHTML = `
      <div class="modal-wrapper bounceIn">
          <div class="modal-card">
              <div class="modal-container">
                  <div class="text-1">You Won!</div>
                  <div>in <b>${this.puzzle.moves} moves</b> and <b>${this.timer.getTime()} seconds</b></div>
                  <div><button class="modal-button" onclick="gameUI.initializeGame(${this.puzzle.gridSize})">Play Again</button></div>
              </div>
          </div>
          <div class="modal-bg"></div>
      </div>`;
  }
}

export { GameUI, Timer };
