import { Cell, CellState } from "./Cell";
import { Game } from "./Game";
import { GameState } from "./GameState";

test("create valid game", () => {
  let game = new Game(10, 10, 50);
  expect(game).toBeDefined();
});

test("clicking starts an idle game", () => {
  let game = new Game(10, 10, 0);
  game.board.board[1][1].isMine = true;
  expect(game.gameState).toBe(GameState.Idle);
  game.click({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Active);
});

test("right clicking starts an idle game", () => {
  let game = new Game(10, 10, 0);
  expect(game.gameState).toBe(GameState.Idle);
  game.rightClick({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Active);
});

test("clicking a mine sets the gameState to Lost", () => {
  let game = new Game(10, 10, 0);
  game.board.board[0][0].isMine = true;
  expect(game.gameState).toBe(GameState.Idle);
  game.click({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Lost);
});

test("clearing all non-mine tiles sets the gameState to Won", () => {
  let game = new Game(10, 10, 0);
  game.board.board[5][5].isMine = true;
  expect(game.gameState).toBe(GameState.Idle);
  game.click({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Won);
});

test("winning the game flags all mines", () => {
  const rows = 10;
  const columns = 10;
  const mines = 10;
  let game = new Game(10, 10, mines);
  expect(game.gameState).toBe(GameState.Idle);
  expect(game.board.mineCount).toBe(mines);
  let minesToQuestion = 1;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (game.board.getCellState({ row, column }) === CellState.Unclicked) {
        game.click({ row, column });
      }
      if (!!minesToQuestion && game.board.getCellState({ row, column }) === CellState.UnclickedMine) {
        game.rightClick({ row, column }); // Flag
        game.rightClick({ row, column }); // Question
      }
    }
  }
  expect(game.gameState).toBe(GameState.Won);
  expect(game.board.mineCount).toBe(0); //All mines should be cleared
  let flaggedMines = game.board.allCells().filter((cell: Cell) => cell.cellState == CellState.FlaggedMine).length;
  expect(flaggedMines).toBe(mines);
});

test("inputs are ignored after the game is Lost", () => {
  let game = new Game(10, 10, 0);
  game.board.board[0][0].isMine = true;
  game.click({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Lost);
  game.click({ row: 5, column: 5 });
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.Unclicked);
  game.rightClick({ row: 5, column: 5 });
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.Unclicked);
});

test("inputs are ignored after the game is Won", () => {
  let game = new Game(10, 10, 0);
  game.board.board[5][5].isMine = true;
  game.click({ row: 0, column: 0 });
  expect(game.gameState).toBe(GameState.Won);
  game.click({ row: 5, column: 5 });
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.FlaggedMine);
  game.rightClick({ row: 5, column: 5 });
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.FlaggedMine);
});
