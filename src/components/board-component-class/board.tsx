import React from "react";
import { BoardClass, BOARD_STATUS } from "../../models/board";

import { SquareView } from "../square-component/square-view";
import styled from "styled-components";

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledGrid = styled.div`
  display: flex;
  align-self: center;
  flex-direction: column;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
`;

export interface BoardProps {
  rowCount: number;
  colCount: number;
  mineCount: number;
  onStart?: () => void;
  onStatusChange?: (status: BOARD_STATUS) => void;
  onRemainingMineCountChange?: (value: number) => void;
}

export interface BoardRef {
  restart: () => void;
}

export const Board = React.forwardRef<BoardRef, BoardProps>(
  (
    {
      rowCount,
      colCount,
      mineCount,
      onStart,
      onStatusChange,
      onRemainingMineCountChange,
    },
    ref
  ) => {
    const getSquareSize = () => {
      const maxCount = Math.max(rowCount, colCount);

      if (maxCount >= 20) return 30;
      if (maxCount >= 10) return 40;
      return 50;
    };

    /////////////////////////////////
    ///// Hooks & functions
    /////////////////////////////////

    React.useImperativeHandle(ref, () => ({
      restart,
    }));

    const [board, setBoard] = React.useState(
      new BoardClass(rowCount, colCount, mineCount)
    );

    const start = (row: number, col: number) => {
      board.start(row, col);
      setBoard(board);
      onStart && onStart();
    };

    const restart = () => {
      setBoard(new BoardClass(rowCount, colCount, mineCount));
    };

    React.useEffect(() => {
      restart();
    }, [rowCount, colCount, mineCount]);

    React.useEffect(() => {
      onStatusChange && onStatusChange(board.status);
    }, [board.status]);

    React.useEffect(() => {
      if (board.grid && board.status === "ONGOING") {
        board.checkWin();
        setBoard(board);
      }
    }, [board.grid]);

    React.useEffect(() => {
      if (board.status === "WIN" || board.status === "LOSE") {
        board.openAllGridSquares();
        setBoard(board);
      }
    }, [board.status]);

    React.useEffect(() => {
      onRemainingMineCountChange &&
        onRemainingMineCountChange(board.remainingMineCount);
    }, [board.remainingMineCount]);

    /////////////////////////////////
    ///// Event handlers
    /////////////////////////////////

    const handleLeftClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();

      board.openSquare(row, col);
      setBoard(board);
    };

    const handleRightClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();

      board.flag(row, col);
      setBoard(board);
    };

    const handleDoubleClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();
      if (!board.grid) return;

      const square = board.grid[row][col];

      const neighbors = board.getNeighbors(row, col);
      const flaggedNeighbors = neighbors.filter(
        (neighbor) => neighbor.isFlagged
      );

      if (square.neighborMineCount === flaggedNeighbors.length) {
        board.openNeighborSquares(row, col);
        setBoard(board);
      }
    };

    const renderGrid = () => {
      if (!board.grid) {
        return Array(rowCount)
          .fill(null)
          .map((_, _row) => (
            <StyledRow key={"row" + _row}>
              {Array(colCount)
                .fill(1)
                .map((_, _col) => (
                  <SquareView
                    key={_row * colCount + _col}
                    row={_row}
                    col={_col}
                    size={getSquareSize()}
                    onClick={(e, row, col) => start(row, col)}
                  />
                ))}
            </StyledRow>
          ));
      } else {
        return board.grid.map((squares, row) => (
          <StyledRow key={"row" + row}>
            {squares.map((square) => (
              <SquareView
                key={square.row * colCount + square.col}
                row={square.row}
                col={square.col}
                size={getSquareSize()}
                square={square}
                onClick={handleLeftClickSquare}
                onContextMenuClick={handleRightClickSquare}
                onDoubleClick={handleDoubleClickSquare}
              />
            ))}
          </StyledRow>
        ));
      }
    };

    return (
      <StyledBoard>
        <StyledGrid>{renderGrid()}</StyledGrid>
      </StyledBoard>
    );
  }
);
