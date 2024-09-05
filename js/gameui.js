import Puzzle from "./puzzle.js";
import Timer from "./timer.js";

// GameUI class for handling all UI-related tasks and DOM manipulation
export default class GameUI {
    constructor(size = 4) {
        // Timer-related properties
        this.timer = new Timer(document.getElementById("clock"));

        // DOM Elements
        this.movesElem = document.getElementById("moves");
        this.boardElem = document.getElementById("puzzle-board");
        this.modelElem = document.getElementById("model");

        // Set up button event listeners after gameUI is defined
        document.getElementById("easyMode").onclick = () => this.initializeGame(3);
        document.getElementById("normalMode").onclick = () => this.initializeGame(4);
        document.getElementById("hardMode").onclick = () => this.initializeGame(5);

        // Initialize the game
        this.puzzle = null;

        // Starting with grid size 4
        this.initializeGame(size);
    }

    initializeGame(size) {
        this.puzzle = new Puzzle(size);
        this.boardElem.style.setProperty("--data-size", size);
        this.timer.stop();
        this.timer.reset();
        this.updateBoard();
        this.removeModal();
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
        }
        );
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
                        <div>
                          <button id="playAgainButton" class="modal-button">Play Again</button>
                        </div>
                    </div>
                </div>
                <div class="modal-bg"></div>
            </div>`;

        // Attach the event listener after the element is created in the DOM
        document.getElementById('playAgainButton').onclick = () => this.initializeGame(this.puzzle.gridSize);
    }

    // Method to remove the modal from the DOM
    removeModal() {
        // Clear the inner HTML to remove the modal
        this.modelElem.innerHTML = '';
    }
}
