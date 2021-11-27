"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeGame = exports.Game = void 0;
var _ = require("lodash");
var Board_1 = require("./Board");
var Cell_1 = require("./Cell");
var GameState_1 = require("./GameState");
var Game = /** @class */ (function () {
    function Game(rows, columns, mines) {
        this._gameState = GameState_1.GameState.Idle;
        this.board = new Board_1.Board(rows, columns, mines);
    }
    Object.defineProperty(Game.prototype, "gameState", {
        get: function () {
            return this._gameState;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Perform left click actions (click and click neighbors) on the
     * cell at cellIndex and return a deep copy of the game in its new state
     * @param cellIndex the cell left clicked
     * @returns a deep copy of the game in its new state
     */
    Game.prototype.click = function (cellIndex) {
        if (this._gameState === GameState_1.GameState.Won || this._gameState === GameState_1.GameState.Lost) {
            return this;
        }
        this._gameState = this.board.click(cellIndex);
        return _.cloneDeep(this);
    };
    /**
     * Perform right click actions (flag, question and click neighbors) on the
     * cell at cellIndex and return a deep copy of the game in its new state
     * @param cellIndex the cell right clicked
     * @returns a deep copy of the game in its new state
     */
    Game.prototype.rightClick = function (cellIndex) {
        if (this._gameState === GameState_1.GameState.Won || this._gameState === GameState_1.GameState.Lost) {
            return this;
        }
        this._gameState = this.board.rightClick(cellIndex);
        return _.cloneDeep(this);
    };
    return Game;
}());
exports.Game = Game;
function deserializeGame(json) {
    var instance = new Game(10, 10, 10); // NOTE: if your constructor checks for unpassed arguments, then just pass dummy ones to prevent throwing an error
    Object.assign(instance, json);
    for (var row = 0; row < instance.board.rows; row++) {
        for (var column = 0; column < instance.board.columns; column++) {
            var cell = new Cell_1.Cell();
            Object.assign(cell, json.board.board[row][column]);
            json.board.board[row][column] = cell;
        }
    }
    instance.board = new Board_1.Board(10, 10, 10);
    Object.assign(instance.board, json.board);
    return instance;
}
exports.deserializeGame = deserializeGame;
