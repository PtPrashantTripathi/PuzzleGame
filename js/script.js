import { GameUI } from "./gameui.js";

// Initialize Game UI
const gameUI = new GameUI();

// Cheating hack
window.addEventListener("load", () => {
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
    const win = params.get("win"); // Get 'win' parameter from URL
    const gridSize = parseInt(params.get("gridSize")) || 4; // Get 'gridSize' or set default to 4
    const moves = parseInt(params.get("moves")) || 10; // Get 'moves' or set default to 10
    const time = parseInt(params.get("time")) || 10; // Get 'time' or set default to 10

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

    document.getElementById("header").addEventListener("click", function () {
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
