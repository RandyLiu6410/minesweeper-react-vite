import React from "react";

import { SquareView } from "../square-component/square-view";
import styled from "styled-components";
import { useBoard } from "./use-board";
import { BOARD_STATUS } from "../../models/board";

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
  squareSize: number;
  onStart?: () => void;
  onStatusChange?: (status: BOARD_STATUS) => void;
  onRemainingMineCountChange?: (value: number) => void;
}

export interface BoardRef {
  restart: () => void;
}

export const BoardView = React.forwardRef<BoardRef, BoardProps>(
  (
    {
      rowCount,
      colCount,
      mineCount,
      squareSize,
      onStart,
      onStatusChange,
      onRemainingMineCountChange,
    },
    ref
  ) => {
    const {
      createEmptyBoard,
      grid,
      status,
      remainingMineCount,
      sweep,
      flag,
      sweepAround,
      start,
      restart,
    } = useBoard({
      rowCount,
      colCount,
      mineCount,
      onStart,
      onStatusChange,
      onRemainingMineCountChange,
    });

    /////////////////////////////////
    ///// Hooks & functions
    /////////////////////////////////

    React.useImperativeHandle(ref, () => ({
      restart,
    }));

    /////////////////////////////////
    ///// Event handlers
    /////////////////////////////////

    const handleLeftClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();
      sweep(row, col);
    };

    const handleRightClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();
      flag(row, col);
    };

    const handleDoubleClickSquare = (e: any, row: number, col: number) => {
      e.preventDefault();
      sweepAround(row, col);
    };

    const renderGrid = () => {
      if (!grid) {
        return createEmptyBoard(rowCount, colCount).map((_, _row) => (
          <StyledRow key={"empty-row" + _row}>
            {Array(colCount)
              .fill(1)
              .map((_, _col) => (
                <SquareView
                  key={_row * colCount + _col}
                  row={_row}
                  col={_col}
                  size={squareSize}
                  onClick={(e, row, col) => start(row, col)}
                />
              ))}
          </StyledRow>
        ));
      } else {
        return grid.map((squares, row) => (
          <StyledRow key={"row" + row}>
            {squares.map((square) => (
              <SquareView
                key={square.row * colCount + square.col}
                row={square.row}
                col={square.col}
                size={squareSize}
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
