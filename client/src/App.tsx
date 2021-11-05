import "./App.css";
import Board, { CellIndex } from "./engine/Board";
import GameBoard from "./GameBoard/GameBoard";
import { useState } from "react";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

function App() {
  const [gameBoard, setGameBoard] = useState(new Board(20, 20, 50));

  let onCellClick = (e: React.MouseEvent<HTMLDivElement>, clickedIndex: CellIndex) => {
    if (e.type === "click") {
      const newBoard = gameBoard.click(clickedIndex);
      setGameBoard(newBoard);
    } else if (e.type === "contextmenu") {
      const newBoard = gameBoard.rightClick(clickedIndex);
      setGameBoard(newBoard);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <GameBoard gameBoard={gameBoard} onCellClick={onCellClick} />
      </header>
    </div>
  );
}

export default App;
