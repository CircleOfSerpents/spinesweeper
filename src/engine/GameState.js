"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["Idle"] = 0] = "Idle";
    GameState[GameState["Active"] = 1] = "Active";
    GameState[GameState["Won"] = 2] = "Won";
    GameState[GameState["Lost"] = 3] = "Lost";
})(GameState = exports.GameState || (exports.GameState = {}));
