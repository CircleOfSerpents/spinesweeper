export enum CellState {
  Unclicked,
  Clicked,
  Flagged,
  Questioned,
  UnclickedMine,
  ClickedMine,
  Invalid,
}

export const nonMineStates = [CellState.Unclicked, CellState.Clicked];
export const mineStates = [CellState.UnclickedMine, CellState.ClickedMine];
export const unclickedStates = [CellState.Unclicked, CellState.UnclickedMine];
export const unclickedNonMineStates = [CellState.Unclicked];
export const clickedStates = [CellState.Clicked, CellState.ClickedMine];

export default class Cell {
  private _isClicked: boolean = false;
  private _isMine: boolean = false;
  private _isFlagged: boolean = false;
  private _isQuestioned: boolean = false;

  public get cellState(): CellState {
    if (this._isClicked) {
      if (this._isMine) {
        return CellState.ClickedMine;
      } else {
        return CellState.Clicked;
      }
    } else {
      if (this._isFlagged) {
        return CellState.Flagged;
      } else if (this._isQuestioned) {
        return CellState.Questioned;
      } else if (this._isMine) {
        return CellState.UnclickedMine;
      } else {
        return CellState.Unclicked;
      }
    }
  }

  public click() {
    if (this._isFlagged || this._isQuestioned) return;
    this._isClicked = true;
  }

  public set isMine(isMine: boolean) {
    this._isMine = isMine;
  }
}
