import Board from "./Board";

export default class Game {
  protected board: Board;

  constructor(rows: number, columns: number, mines: number) {
    this.board = new Board(rows, columns, mines);
  }
}
