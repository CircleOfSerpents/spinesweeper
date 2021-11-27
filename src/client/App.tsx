import "./App.css";
import { useState } from "react";
import { CellIndex } from "../engine/Board";
import { Game } from "../engine/Game";
import GameBoard from "./components/GameBoard/GameBoard";
import GameTimer from "./components/GameTimer/GameTimer";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

function App() {
  const rows = 20;
  const columns = 20;
  const mines = 50;

  const [game, setGame] = useState(new Game(rows, columns, mines));

  let onCellClick = (e: React.MouseEvent<HTMLDivElement>, clickedIndex: CellIndex) => {
    if (e.type === "click") {
      const newGame = game.click(clickedIndex);
      setGame(newGame);
    } else if (e.type === "contextmenu") {
      const newGame = game.rightClick(clickedIndex);
      setGame(newGame);
    }
  };

  let reset = () => {
    setGame(new Game(rows, columns, mines));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={reset}>Reset</button>
        <div className="header-numbers">
          <GameTimer gameState={game.gameState} />
          {game.board.mineCount}
        </div>
        <GameBoard gameBoard={game.board} onCellClick={onCellClick} />
      </header>
    </div>
  );
}

export default App;
