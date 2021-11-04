import "./GameBoard.css";
import Board, { CellIndex, CellState } from "../engine/Board";
import GameCell from "../GameCell/GameCell";

type GameBoardProps = {
  gameBoard: Board;
  onCellClick: (cellIndex: CellIndex) => void;
};


function GameBoard({ gameBoard, onCellClick }: GameBoardProps) {
  return <div className="GameBoard" id="board">
    {gameBoard.board.map((row: CellState[], rowNumber: number) => (
      <div className="Row" key={rowNumber}>
        {row.map((cell: CellState, columnNumber: number) => (
          <div className="Cell" key={columnNumber} onClick={() => onCellClick({row: rowNumber, column: columnNumber})}>
            {<GameCell 
            cellState={gameBoard.getCellState({row: rowNumber, column: columnNumber})}
            numNeighborMines={gameBoard.getCellNumNeighborMines({row: rowNumber, column: columnNumber})}/>}
          </div>
        ))}
      </div>
    ))}
  </div>
}

export default GameBoard;
