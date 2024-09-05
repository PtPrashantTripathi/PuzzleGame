import GameUI from "./gameui.js";

// Function to extract URL parameters
function extractUrlParams() {
  // Create a URLSearchParams object to access query parameters
  const params = new URLSearchParams(window.location.search);

  // Debugging: Print all URL parameters
  // params.forEach((value, key) => {
  //   console.log(`URL Parameters: '${key}': '${value}'`);
  // });

  return params;
}

// Function to initialize game with parameters from URL
function checkForParams(gameUI) {
  const params = extractUrlParams();
  const win = params.get("win");
  const gridSize = parseInt(params.get("gridSize")) || 4;
  const moves = parseInt(params.get("moves")) || 10;
  const time = parseInt(params.get("time")) || 10;
  if (win !== null) {
    // If 'win' parameter exists, initialize game
    gameUI.initializeGame(gridSize);
    // Set up the game state
    gameUI.puzzle.data = gameUI.puzzle.solvedPuzzle;
    gameUI.puzzle.moves = moves;
    gameUI.timer.time = time;
    // Start the game with the adjusted parameters
    gameUI.play(gameUI.puzzle.data.at(-2));
  }
}

// Function to handle click event on the header element
function cheatingHandler(gameUI) {
  let clickCount = 0;
  document.getElementById("header").addEventListener("click", function () {
    clickCount++;
    // Check if the click count is 3
    if (clickCount === 3) {
      // Set the new query parameters
      const newUrl = `${window.location.origin}${window.location.pathname}?win&gridSize=${gameUI.puzzle.gridSize}&moves=${gameUI.puzzle.moves}&time=${gameUI.timer.time}`;
      // Redirect to the new URL
      window.location.href = newUrl;
    }
  });
}

window.addEventListener("load", () => {
  // Initialize Game UI
  // Main execution: Extract URL parameters, initialize game, and set up event listeners
  const gameUI = new GameUI();
  
  // Cheating hack
  checkForParams(gameUI);
  cheatingHandler(gameUI);
});
