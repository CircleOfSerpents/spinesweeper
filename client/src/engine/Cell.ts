export enum CellState {
  Unclicked,
  Clicked,
  Flagged,
  Questioned,
  UnclickedMine,
  ClickedMine,
  FlaggedMine,
  QuestionedMine,
  Invalid,
}

export const nonMineStates = [CellState.Unclicked, CellState.Clicked, CellState.Flagged, CellState.Questioned];
export const mineStates = [
  CellState.UnclickedMine,
  CellState.ClickedMine,
  CellState.FlaggedMine,
  CellState.QuestionedMine,
];
export const unclickedStates = [
  CellState.Unclicked,
  CellState.UnclickedMine,
  CellState.Flagged,
  CellState.FlaggedMine,
  CellState.Questioned,
  CellState.QuestionedMine,
];
export const flaggedStates = [CellState.Flagged, CellState.FlaggedMine];
export const unclickedNonMineStates = [CellState.Unclicked, CellState.Flagged, CellState.Questioned];
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
      if (this._isMine) {
        if (this._isFlagged) {
          return CellState.FlaggedMine;
        } else if (this._isQuestioned) {
          return CellState.QuestionedMine;
        } else {
          return CellState.UnclickedMine;
        }
      } else {
        if (this._isFlagged) {
          return CellState.Flagged;
        } else if (this._isQuestioned) {
          return CellState.Questioned;
        } else {
          return CellState.Unclicked;
        }
      }
    }
  }

  public click() {
    if (this._isFlagged || this._isQuestioned) return;
    this._isClicked = true;
  }

  public rightClick() {
    if (this._isClicked) return;
    if (this._isFlagged) {
      this._isFlagged = false;
      this._isQuestioned = true;
    } else if (this._isQuestioned) {
      this._isQuestioned = false;
    } else {
      this._isFlagged = true;
    }
  }

  public set isMine(isMine: boolean) {
    this._isMine = isMine;
  }
}
