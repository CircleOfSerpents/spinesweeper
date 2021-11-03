import Game from "./Game";

test("create valid game", () => {
  let game = new Game(10, 10, 50);
  expect(game).toBeDefined();
});
