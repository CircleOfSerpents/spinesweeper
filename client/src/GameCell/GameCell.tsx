import "./GameCell.css";
import {CellState, unclickedStates} from "../engine/Cell"

type GameCellProps = {
  cellState: CellState;
  numNeighborMines: number;
};

function GameCell({cellState, numNeighborMines}: GameCellProps) {
  const getContent = (): string => {
    if (cellState === CellState.Clicked) {
      if (numNeighborMines > 0){
        return String(numNeighborMines)
      }
    }
    if (cellState === CellState.ClickedMine) {
      return "💣"
    }
    return ""
  }

  const getClass = (): string => {
    if (unclickedStates.includes(cellState)){
      return "unclicked"
    } else if (cellState === CellState.Clicked) {
      return "clicked"
    } else if (cellState === CellState.ClickedMine) {
      return "clicked-mine"
    }

    return ""
  }

  return <div className={`GameCell ${getClass()}`}>
    {getContent()}
  </div>
}

export default GameCell;
