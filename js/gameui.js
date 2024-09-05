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
    this.displayElement.innerText = this.time + 's';
  }

  getTime() {
    return this.time;
  }
}

// GameUI class for handling all UI-related tasks and DOM manipulation
class GameUI {
  constructor() {
    // Timer-related properties
    this.timer = new Timer(document.getElementById('clock'));

    // DOM Elements
    this.movesElem = document.getElementById('moves');
    this.boardElem = document.getElementById('puzzle-board');
    this.modelElem = document.getElementById('model');

    // Initialize the game
    this.puzzle = null;
    this.initializeGame(4);
    // Starting with grid size 4
  }

  initializeGame(size) {
    this.puzzle = new Puzzle(size);
    this.modelElem.innerHTML = '';
    this.boardElem.style.setProperty('--data-size', size);
    this.timer.stop();
    this.timer.reset();
    this.updateBoard();
  }

  updateBoard(movedNum) {
    this.movesElem.textContent = this.puzzle.moves;

    // Clear the puzzle board before adding new elements
    this.boardElem.innerHTML = '';

    this.puzzle.data.forEach((number) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      const numberCellDiv = document.createElement('div');
      numberCellDiv.classList.add('number-cell');
      numberCellDiv.id = number;

      // Add classes based on the number
      if (number === 0) {
        numberCellDiv.classList.add('number-cell-empty');
      }
      if (this.puzzle.isCorrect(number)) {
        numberCellDiv.classList.add('number-cell-correct');
      }

      // Handle bounce animation for moved number
      if (!movedNum || number === movedNum) {
        this.addAnimation(numberCellDiv, 'bounceIn');
      }

      numberCellDiv.textContent = number;
      numberCellDiv.onclick = () => this.play(number);

      cellDiv.appendChild(numberCellDiv);
      this.boardElem.appendChild(cellDiv);
    });
  }

  addAnimation(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', function handleAnimationEnd() {
      element.classList.remove(animationClass);
      element.removeEventListener('animationend', handleAnimationEnd);
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
      this.addAnimation(numberCellDiv, 'jiggle');
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

// Initialize Game UI
const gameUI = new GameUI();

// Cheating hack
window.addEventListener('load', () => {
  // Function to extract URL parameters
  const extractUrlParams = () => {
    const params = new URLSearchParams(window.location.search); // Create a URLSearchParams object to access query parameters
    params.forEach((value, key) => {
      console.log(`URL Parameters: '${key}': '${value}'`); // Debugging: Print all URL parameters
    });
    return params;
  };

  // Function to initialize game with parameters from URL
  const initializeGameFromParams = (params) => {
    const win = params.get('win'); // Get 'win' parameter from URL
    const gridSize = parseInt(params.get('gridSize')) || 4; // Get 'gridSize' or set default to 4
    const moves = parseInt(params.get('moves')) || 10; // Get 'moves' or set default to 10
    const time = parseInt(params.get('time')) || 10; // Get 'time' or set default to 10

    if (win !== null) {
      // If 'win' parameter exists, initialize game
      gameUI.initializeGame(gridSize); // Initialize game with 'gridSize'

      // Set up the game state
      gameUI.puzzle.data = gameUI.puzzle.solvedPuzzle;
      gameUI.puzzle.moves = moves;
      gameUI.timer.time = time;

      // Start the game with the adjusted parameters
      gameUI.play(gameUI.puzzle.data.at(-2));
    }
  };

  // Function to handle click event on the header element
  const handleHeaderClick = () => {
    let clickCount = 0; // Initialize click counter

    document.getElementById('header').addEventListener('click', function () {
      clickCount++; // Increment the counter on each click

      if (clickCount === 3) {
        // Check if the click count is 3
        // Get the current URL without any query parameters
        const baseUrl = window.location.origin + window.location.pathname;

        // Set the new query parameters
        const newUrl = `${baseUrl}?win&gridSize=${gameUI.puzzle.gridSize}&moves=${gameUI.puzzle.moves}&time=${gameUI.timer.time}`;

        // Redirect to the new URL
        window.location.href = newUrl;
      }
    });
  };

  // Main execution: Extract URL parameters, initialize game, and set up event listeners
  const params = extractUrlParams();
  initializeGameFromParams(params);
  handleHeaderClick();
});
