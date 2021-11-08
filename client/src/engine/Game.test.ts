import { CellState } from "./Cell";
import Game from "./Game";
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
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.UnclickedMine);
  game.rightClick({ row: 5, column: 5 });
  expect(game.board.getCellState({ row: 5, column: 5 })).toBe(CellState.UnclickedMine);
});
