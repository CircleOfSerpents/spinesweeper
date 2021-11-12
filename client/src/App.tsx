import "./App.css";
import { CellIndex } from "./engine/Board";
import GameBoard from "./GameBoard/GameBoard";
import { useState } from "react";
import Game from "./engine/Game";
import GameTimer from "./GameTimer/GameTimer";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

function App() {
  const [game, setGame] = useState(new Game(20, 20, 50));

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
    setGame(new Game(20, 20, 50));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={reset}>Reset</button>
        <GameTimer gameState={game.gameState} />
        <GameBoard gameBoard={game.board} onCellClick={onCellClick} />
      </header>
    </div>
  );
}

export default App;
