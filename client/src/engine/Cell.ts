export default class Cell {
  public _isClicked: boolean = false;
  public _isMine: boolean = false;

  constructor() {}

  public get isMine(): boolean {
    return this._isMine;
  }

  public set isMine(isMine: boolean) {
    this._isMine = isMine;
  }

  public get isClicked(): boolean {
    return this._isClicked;
  }

  public set isClicked(isClicked: boolean) {
    this._isClicked = isClicked;
  }
}
