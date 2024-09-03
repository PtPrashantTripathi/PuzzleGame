// Initialize the game
let puzzle = null;

// Timer-related properties
let clockTime = 0;
let timerInterval = null;

// DOM Elements
const movesElem = document.getElementById("moves");
const boardElem = document.getElementById("puzzle-board");
const clockElem = document.getElementById("clock");
const modelElem = document.getElementById("model");

// Start the timer
function startClock() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      clockTime++;
      // Update the display in seconds
      clockElem.innerText = clockTime + "s";
    }, 1000);
  }
}

// Reset the timer
function stopClock() {
  clearInterval(timerInterval);
  timerInterval = null;
  clockTime = 0;
  clockElem.innerText = "0s";
}

// Function to update the DOM based on the game state
function updateBoard(movedNum) {
  movesElem.textContent = puzzle.moves;

  // Clear the puzzle board before adding new elements
  boardElem.innerHTML = "";

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
    boardElem.appendChild(cellDiv);
  });
}

// Function to handle user moves
function play(number) {
  if (puzzle.canMove(number)) {
    startClock(); // Start the clock on the first move
    puzzle.switcher(number);
    updateBoard(number);

    // Check if the puzzle is solved
    if (puzzle.isSolved()) {
      stopClock(); // Stop the clock
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
          <div>It took you <b>${puzzle.moves} moves</b> and <b>${clockTime} seconds</b></div>
          <div><button class="modal-button" onclick="newGame(${puzzle.gridSize})">Play Again</button></div>
      </div>
  </div>
  <div class="modal-bg"></div>
</div>`;
}

function newGame(size) {
  puzzle = new Puzzle(size);
  boardElem.style.setProperty("--data-size", size);
  updateBoard();
}

// Initialize the board once at the beginning
newGame(4);
