import * as _ from "lodash";
import { Board, CellIndex } from "./Board";
import { Cell } from "./Cell";
import { GameState } from "./GameState";

export class Game {
  public board: Board;
  protected _gameState: GameState = GameState.Idle;

  constructor(rows: number, columns: number, mines: number) {
    this.board = new Board(rows, columns, mines);
  }

  get gameState(): GameState {
    return this._gameState;
  }

  /**
   * Perform left click actions (click and click neighbors) on the
   * cell at cellIndex and return a deep copy of the game in its new state
   * @param cellIndex the cell left clicked
   * @returns a deep copy of the game in its new state
   */
  click(cellIndex: CellIndex): Game {
    if (this._gameState === GameState.Won || this._gameState === GameState.Lost) {
      return this;
    }
    this._gameState = this.board.click(cellIndex);
    return _.cloneDeep(this);
  }

  /**
   * Perform right click actions (flag, question and click neighbors) on the
   * cell at cellIndex and return a deep copy of the game in its new state
   * @param cellIndex the cell right clicked
   * @returns a deep copy of the game in its new state
   */
  rightClick(cellIndex: CellIndex): Game {
    if (this._gameState === GameState.Won || this._gameState === GameState.Lost) {
      return this;
    }
    this._gameState = this.board.rightClick(cellIndex);
    return _.cloneDeep(this);
  }
}

export function deserializeGame(json: any): Game {
  var instance = new Game(10, 10, 10); // NOTE: if your constructor checks for unpassed arguments, then just pass dummy ones to prevent throwing an error
  Object.assign(instance, json);
  for (let row = 0; row < instance.board.rows; row++) {
    for (let column = 0; column < instance.board.columns; column++) {
      let cell = new Cell();
      Object.assign(cell, json.board.board[row][column]);
      json.board.board[row][column] = cell;
    }
  }
  instance.board = new Board(10, 10, 10);
  Object.assign(instance.board, json.board);
  return instance;
}
