"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = exports.clickedStates = exports.unclickedNonMineStates = exports.flaggedStates = exports.unclickedStates = exports.mineStates = exports.nonMineStates = exports.CellState = void 0;
var CellState;
(function (CellState) {
    CellState[CellState["Unclicked"] = 0] = "Unclicked";
    CellState[CellState["Clicked"] = 1] = "Clicked";
    CellState[CellState["Flagged"] = 2] = "Flagged";
    CellState[CellState["Questioned"] = 3] = "Questioned";
    CellState[CellState["UnclickedMine"] = 4] = "UnclickedMine";
    CellState[CellState["ClickedMine"] = 5] = "ClickedMine";
    CellState[CellState["FlaggedMine"] = 6] = "FlaggedMine";
    CellState[CellState["QuestionedMine"] = 7] = "QuestionedMine";
    CellState[CellState["Invalid"] = 8] = "Invalid";
})(CellState = exports.CellState || (exports.CellState = {}));
exports.nonMineStates = [CellState.Unclicked, CellState.Clicked, CellState.Flagged, CellState.Questioned];
exports.mineStates = [
    CellState.UnclickedMine,
    CellState.ClickedMine,
    CellState.FlaggedMine,
    CellState.QuestionedMine,
];
exports.unclickedStates = [
    CellState.Unclicked,
    CellState.UnclickedMine,
    CellState.Flagged,
    CellState.FlaggedMine,
    CellState.Questioned,
    CellState.QuestionedMine,
];
exports.flaggedStates = [CellState.Flagged, CellState.FlaggedMine];
exports.unclickedNonMineStates = [CellState.Unclicked, CellState.Flagged, CellState.Questioned];
exports.clickedStates = [CellState.Clicked, CellState.ClickedMine];
var Cell = /** @class */ (function () {
    function Cell() {
        this._isClicked = false;
        this._isMine = false;
        this._isFlagged = false;
        this._isQuestioned = false;
    }
    Object.defineProperty(Cell.prototype, "cellState", {
        get: function () {
            if (this._isClicked) {
                if (this._isMine) {
                    return CellState.ClickedMine;
                }
                else {
                    return CellState.Clicked;
                }
            }
            else {
                if (this._isMine) {
                    if (this._isFlagged) {
                        return CellState.FlaggedMine;
                    }
                    else if (this._isQuestioned) {
                        return CellState.QuestionedMine;
                    }
                    else {
                        return CellState.UnclickedMine;
                    }
                }
                else {
                    if (this._isFlagged) {
                        return CellState.Flagged;
                    }
                    else if (this._isQuestioned) {
                        return CellState.Questioned;
                    }
                    else {
                        return CellState.Unclicked;
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.click = function () {
        if (this._isFlagged || this._isQuestioned)
            return;
        this._isClicked = true;
    };
    Cell.prototype.rightClick = function () {
        if (this._isClicked)
            return;
        if (this._isFlagged) {
            this._isFlagged = false;
            this._isQuestioned = true;
        }
        else if (this._isQuestioned) {
            this._isQuestioned = false;
        }
        else {
            this._isFlagged = true;
        }
    };
    Object.defineProperty(Cell.prototype, "isMine", {
        set: function (isMine) {
            this._isMine = isMine;
        },
        enumerable: false,
        configurable: true
    });
    return Cell;
}());
exports.Cell = Cell;
