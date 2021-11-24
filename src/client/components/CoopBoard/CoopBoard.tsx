import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import "./CoopBoard.css";

import GameBoard from "../GameBoard/GameBoard";
import GameTimer from "../GameTimer/GameTimer";
import { CellIndex } from "../../../engine/Board";
import { deserializeGame, Game } from "../../../engine/Game";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

function App() {
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io("http://localhost:3002");
    socket.current.on("setGame", (game) => {
      setGame(deserializeGame(game));
    });
  }, []);

  const [game, setGame] = useState<Game>();

  let onCellClick = (e: React.MouseEvent<HTMLDivElement>, clickedIndex: CellIndex) => {
    if (e.type === "click") {
      socket.current && socket.current.emit("click", clickedIndex);
    } else if (e.type === "contextmenu") {
      socket.current && socket.current.emit("rightClick", clickedIndex);
    }
  };

  let reset = () => {
    socket.current && socket.current.emit("resetGame");
  };

  return (
    <div className="App">
      {!!game && (
        <header className="App-header">
          <button onClick={reset}>Reset</button>

          <div className="header-numbers">
            <GameTimer gameState={game.gameState} />
            {game.board.mineCount}
          </div>
          <GameBoard gameBoard={game.board} onCellClick={onCellClick} />
        </header>
      )}
    </div>
  );
}

export default App;
