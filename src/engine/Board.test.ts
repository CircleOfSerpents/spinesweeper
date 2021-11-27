import { Board, CellIndex } from "./Board";
import { Cell, CellState } from "./Cell";

test("create valid board", () => {
  let mines = 35;
  let board = new Board(10, 10, mines);
  expect(board).toBeDefined();

  let actualMines = 0;
  for (let row = 0; row < board.rows; row++) {
    for (let column = 0; column < board.columns; column++) {
      if (board.getCellState({ row, column }) === CellState.UnclickedMine) {
        actualMines++;
      }
    }
  }
  expect(actualMines).toBe(mines);
});

test("create board with too many mines", () => {
  expect(() => new Board(10, 10, 51)).toThrow("Please provide a number of mines between 0 and 50");
});

test("create board too big", () => {
  expect(() => new Board(200, 50, 51)).toThrow("Please provide a number of rows between 1 and 100");
  expect(() => new Board(50, 200, 51)).toThrow("Please provide a number of columns between 1 and 100");
});

test("getCellNumMineNeighbors returns proper number of neighbors with mines", () => {
  let board = new Board(10, 10, 0);

  // Check cell in the middle of board
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(0);
  board.board[4][4].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(1);
  board.board[4][5].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(2);
  board.board[4][6].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(3);
  board.board[5][4].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(4);
  board.board[5][6].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(5);
  board.board[6][4].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(6);
  board.board[6][5].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(7);
  board.board[6][6].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 5, column: 5 })).toBe(8);

  // Check cell on the edge of board with neighbors out of bounds
  expect(board.getCellNumNeighborMines({ row: 9, column: 9 })).toBe(0);
  board.board[8][8].isMine = true;
  expect(board.getCellNumNeighborMines({ row: 9, column: 9 })).toBe(1);
  board.board[8][9].rightClick();
  expect(board.getCellNumNeighborMines({ row: 9, column: 9 })).toBe(1);
  board.board[9][8].rightClick();
  board.board[9][8].rightClick();
  expect(board.getCellNumNeighborMines({ row: 9, column: 9 })).toBe(1);
});

test("clicking an empty board (no mines) should click all tiles", () => {
  const rows = 10;
  const columns = 10;
  let board = new Board(rows, columns, 0);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      expect(board.board[row][column].cellState).toBe(CellState.Unclicked);
    }
  }

  board.click({ row: 5, column: 5 });
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      expect(board.board[row][column].cellState).toBe(CellState.Clicked);
    }
  }
});

test("right clicking an unclicked cell cycles bettween unclicked/flagged/questioned", () => {
  const rows = 2;
  const columns = 2;
  let board = new Board(rows, columns, 0);
  board.board[1][1].isMine = true;

  expect(board.board[0][0].cellState).toBe(CellState.Unclicked);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Flagged);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Questioned);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Unclicked);

  expect(board.board[1][1].cellState).toBe(CellState.UnclickedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.FlaggedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.QuestionedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.UnclickedMine);
});

test("clicking a flagged or questioned cell does nothing", () => {
  const rows = 2;
  const columns = 2;
  let board = new Board(rows, columns, 0);
  board.board[1][1].isMine = true;

  expect(board.board[0][0].cellState).toBe(CellState.Unclicked);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Flagged);
  board.board[0][0].click();
  expect(board.board[0][0].cellState).toBe(CellState.Flagged);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Questioned);
  board.board[0][0].click();
  expect(board.board[0][0].cellState).toBe(CellState.Questioned);
  board.board[0][0].rightClick();
  expect(board.board[0][0].cellState).toBe(CellState.Unclicked);
  board.board[0][0].click();
  expect(board.board[0][0].cellState).toBe(CellState.Clicked);

  expect(board.board[1][1].cellState).toBe(CellState.UnclickedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.FlaggedMine);
  board.board[1][1].click();
  expect(board.board[1][1].cellState).toBe(CellState.FlaggedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.QuestionedMine);
  board.board[1][1].click();
  expect(board.board[1][1].cellState).toBe(CellState.QuestionedMine);
  board.board[1][1].rightClick();
  expect(board.board[1][1].cellState).toBe(CellState.UnclickedMine);
  board.board[1][1].click();
  expect(board.board[1][1].cellState).toBe(CellState.ClickedMine);
});

test("floodfilling an area ignores flagged and questioned cells", () => {
  const rows = 4;
  const columns = 4;
  let board = new Board(rows, columns, 0);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      expect(board.board[row][column].cellState).toBe(CellState.Unclicked);
    }
  }
  board.board[0][0].rightClick(); // flag
  board.board[1][1].rightClick(); // flag
  board.board[1][1].rightClick(); // question

  board.click({ row: 3, column: 3 });
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (row == 0 && column == 0) {
        expect(board.board[row][column].cellState).toBe(CellState.Flagged);
      } else if (row == 1 && column == 1) {
        expect(board.board[row][column].cellState).toBe(CellState.Questioned);
      } else {
        expect(board.board[row][column].cellState).toBe(CellState.Clicked);
      }
    }
  }
});

test("clicking a clicked cell with flagged adjacent mines will clear all non-flagged neighbors", () => {
  let board = new Board(5, 5, 0);
  board.board[1][1].isMine = true;
  board.board[3][3].isMine = true;
  board.board[1][2].isMine = true;
  board.click({ row: 2, column: 2 });
  board.rightClick({ row: 1, column: 1 });
  board.rightClick({ row: 3, column: 3 });
  board.rightClick({ row: 1, column: 2 });

  board.click({ row: 2, column: 2 });
  compareBoardState(board.board, [
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.FlaggedMine, CellState.FlaggedMine, CellState.Clicked, CellState.Unclicked],
    [CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.Unclicked],
    [CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.FlaggedMine, CellState.Unclicked],
    [CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.Unclicked, CellState.Unclicked],
  ]);
});

test("clicking a clicked cell with improperly, but same number of, flagged adjacent mines will explode", () => {
  let board = new Board(5, 5, 0);
  board.board[1][1].isMine = true;
  board.board[3][3].isMine = true;
  board.board[1][2].isMine = true;
  board.click({ row: 2, column: 2 });
  board.rightClick({ row: 2, column: 1 });
  board.rightClick({ row: 3, column: 3 });
  board.rightClick({ row: 1, column: 2 });

  board.rightClick({ row: 2, column: 2 });
  compareBoardState(board.board, [
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.ClickedMine, CellState.FlaggedMine, CellState.Clicked, CellState.Unclicked],
    [CellState.Clicked, CellState.Flagged, CellState.Clicked, CellState.Clicked, CellState.Unclicked],
    [CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.FlaggedMine, CellState.Unclicked],
    [CellState.Clicked, CellState.Clicked, CellState.Clicked, CellState.Unclicked, CellState.Unclicked],
  ]);
});

test("clicking a clicked cell with a different number of flagged and mine neighbors does nothing", () => {
  let board = new Board(5, 5, 0);
  board.board[1][1].isMine = true;
  board.board[3][3].isMine = true;
  board.board[1][2].isMine = true;
  board.click({ row: 2, column: 2 });
  board.rightClick({ row: 2, column: 1 });
  board.rightClick({ row: 3, column: 3 });

  board.rightClick({ row: 2, column: 2 });
  compareBoardState(board.board, [
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.UnclickedMine, CellState.UnclickedMine, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.Flagged, CellState.Clicked, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.FlaggedMine, CellState.Unclicked],
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
  ]);

  board.rightClick({ row: 1, column: 2 });
  board.rightClick({ row: 2, column: 3 });

  board.rightClick({ row: 2, column: 2 });
  compareBoardState(board.board, [
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.UnclickedMine, CellState.FlaggedMine, CellState.Unclicked, CellState.Unclicked],
    [CellState.Unclicked, CellState.Flagged, CellState.Clicked, CellState.Flagged, CellState.Unclicked],
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.FlaggedMine, CellState.Unclicked],
    [CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked, CellState.Unclicked],
  ]);
});

test("clicking an empty cell floodfills all cells with no neighboring mines", () => {
  /**
   * 0 0 0 m m m m      1 1 1 m m m m
   * 0 0 0 m m m m      1 1 1 m m m m
   * 0 0 0 0 0 m m      1 1 1 1 1 m m
   * 0 0 0 0 0 0 m  ->  1 1 1 1 1 0 m
   * 0 0 0 0 0 0 0      1 1 1 1 1 0 0
   * 0 0 0 m m m m      1 1 1 m m m m
   * c 0 0 m m m m      1 1 1 m m m m
   */
  const mines = [
    { row: 0, column: 3 },
    { row: 0, column: 4 },
    { row: 0, column: 5 },
    { row: 0, column: 6 },
    { row: 1, column: 3 },
    { row: 1, column: 4 },
    { row: 1, column: 5 },
    { row: 1, column: 6 },
    { row: 2, column: 5 },
    { row: 2, column: 6 },
    { row: 3, column: 6 },
    { row: 5, column: 3 },
    { row: 5, column: 4 },
    { row: 5, column: 5 },
    { row: 5, column: 6 },
    { row: 6, column: 3 },
    { row: 6, column: 4 },
    { row: 6, column: 5 },
    { row: 6, column: 6 },
  ];
  const clicked = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
    { row: 2, column: 3 },
    { row: 2, column: 4 },
    { row: 3, column: 0 },
    { row: 3, column: 1 },
    { row: 3, column: 2 },
    { row: 3, column: 3 },
    { row: 4, column: 4 },
    { row: 4, column: 0 },
    { row: 4, column: 1 },
    { row: 4, column: 2 },
    { row: 4, column: 3 },
    { row: 4, column: 4 },
    { row: 5, column: 0 },
    { row: 5, column: 1 },
    { row: 5, column: 2 },
    { row: 6, column: 0 },
    { row: 6, column: 1 },
    { row: 6, column: 2 },
  ];
  const unclicked = [
    { row: 3, column: 5 },
    { row: 4, column: 5 },
    { row: 4, column: 6 },
  ];
  let board = new Board(7, 7, 0);
  setMines(board, mines);
  board.click({ row: 6, column: 0 });
  verifyState(board, clicked, CellState.Clicked);
  verifyState(board, unclicked, CellState.Unclicked);
  verifyState(board, mines, CellState.UnclickedMine);
});

test("clicking a mine sets all mines to ClickedMine", () => {
  /**
   * 0 0 0 m m m m      0 0 0 x x x x
   * 0 0 0 m m m m      0 0 0 x x x x
   * 0 0 0 0 0 m m      0 0 0 0 0 x x
   * 0 0 0 0 0 0 m  ->  0 0 0 0 0 0 x
   * 0 0 0 0 0 0 1      0 0 0 0 0 0 1
   * 0 0 0 m m m m      0 0 0 x x x x
   * 0 0 0 c m m m      0 0 0 x x x x
   */
  const mines = [
    { row: 0, column: 3 },
    { row: 0, column: 4 },
    { row: 0, column: 5 },
    { row: 0, column: 6 },
    { row: 1, column: 3 },
    { row: 1, column: 4 },
    { row: 1, column: 5 },
    { row: 1, column: 6 },
    { row: 2, column: 5 },
    { row: 2, column: 6 },
    { row: 3, column: 6 },
    { row: 5, column: 3 },
    { row: 5, column: 4 },
    { row: 5, column: 5 },
    { row: 5, column: 6 },
    { row: 6, column: 3 },
    { row: 6, column: 4 },
    { row: 6, column: 5 },
    { row: 6, column: 6 },
  ];
  const unclicked = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
    { row: 2, column: 3 },
    { row: 2, column: 4 },
    { row: 3, column: 0 },
    { row: 3, column: 1 },
    { row: 3, column: 2 },
    { row: 3, column: 3 },
    { row: 4, column: 4 },
    { row: 4, column: 0 },
    { row: 4, column: 1 },
    { row: 4, column: 2 },
    { row: 4, column: 3 },
    { row: 4, column: 4 },
    { row: 5, column: 0 },
    { row: 5, column: 1 },
    { row: 5, column: 2 },
    { row: 6, column: 0 },
    { row: 6, column: 1 },
    { row: 6, column: 2 },
    { row: 3, column: 5 },
    { row: 4, column: 5 },
  ];
  const clicked = [{ row: 4, column: 6 }];
  let board = new Board(7, 7, 0);
  setMines(board, mines);
  verifyState(board, mines, CellState.UnclickedMine);
  board.click({ row: 4, column: 6 });
  verifyState(board, clicked, CellState.Clicked);
  board.click({ row: 6, column: 3 });
  verifyState(board, clicked, CellState.Clicked);
  verifyState(board, unclicked, CellState.Unclicked);
  verifyState(board, mines, CellState.ClickedMine);
});

test("flagging a cell should decrement mineCount", () => {
  const rows = 10;
  const columns = 10;
  const mines = 3;
  let board = new Board(rows, columns, 3);
  expect(board.mineCount).toBe(mines);
  board.rightClick({ row: 0, column: 0 });
  expect(board.mineCount).toBe(2);
  board.rightClick({ row: 1, column: 1 });
  expect(board.mineCount).toBe(1);
  board.rightClick({ row: 2, column: 2 });
  expect(board.mineCount).toBe(0);
  board.rightClick({ row: 0, column: 2 });
  expect(board.mineCount).toBe(-1);
});

let setMines = (board: Board, mineList: CellIndex[]) => {
  mineList.forEach((cellIndex) => {
    board.board[cellIndex.row][cellIndex.column].isMine = true;
  });
};

let verifyState = (board: Board, cellList: CellIndex[], state: CellState) => {
  cellList.forEach((cellIndex) => {
    expect(board.board[cellIndex.row][cellIndex.column].cellState).toBe(state);
  });
};

let compareBoardState = (actual: Cell[][], expected: CellState[][]) => {
  actual.forEach((row, rowNumber) => {
    row.forEach((cell, columnNumber) => {
      expect(cell.cellState).toBe(expected[rowNumber][columnNumber]);
    });
  });
};
