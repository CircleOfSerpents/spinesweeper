import "./GameTimer.css";
import { GameState } from "../../../engine/GameState";
import { useEffect, useRef, useState } from "react";

type GameTimerProps = {
  gameState: GameState;
};

/**
 * An effect used to keep and update state for the game timer
 * @param increment callback to increment the timer
 * @param clear callback to reset the counter to zero
 * @param gameState the current GameState
 */
function useTimer(increment: Function, clear: Function, gameState: GameState) {
  const savedIncrement = useRef<Function>();
  const savedClear = useRef<Function>();
  let interval = useRef<NodeJS.Timer>();

  function tick() {
    savedIncrement.current && savedIncrement.current();
  }

  useEffect(() => {
    savedIncrement.current = increment;
    savedClear.current = clear;
  });

  useEffect(() => {
    if (gameState === GameState.Active) {
      interval.current = setInterval(tick, 1000);
    } else if (
      (gameState === GameState.Lost || gameState === GameState.Won || gameState === GameState.Idle) &&
      interval.current !== undefined
    ) {
      clearInterval(interval.current);
      if (gameState === GameState.Idle) {
        savedClear.current && savedClear.current(0); // Going Idle implies the game was reset
      }
    }
  }, [gameState]);
}

function GameCell({ gameState }: GameTimerProps) {
  const [timer, setTimer] = useState(0);

  useTimer(
    () => setTimer(timer + 1),
    () => setTimer(0),
    gameState
  );

  return <div>{timer}</div>;
}

export default GameCell;
