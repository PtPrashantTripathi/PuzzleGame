class Puzzle {
  constructor(gridSize = 4) {
    this.gridSize = gridSize;
    this.moves = 0;
    this.solvedPuzzle = this.generateSolvedPuzzle();
    this.data = this.jumble();

    // Timer-related properties
    this.startTime = null; // Start time in milliseconds
    this.elapsedTime = 0;
    this.timerInterval = null;
  }

  // Generate the solved puzzle array based on the grid size
  generateSolvedPuzzle() {
    const solvedPuzzle = [];
    for (let i = 0; i < this.gridSize ** 2; i++) {
      solvedPuzzle.push(i === this.gridSize ** 2 - 1 ? 0 : i + 1);
    }
    return solvedPuzzle;
  }

  // Check if the board is in a solvable state
  canBoardWin(array) {
    const startBoardPosition = array.every(
      (el, i) => el === this.solvedPuzzle[i]
    );
    if (startBoardPosition) return false;

    let inversions = 0;
    let row = 0;
    let blankRow = 0;
    for (let i = 0; i < array.length; i++) {
      if (i % this.gridSize === 0) row++;
      if (array[i] === 0) {
        blankRow = row;
        continue;
      }
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] > array[j] && array[j] !== 0) inversions++;
      }
    }

    if (this.gridSize % 2 === 0 && blankRow % 2 !== 0)
      return inversions % 2 !== 0;
    return inversions % 2 === 0;
  }

  // Randomize the puzzle until a solvable configuration is found
  jumble() {
    while (true) {
      const array = this.solvedPuzzle.slice().sort(() => Math.random() - 0.5);
      if (this.canBoardWin(array)) {
        return array;
      }
    }
  }

  // Check if a move is valid
  canMove(number) {
    const locNum = this.data.indexOf(number);
    const locZero = this.data.indexOf(0);

    // Left-right movement check
    if (
      Math.floor(locNum / this.gridSize) ===
        Math.floor(locZero / this.gridSize) &&
      Math.abs(locNum - locZero) === 1
    ) {
      return true;
    }

    // Up-down movement check
    if (Math.abs(locNum - locZero) === this.gridSize) {
      return true;
    }

    return false;
  }

  // Switch the positions of the number and zero
  switcher(number) {
    this.moves++;
    const locNum = this.data.indexOf(number);
    const locZero = this.data.indexOf(0);

    // Swap the positions of the number and zero
    this.data[locNum] = 0;
    this.data[locZero] = number;

    return true; // Move was successful
  }

  isCorrect(number) {
    let i = this.data.indexOf(number);
    return number === (i === this.data.length - 1 ? 0 : i + 1);
  }

  // Check if the puzzle is solved
  isSolved() {
    return this.data.every(
      (a, i) => a === (i === this.data.length - 1 ? 0 : i + 1)
    );
  }

  // Start the timer
  startClock() {
    if (!this.timerInterval) {
      this.startTime = Date.now() - this.elapsedTime;
      this.timerInterval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        // Update the display in seconds
        if (clockElem) {
          clockElem.innerText = parseInt(this.elapsedTime / 1000);
        }
      }, 1000);
    }
  }

  // Stop the timer
  stopClock() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  // Reset the timer
  resetClock() {
    this.elapsedTime = 0;
    if (clockElem) {
      clockElem.innerText = "0";
    }
  }
}

// DOM Elements
const movesElem = document.getElementById("moves");
const puzzleBoard = document.getElementById("puzzle");
const clockElem = document.getElementById("clock");
const modelElem = document.getElementById("model");

// Initialize the game
const puzzle = new Puzzle(4);

// Function to update the DOM based on the game state
function updateBoard(movedNum) {
  movesElem.textContent = puzzle.moves;

  // Clear the puzzle board before adding new elements
  puzzleBoard.innerHTML = "";

  puzzle.data.forEach((number) => {
    // Create the outer 'cell' div
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");

    // Create the inner 'number-cell' div
    const numberCellDiv = document.createElement("div");
    numberCellDiv.classList.add("number-cell");
    numberCellDiv.id = number;

    // Add the appropriate class based on the number
    if (number === 0) {
      numberCellDiv.classList.add("number-cell-empty");
    }
    if (puzzle.isCorrect(number)) {
      numberCellDiv.classList.add("number-cell-correct");
    }

    // Check if the number should bounce in
    if (!movedNum || number === movedNum) {
      numberCellDiv.classList.add("bounceIn");
      numberCellDiv.addEventListener(
        "animationend",
        function handleAnimationEnd() {
          numberCellDiv.classList.remove("bounceIn");
          numberCellDiv.removeEventListener("animationend", handleAnimationEnd);
        }
      );
    }

    // Set the text content and onclick attribute
    numberCellDiv.textContent = number;
    numberCellDiv.setAttribute("onclick", `play(${number})`);

    // Append the inner 'number-cell' div to the outer 'cell' div
    cellDiv.appendChild(numberCellDiv);

    // Append the 'cell' div to the puzzle board
    puzzleBoard.appendChild(cellDiv);
  });
}

// Function to handle user moves
function play(number) {
  if (puzzle.canMove(number)) {
    puzzle.startClock(); // Start the clock on the first move
    puzzle.switcher(number);
    updateBoard(number);

    // Check if the puzzle is solved
    if (puzzle.isSolved()) {
      puzzle.stopClock(); // Stop the clock
      showModel();
    }
  } else {
    const numberCellDiv = document.getElementById(number);
    // Remove and add 'jiggle' class for the clicked number
    numberCellDiv.classList.add("jiggle");
    numberCellDiv.addEventListener(
      "animationend",
      function handleAnimationEnd() {
        numberCellDiv.classList.remove("jiggle");
        numberCellDiv.removeEventListener("animationend", handleAnimationEnd);
      }
    );
  }
}

function showModel() {
  modelElem.innerHTML = `
  <div class="modal-wrapper bounceIn">
  <div class="modal-card">
      <div class="modal-container">
          <div class="text-1">Excellent!</div>
          <div>It took you <b>${puzzle.moves} moves</b> and <b>${parseInt(
    puzzle.elapsedTime / 1000
  )} seconds</b></div>
          <div><button class="modal-button" onclick="location.reload()">Play Again</button></div>
      </div>
  </div>
  <div class="modal-bg"></div>
</div>`;
}

// Initialize the board once at the beginning
updateBoard();
