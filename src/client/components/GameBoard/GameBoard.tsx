import "./GameBoard.css";
import { Board, CellIndex } from "../../../engine/Board";
import { Cell } from "../../../engine/Cell";
import GameCell from "../GameCell/GameCell";

type GameBoardProps = {
  gameBoard: Board;
  onCellClick: (e: React.MouseEvent<HTMLDivElement>, cellIndex: CellIndex) => void;
};

function GameBoard({ gameBoard, onCellClick }: GameBoardProps) {
  return (
    <div className="GameBoard" id="game-board" data-testid="game-board">
      {gameBoard.board.map((row: Cell[], rowNumber: number) => (
        <div className="Row" key={rowNumber}>
          {row.map((cell: Cell, columnNumber: number) => (
            <div
              className="Cell"
              key={columnNumber}
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                onCellClick(e, { row: rowNumber, column: columnNumber })
              }
              onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                onCellClick(e, { row: rowNumber, column: columnNumber })
              }
            >
              {
                <GameCell
                  cellState={gameBoard.getCellState({ row: rowNumber, column: columnNumber })}
                  numNeighborMines={gameBoard.getCellNumNeighborMines({ row: rowNumber, column: columnNumber })}
                />
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
