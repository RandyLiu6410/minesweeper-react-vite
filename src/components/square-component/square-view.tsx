import React from "react";
import { ISquare } from "../../models/square";
import clsx from "clsx";

import styled from "styled-components";
import { isBrowser } from "react-device-detect";

interface StyledSquareProps {
  isOdd: boolean;
  value?: number;
  size: number;
}

const StyledSquare = styled.div<StyledSquareProps>`
  display: flex;
  width: ${(props) => props.size.toString() + "px"};
  height: ${(props) => props.size.toString() + "px"};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) =>
    props.value
      ? props.value >= 3
        ? "#d64640"
        : props.value >= 2
        ? "#388e3b"
        : "#1976d2"
      : "#ffffff"};
  font-weight: 900;
  background-color: ${(props) => (props.isOdd ? "#e5c29f" : "#d7b899")};
  user-select: none;

  &.hidden {
    background-color: ${(props) => (props.isOdd ? "#aad750" : "#a2d149")};
    &:hover {
      background-color: #bfe17d;
    }
  }
`;

export interface SquareViewProps {
  row: number;
  col: number;
  size: number;
  square?: ISquare;
  onClick?: (e: any, row: number, col: number) => void;
  onContextMenuClick?: (e: any, row: number, col: number) => void;
  onDoubleClick?: (e: any, row: number, col: number) => void;
}

export const SquareView = React.memo<SquareViewProps>(
  ({ row, col, size, square, onClick, onContextMenuClick, onDoubleClick }) => {
    const getValue = () => {
      if (!square) return null;

      if (!square.isOpened) {
        return square.isFlagged ? "🚩" : null;
      } else {
        if (square.isMine) return "💣";
        else if (square.isEmpty()) return "";
        else return square.neighborMineCount;
      }
    };

    if (!square)
      return (
        <StyledSquare
          className="hidden"
          isOdd={(row + col) % 2 === 1}
          onClick={(e) => onClick && onClick(e, row, col)}
          size={size}
        ></StyledSquare>
      );

    return (
      <StyledSquare
        className={clsx("square", {
          hidden: !square.isOpened,
          mine: square.isMine,
          empty: square.isEmpty,
          flag: square.isFlagged,
        })}
        isOdd={(row + col) % 2 === 1}
        value={square.neighborMineCount}
        size={size}
        onClick={(e) => onClick && onClick(e, row, col)}
        onContextMenu={(e) =>
          onContextMenuClick && onContextMenuClick(e, row, col)
        }
        onDoubleClick={(e) => {
          if (isBrowser && !!onDoubleClick) {
            onDoubleClick(e, row, col);
          }
        }}
      >
        {getValue()}
      </StyledSquare>
    );
  }
);
