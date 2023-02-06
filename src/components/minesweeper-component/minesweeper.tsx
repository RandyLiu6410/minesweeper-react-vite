import React from "react";
import styled from "styled-components";
import { BOARD_STATUS } from "../../models/board";
import { BoardView, BoardRef } from "../board-component/board-view";
import { Timer, TimerRef } from "../timer-component/timer";
import { MinesweeperHeader } from "./header";
import { MinesweeperLevelSelector } from "./level-selector";
import { MinesweeperPlaceholder } from "./placeholder";
import { MinesweeperRecord } from "./record";
import { MinesweeperRestart } from "./restart";

export type LEVEL = "easy" | "medium" | "hard";

export type LEVEL_PROP = {
  rowCount: number;
  colCount: number;
  mineCount: number;
};

export type LEVEL_MAP = {
  [key in LEVEL]: LEVEL_PROP;
};

const LEVEL_MAPS: LEVEL_MAP = {
  easy: {
    rowCount: 8,
    colCount: 8,
    mineCount: 8,
  },
  medium: {
    rowCount: 16,
    colCount: 16,
    mineCount: 20,
  },
  hard: {
    rowCount: 30,
    colCount: 30,
    mineCount: 50,
  },
};

export type SQUARE_SIZE_MAP = {
  [key in LEVEL]: number;
};

const StyledMinesweeper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledBoardWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-image: url("https://thumbs.dreamstime.com/b/pixel-art-water-background-seamless-sea-texture-backdrop-vector-illustration-223655049.jpg");
`;

export const Minesweeper = React.memo(() => {
  const timerRef = React.useRef<TimerRef>(null);
  const boardRef = React.useRef<BoardRef>(null);
  const [boardStatus, setBoardStatus] = React.useState<BOARD_STATUS>();
  const [remainingMineCount, setRemainingMineCount] = React.useState(0);
  const [time, setTime] = React.useState(0);

  const [level, setLevel] = React.useState<LEVEL>("medium");

  const [boardEl, setBoardEl] = React.useState<HTMLDivElement>();

  const startTimer = () => {
    if (timerRef.current) {
      timerRef.current.start();
    }
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      timerRef.current.pause();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      timerRef.current.reset();
    }
  };

  const handleTimerTimeChange = (value: number) => setTime(value);

  const handleBoardStart = () => {
    startTimer();
  };

  const restartBoard = () => {
    if (boardRef.current) {
      boardRef.current.restart();
    }
  };

  const handleRemainingMineCountChange = (value: number) =>
    setRemainingMineCount(value);

  const handleBoardStatusChange = (status: BOARD_STATUS) => {
    setBoardStatus(status);

    if (status === "READY") resetTimer();
    else if (status !== "ONGOING") pauseTimer();
    else startTimer();
  };

  const handleLevelChange = (level: LEVEL) => {
    setLevel(level);
    restartBoard();
  };

  const squareSize = React.useMemo(() => {
    if (boardEl) {
      const levelMap = LEVEL_MAPS[level];
      const width = boardEl.offsetWidth / levelMap.colCount;
      const height = boardEl.offsetHeight / levelMap.rowCount;
      return Math.floor(Math.min(width, height));
    }
    return 0;
  }, [boardEl, level]);

  return (
    <StyledMinesweeper>
      <MinesweeperHeader
        levelSelector={
          <MinesweeperLevelSelector
            currentLevel={level}
            levels={Object.keys(LEVEL_MAPS) as LEVEL[]}
            onLevelChange={handleLevelChange}
          />
        }
        record={
          <MinesweeperRecord
            remainingMineCount={remainingMineCount}
            time={time}
          />
        }
      />
      <Timer ref={timerRef} onTimeChange={handleTimerTimeChange} />
      <StyledBoardWrapper
        ref={(el) => {
          setBoardEl(el ?? undefined);
        }}
      >
        {boardEl && (
          <>
            <BoardView
              {...LEVEL_MAPS[level]}
              squareSize={squareSize}
              ref={boardRef}
              onStart={handleBoardStart}
              onStatusChange={handleBoardStatusChange}
              onRemainingMineCountChange={handleRemainingMineCountChange}
            />
            {boardStatus === "READY" && <MinesweeperPlaceholder />}
            {(boardStatus === "WIN" || boardStatus === "LOSE") && (
              <MinesweeperRestart onClick={restartBoard} />
            )}
          </>
        )}
      </StyledBoardWrapper>
    </StyledMinesweeper>
  );
});
