class Puzzle {
    constructor(gridSize = 4) {
        this.gridSize = gridSize;
        this.moves = 0;
        this.solvedPuzzle = this.generateSolvedPuzzle();
        this.data = this.jumble();
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
            const array = this.solvedPuzzle
                .slice()
                .sort(() => Math.random() - 0.5);
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

        return true;
        // Move was successful
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
}
