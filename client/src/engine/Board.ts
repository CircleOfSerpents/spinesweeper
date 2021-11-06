import _ from "lodash";
import Cell, { CellState, flaggedStates, mineStates, unclickedNonMineStates, unclickedStates } from "./Cell";

const neighborOffsets = [
  { row: 0, column: 1 },
  { row: 1, column: 0 },
  { row: 0, column: -1 },
  { row: -1, column: 0 },
  { row: 1, column: 1 },
  { row: -1, column: -1 },
  { row: 1, column: -1 },
  { row: -1, column: 1 },
];

export type CellIndex = {
  row: number;
  column: number;
};

export default class Board {
  public rows: number;
  public columns: number;
  public mines: number;
  public board: Cell[][];

  constructor(rows: number, columns: number, mines: number) {
    this.validateInputs(rows, columns, mines);
    this.rows = rows;
    this.columns = columns;
    this.mines = 0; // Initialize to 0 because we will increment as each mine is added
    this.board = this.createInternalBoard(mines);
    this.addMines(mines);
  }

  public size(): number {
    return this.rows * this.columns;
  }

  public click(cellIndex: CellIndex): Board {
    let cellState = this.getCellState(cellIndex);
    if (cellState === CellState.Unclicked) {
      this.floodfill(cellIndex);
    } else if (cellState === CellState.UnclickedMine) {
      this.explode();
    } else if (this.isFullyFlaggedCell(cellIndex)) {
      this.clickAllNeighbors(cellIndex);
    }
    return _.cloneDeep(this);
  }

  public rightClick(cellIndex: CellIndex): Board {
    let cell = this.getCell(cellIndex);
    if (unclickedStates.includes(cell.cellState)) {
      cell.rightClick();
    } else if (this.isFullyFlaggedCell(cellIndex)) {
      this.clickAllNeighbors(cellIndex);
    }
    return _.cloneDeep(this);
  }

  protected clickAllNeighbors(cellIndex: CellIndex) {
    // Click all neighbors
    this.getInBoundNeighbors(cellIndex).forEach((neighbor) => {
      if (this.getCellState(neighbor) === CellState.UnclickedMine) {
        this.explode();
      } else {
        this.floodfill(neighbor);
      }
    });
  }

  /**
   * Calculate the count of the number of adjacent mines in the 8 neighbors of the cell at board[row][column]
   * @param row the row of the cell
   * @param column the column of the cell
   * @returns a count of neighbors containing mines
   */
  public getCellNumNeighborMines(cellIndex: CellIndex): number {
    if (!this.isCellInBounds(cellIndex)) return 0;
    return this.getInBoundNeighbors(cellIndex)
      .map((neighbor) => this.isMineCell(neighbor))
      .filter(Boolean).length;
  }

  /**
   * Calculate the count of the number of adjacent flagged cells in the 8 neighbors of the cell at board[row][column]
   * @param row the row of the cell
   * @param column the column of the cell
   * @returns a count of flagged neighbors
   */
  public getCellNumNeighborFlags(cellIndex: CellIndex): number {
    if (!this.isCellInBounds(cellIndex)) return 0;
    return this.getInBoundNeighbors(cellIndex)
      .map((neighbor) => this.isFlaggedCell(neighbor))
      .filter(Boolean).length;
  }

  /**
   * Get the current Cell at board[row][column]
   * @param row the row of the cell
   * @param column the column of the cell
   * @returns the Cell at board[row][column]
   */
  public getCell(cellIndex: CellIndex): Cell {
    if (!this.isCellInBounds(cellIndex)) {
      throw Error("Cell out of bounds");
    }
    return this.board[cellIndex.row][cellIndex.column];
  }

  /**
   * Get the current CellState for the cell at board[row][column]
   * @param row the row of the cell
   * @param column the column of the cell
   * @returns the current CellState for the cell at board[row][column]
   */
  public getCellState(cellIndex: CellIndex): CellState {
    if (!this.isCellInBounds(cellIndex)) {
      throw Error("Cell out of bounds");
    }
    return this.board[cellIndex.row][cellIndex.column].cellState;
  }

  /**
   * Depth first search floodfill of open unclicked areas
   */
  protected floodfill(cellIndex: CellIndex) {
    let cellState = this.getCellState(cellIndex);
    if (cellState === CellState.Unclicked) {
      this.getCell(cellIndex).click();
      if (this.getCellNumNeighborMines(cellIndex) === 0) {
        this.getInBoundNeighbors(cellIndex).forEach((neighbor) => {
          this.floodfill(neighbor);
        });
      }
    }
  }

  /**
   * Mark all bombs as clicked
   */
  protected explode() {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (this.isMineCell({ row, column })) {
          this.board[row][column].click();
        }
      }
    }
  }

  protected getInBoundNeighbors(cellIndex: CellIndex): CellIndex[] {
    let inBoundsNeighbors: CellIndex[] = [];
    neighborOffsets.forEach((offset) => {
      let neighbor: CellIndex = { row: cellIndex.row + offset.row, column: cellIndex.column + offset.column };
      if (this.isCellInBounds(neighbor)) {
        inBoundsNeighbors.push(neighbor);
      }
    });
    return inBoundsNeighbors;
  }

  protected isCellInBounds(cellIndex: CellIndex): boolean {
    if (cellIndex.row < 0 || cellIndex.row >= this.rows) return false;
    if (cellIndex.column < 0 || cellIndex.column >= this.columns) return false;
    return true;
  }

  protected createInternalBoard(mines: number): Cell[][] {
    let board = Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      board[row] = Array(this.columns);
      for (let column = 0; column < this.columns; column++) {
        board[row][column] = new Cell();
      }
    }
    return board;
  }

  protected addMines(mines: number) {
    const maxMines = (this.rows * this.columns) / 2;
    let addedMines = 0;
    while (addedMines < mines && this.mines < maxMines) {
      let row = this.getRandomInt(this.rows);
      let column = this.getRandomInt(this.columns);
      if (this.isUnclickedNonMineCell({ row, column })) {
        this.board[row][column].isMine = true;
        addedMines++;
        this.mines++;
      }
    }
  }

  protected isMineCell(cellIndex: CellIndex) {
    return mineStates.includes(this.getCellState(cellIndex));
  }

  protected isUnclickedNonMineCell(cellIndex: CellIndex) {
    return unclickedNonMineStates.includes(this.getCellState(cellIndex));
  }

  protected isFlaggedCell(cellIndex: CellIndex) {
    return flaggedStates.includes(this.getCellState(cellIndex));
  }

  protected isFullyFlaggedCell(cellIndex: CellIndex) {
    return (
      this.getCellState(cellIndex) === CellState.Clicked &&
      this.getCellNumNeighborFlags(cellIndex) === this.getCellNumNeighborMines(cellIndex)
    );
  }

  protected validateInputs(rows: number, columns: number, mines: number): void {
    const maxMines = (rows * columns) / 2;
    if (mines < 0 || mines > maxMines) {
      throw Error(`Please provide a number of mines between 0 and ${maxMines}`);
    }
    if (rows <= 0 || rows > 100) {
      throw Error("Please provide a number of rows between 1 and 100");
    }
    if (columns <= 0 || columns > 100) {
      throw Error("Please provide a number of columns between 1 and 100");
    }
  }

  protected getRandomInt(max: number) {
    return Math.floor(Math.random() * (max - 1));
  }
}
