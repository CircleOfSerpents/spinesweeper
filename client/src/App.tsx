import './App.css';
import Board, { CellIndex } from "./engine/Board";
import GameBoard from "./GameBoard/GameBoard"
import { useState } from 'react';

function App() {
  const [gameBoard, setGameBoard] = useState(new Board(20, 20, 50));

  let onCellClick = (clickedIndex: CellIndex) => {
    const newBoard = gameBoard.click(clickedIndex)
    console.log(newBoard.board)
    setGameBoard(newBoard)
  }

  return (
    <div className="App">
      <header className="App-header">
        <GameBoard gameBoard={gameBoard} onCellClick={onCellClick}/>
      </header>
    </div>
  );
}

export default App;
