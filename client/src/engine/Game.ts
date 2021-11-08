import _ from "lodash";
import Board, { CellIndex } from "./Board";
import { GameState } from "./GameState";

export default class Game {
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
