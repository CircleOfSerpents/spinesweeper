"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
var Cell_1 = require("./Cell");
var GameState_1 = require("./GameState");
var neighborOffsets = [
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
    { row: -1, column: 0 },
    { row: 1, column: 1 },
    { row: -1, column: -1 },
    { row: 1, column: -1 },
    { row: -1, column: 1 },
];
var Board = /** @class */ (function () {
    function Board(rows, columns, mines) {
        this.validateInputs(rows, columns, mines);
        this.rows = rows;
        this.columns = columns;
        this.mines = 0; // Initialize to 0 because we will increment as each mine is added
        this.board = this.createInternalBoard(mines);
        this.addMines(mines);
        this.mineCount = this.mines;
    }
    /**
     * Perform left click actions (click and click neighbors) on the
     * cell at cellIndex and return the new GameState
     * @param cellIndex the cell left clicked
     * @returns the new GameState of the game after the action is complete
     */
    Board.prototype.click = function (cellIndex) {
        var cellState = this.getCellState(cellIndex);
        if (cellState === Cell_1.CellState.Unclicked) {
            this.floodfill(cellIndex);
        }
        else if (cellState === Cell_1.CellState.UnclickedMine) {
            this.explode();
        }
        else if (this.isFullyFlaggedCell(cellIndex)) {
            this.clickAllNeighbors(cellIndex);
        }
        this.mineCount = this.calculateMineCount();
        var gameState = this.calculateGameState();
        this.cleanUpGameIfNecessary(gameState);
        return gameState;
    };
    /**
     * Perform right click actions (flag, question, click neighbors) on the
     * cell at cellIndex and return the new GameState
     * @param cellIndex the cell right clicked
     * @returns the new GameState of the game after the action is complete
     */
    Board.prototype.rightClick = function (cellIndex) {
        var cell = this.getCell(cellIndex);
        if (Cell_1.unclickedStates.includes(cell.cellState)) {
            cell.rightClick();
        }
        else if (this.isFullyFlaggedCell(cellIndex)) {
            this.clickAllNeighbors(cellIndex);
        }
        this.mineCount = this.calculateMineCount();
        var gameState = this.calculateGameState();
        this.cleanUpGameIfNecessary(gameState);
        return gameState;
    };
    /**
     * Calculate the current GameState of the board
     */
    Board.prototype.calculateGameState = function () {
        var stateCounts = this.getStateCounts();
        if (!!stateCounts[Cell_1.CellState.ClickedMine]) {
            return GameState_1.GameState.Lost;
        }
        else if ((stateCounts[Cell_1.CellState.Unclicked] || 0) +
            (stateCounts[Cell_1.CellState.Flagged] || 0) +
            (stateCounts[Cell_1.CellState.Questioned] || 0) ===
            0) {
            return GameState_1.GameState.Won;
        }
        return GameState_1.GameState.Active;
    };
    /**
     * Calculate the mine count to display in the UI
     * @returns A count of the total mines minus flagged cells
     */
    Board.prototype.calculateMineCount = function () {
        var count = this.mines;
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                if (Cell_1.flaggedStates.includes(this.getCellState({ row: row, column: column }))) {
                    count -= 1;
                }
            }
        }
        return count;
    };
    /**
     * Get a map of counts of CellState for every cell on the board
     */
    Board.prototype.getStateCounts = function () {
        var stateCounts = {};
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                var cellState = this.getCellState({ row: row, column: column });
                stateCounts[cellState] = (stateCounts[cellState] || 0) + 1;
            }
        }
        return stateCounts;
    };
    /**
     * Perform a left click on all neighbors of the cell at cellIndex
     */
    Board.prototype.clickAllNeighbors = function (cellIndex) {
        var _this = this;
        this.getInBoundNeighbors(cellIndex).forEach(function (neighbor) {
            if (_this.getCellState(neighbor) === Cell_1.CellState.UnclickedMine) {
                _this.explode();
            }
            else {
                _this.floodfill(neighbor);
            }
        });
    };
    /**
     * Calculate the count of the number of adjacent mines in the 8 neighbors of the cell at board[row][column]
     * @param row the row of the cell
     * @param column the column of the cell
     * @returns a count of neighbors containing mines
     */
    Board.prototype.getCellNumNeighborMines = function (cellIndex) {
        var _this = this;
        if (!this.isCellInBounds(cellIndex))
            return 0;
        return this.getInBoundNeighbors(cellIndex)
            .map(function (neighbor) { return _this.isMineCell(neighbor); })
            .filter(Boolean).length;
    };
    /**
     * Calculate the count of the number of adjacent flagged cells in the 8 neighbors of the cell at board[row][column]
     * @param row the row of the cell
     * @param column the column of the cell
     * @returns a count of flagged neighbors
     */
    Board.prototype.getCellNumNeighborFlags = function (cellIndex) {
        var _this = this;
        if (!this.isCellInBounds(cellIndex))
            return 0;
        return this.getInBoundNeighbors(cellIndex)
            .map(function (neighbor) { return _this.isFlaggedCell(neighbor); })
            .filter(Boolean).length;
    };
    /**
     * Get the current Cell at board[row][column]
     * @param row the row of the cell
     * @param column the column of the cell
     * @returns the Cell at board[row][column]
     */
    Board.prototype.getCell = function (cellIndex) {
        if (!this.isCellInBounds(cellIndex)) {
            throw Error("Cell out of bounds");
        }
        return this.board[cellIndex.row][cellIndex.column];
    };
    /**
     * Get the current CellState for the cell at board[row][column]
     * @param row the row of the cell
     * @param column the column of the cell
     * @returns the current CellState for the cell at board[row][column]
     */
    Board.prototype.getCellState = function (cellIndex) {
        if (!this.isCellInBounds(cellIndex)) {
            throw Error("Cell out of bounds");
        }
        return this.board[cellIndex.row][cellIndex.column].cellState;
    };
    /**
     * Depth first search floodfill of open unclicked areas
     */
    Board.prototype.floodfill = function (cellIndex) {
        var _this = this;
        var cellState = this.getCellState(cellIndex);
        if (cellState === Cell_1.CellState.Unclicked) {
            this.getCell(cellIndex).click();
            if (this.getCellNumNeighborMines(cellIndex) === 0) {
                this.getInBoundNeighbors(cellIndex).forEach(function (neighbor) {
                    _this.floodfill(neighbor);
                });
            }
        }
    };
    /**
     * Mark all bombs as clicked
     */
    Board.prototype.explode = function () {
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                if (this.isMineCell({ row: row, column: column })) {
                    this.board[row][column].click();
                }
            }
        }
    };
    /**
     * Get all neighbors of the cell at cellIndex that are in the board
     */
    Board.prototype.getInBoundNeighbors = function (cellIndex) {
        var _this = this;
        var inBoundsNeighbors = [];
        neighborOffsets.forEach(function (offset) {
            var neighbor = { row: cellIndex.row + offset.row, column: cellIndex.column + offset.column };
            if (_this.isCellInBounds(neighbor)) {
                inBoundsNeighbors.push(neighbor);
            }
        });
        return inBoundsNeighbors;
    };
    /**
     * Return true if the cell at cellIndex is in board
     */
    Board.prototype.isCellInBounds = function (cellIndex) {
        if (cellIndex.row < 0 || cellIndex.row >= this.rows)
            return false;
        if (cellIndex.column < 0 || cellIndex.column >= this.columns)
            return false;
        return true;
    };
    /**
     * Instantiate the internal Board object for storing board state
     */
    Board.prototype.createInternalBoard = function (mines) {
        var board = Array(this.rows);
        for (var row = 0; row < this.rows; row++) {
            board[row] = Array(this.columns);
            for (var column = 0; column < this.columns; column++) {
                board[row][column] = new Cell_1.Cell();
            }
        }
        return board;
    };
    /**
     * Add numMines mines to the game board without exceeding the maximum
     */
    Board.prototype.addMines = function (numMines) {
        var maxMines = (this.rows * this.columns) / 2;
        var addedMines = 0;
        while (addedMines < numMines && this.mines < maxMines) {
            var row = this.getRandomInt(this.rows);
            var column = this.getRandomInt(this.columns);
            if (this.isUnclickedNonMineCell({ row: row, column: column })) {
                this.board[row][column].isMine = true;
                addedMines++;
                this.mines++;
            }
        }
    };
    Board.prototype.isMineCell = function (cellIndex) {
        return Cell_1.mineStates.includes(this.getCellState(cellIndex));
    };
    Board.prototype.isUnclickedNonMineCell = function (cellIndex) {
        return Cell_1.unclickedNonMineStates.includes(this.getCellState(cellIndex));
    };
    Board.prototype.isFlaggedCell = function (cellIndex) {
        return Cell_1.flaggedStates.includes(this.getCellState(cellIndex));
    };
    Board.prototype.isFullyFlaggedCell = function (cellIndex) {
        return (this.getCellState(cellIndex) === Cell_1.CellState.Clicked &&
            this.getCellNumNeighborFlags(cellIndex) === this.getCellNumNeighborMines(cellIndex));
    };
    /**
     * Flags all mines at the end of a winning game
     * @param gameState the current GameState
     */
    Board.prototype.cleanUpGameIfNecessary = function (gameState) {
        if (gameState === GameState_1.GameState.Won) {
            for (var row = 0; row < this.rows; row++) {
                for (var column = 0; column < this.columns; column++) {
                    if (this.getCellState({ row: row, column: column }) === Cell_1.CellState.QuestionedMine) {
                        this.rightClick({ row: row, column: column });
                    }
                    if (this.getCellState({ row: row, column: column }) === Cell_1.CellState.UnclickedMine) {
                        this.rightClick({ row: row, column: column });
                    }
                }
            }
        }
    };
    Board.prototype.validateInputs = function (rows, columns, mines) {
        var maxMines = (rows * columns) / 2;
        if (mines < 0 || mines > maxMines) {
            throw Error("Please provide a number of mines between 0 and ".concat(maxMines));
        }
        if (rows <= 0 || rows > 100) {
            throw Error("Please provide a number of rows between 1 and 100");
        }
        if (columns <= 0 || columns > 100) {
            throw Error("Please provide a number of columns between 1 and 100");
        }
    };
    Board.prototype.getRandomInt = function (max) {
        var num = Math.floor(Math.random() * max);
        if (num > max) {
            return max;
        }
        return num;
    };
    Board.prototype.allCells = function () {
        var arr = [];
        for (var row = 0; row < this.rows; row++) {
            arr = arr.concat(this.board[row]);
        }
        return arr;
    };
    return Board;
}());
exports.Board = Board;
