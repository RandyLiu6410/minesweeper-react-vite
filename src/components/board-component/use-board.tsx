import React from "react";
import { ISquare, Square } from "../../models/square";
import { BOARD_STATUS, Grid } from "../../models/board";
import * as _ from "lodash";

const COORDINATE_POSITION_DIFF = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export interface useBoardOption {
  rowCount: number;
  colCount: number;
  mineCount: number;
  onStart?: () => void;
  onStatusChange?: (status: BOARD_STATUS) => void;
  onRemainingMineCountChange?: (value: number) => void;
}

export const useBoard = ({
  rowCount,
  colCount,
  mineCount,
  onStart,
  onStatusChange,
  onRemainingMineCountChange,
}: useBoardOption) => {
  /////////////////////////////////
  ///// Utils
  /////////////////////////////////

  const createEmptyBoard = (rowCount: number, colCount: number) => {
    return Array(rowCount).fill(Array(colCount).fill(null));
  };

  const createBoardGrid = (startPosition: number) => {
    // init random positions of mines
    const minePositions = initMinesPositions(startPosition);
    // init squares
    const grid: Grid = [];
    for (let row = 0; row < rowCount; row++) {
      grid.push([]);
      for (let col = 0; col < colCount; col++) {
        addSquare(grid, row, col, minePositions);
      }
    }

    return grid;
  };

  const initMinesPositions = (startPosition: number): number[] => {
    const positions: number[] = [];
    const limit: number = rowCount * colCount;

    // put every positions of squares into the poll
    const positionPool = [...Array(limit).keys()];

    // exclude the start position to prevent
    // from clicking mine at the first time
    positionPool.splice(startPosition, 1);

    for (let i = 0; i < mineCount; i++) {
      const positionIndex = Math.floor(Math.random() * positionPool.length);
      positionPool.splice(positionIndex, 1);
      positions.push(positionPool[positionIndex]);
    }

    return positions;
  };

  const addSquare = (
    grid: Grid,
    row: number,
    col: number,
    minePositions: number[]
  ) => {
    const position = row * colCount + col;
    const square = Square(row, col, minePositions.includes(position));

    // to get neighbor mines by checking if the positions
    // of neighbor mines are included in minePositions
    const mineCount = getNeighborCoordinates(rowCount, colCount, row, col)
      .map((coord) => coord[1] * colCount + coord[0])
      .filter((pos) => minePositions.includes(pos)).length;
    square.neighborMineCount = mineCount;
    grid[row].push(square);
  };

  const getNeighbors = (grid: Grid, row: number, col: number): ISquare[] => {
    if (grid.length <= 0 || !grid[0] || grid[0].length <= 0) return [];

    const rowCount = grid.length;
    const colCount = grid[0].length;

    const neighborCoordinates = getNeighborCoordinates(
      rowCount,
      colCount,
      row,
      col
    );
    return neighborCoordinates
      .map((coord) => grid[coord[1]][coord[0]])
      .filter((neighbor) => !!neighbor);
  };

  const getNeighborCoordinates = (
    rowCount: number,
    colCount: number,
    row: number,
    col: number
  ): [number, number][] => {
    let coordinates: [number, number][] = COORDINATE_POSITION_DIFF.map(
      (diff) => [col + diff[1], row + diff[0]]
    );
    coordinates = coordinates.filter(
      (coord) =>
        coord[0] >= 0 &&
        coord[1] >= 0 &&
        coord[0] < colCount &&
        coord[1] < rowCount
    );
    return coordinates;
  };

  const openEmptyNeighbors = (grid: Grid, row: number, col: number) => {
    const target = grid[row][col];
    if (!target) return;

    const neighbors = [...getNeighbors(grid, target.row, target.col)];

    while (neighbors.length) {
      const square = neighbors.pop();
      if (!square) continue;

      if (square.isOpened || square.isMine) continue;

      if (square.isEmpty()) {
        // append the neighbors of the empty square to neighbors
        neighbors.push(...getNeighbors(grid, square.row, square.col));
      }

      square.isFlagged = false;
      square.isOpened = true;
    }
  };

  const getOpenedSquares = (grid: Grid) => {
    return grid.flat().filter((square) => square.isOpened);
  };

  const openSquare = (
    grid: Grid,
    row: number,
    col: number,
    onBoom?: () => void
  ) => {
    const square = grid[row][col];

    if (square.isFlagged || square.isOpened) return;

    if (square.isMine) {
      onBoom && onBoom();
      return;
    }

    if (square.isEmpty()) {
      openEmptyNeighbors(grid, row, col);
    }

    square.isFlagged = false;
    square.isOpened = true;
  };

  const openAllGridSquares = (grid: Grid) => {
    for (const row of grid) {
      for (const square of row) {
        square.isOpened = true;
      }
    }
  };

  /////////////////////////////////
  ///// Hooks & functions
  /////////////////////////////////

  const [grid, setGrid] = React.useState<Grid>();
  const [status, setStatus] = React.useState<BOARD_STATUS>("READY");
  const [remainingMineCount, setRemainingMineCount] = React.useState(mineCount);

  React.useEffect(() => {
    onRemainingMineCountChange &&
      onRemainingMineCountChange(remainingMineCount);
  }, [remainingMineCount]);

  React.useEffect(() => {
    onStatusChange && onStatusChange(status);
  }, [status]);

  const start = (row: number, col: number) => {
    setGrid(() => {
      const startPosition = row * colCount + col;
      const _grid = createBoardGrid(startPosition);
      openSquare(_grid, row, col);
      return _grid;
    });
    setStatus("ONGOING");

    onStart && onStart();
  };

  const restart = () => {
    setGrid(undefined);
    setStatus("READY");
    setRemainingMineCount(mineCount);
  };

  React.useEffect(() => {
    restart();
  }, [rowCount, colCount, mineCount]);

  React.useEffect(() => {
    if (grid && status === "ONGOING") checkWin();
  }, [grid]);

  React.useEffect(() => {
    if (status === "WIN" || status === "LOSE") openSquares();
  }, [status]);

  const sweep = (row: number, col: number) => {
    if (!grid) return;

    const _grid = _.cloneDeep(grid);
    let boomed = false;

    openSquare(_grid, row, col, () => {
      boomed = true;
    });

    if (boomed) {
      end(false);
    } else {
      setGrid(_grid);
    }
  };

  const flag = (row: number, col: number) => {
    if (!grid) return;

    const square = grid[row][col];

    if (square.isOpened) return;

    if (square.isFlagged) {
      setGrid((prev) => {
        prev![row][col].isFlagged = false;
        return [...prev!];
      });
      setRemainingMineCount((prev) => prev + 1);
    } else {
      setGrid((prev) => {
        prev![row][col].isFlagged = true;
        return [...prev!];
      });
      setRemainingMineCount((prev) => prev - 1);
    }
  };

  const sweepAround = (row: number, col: number) => {
    if (!grid) return;

    const square = grid[row][col];

    const neighbors = getNeighbors(grid, row, col);
    const flaggedNeighbors = neighbors.filter((neighbor) => neighbor.isFlagged);

    if (square.neighborMineCount === flaggedNeighbors.length)
      openNeighborSquares(row, col);
  };

  const openSquares = () => {
    setGrid((prev) => {
      if (prev) {
        openAllGridSquares(prev);
        return [...prev];
      } else return prev;
    });
  };

  const openNeighborSquares = (row: number, col: number) => {
    if (!grid) return;

    const _grid = _.cloneDeep(grid);
    let boomed = false;

    const neighbors = getNeighbors(_grid, row, col);
    for (const square of neighbors) {
      if (square.isFlagged) continue;
      openSquare(_grid, square.row, square.col, () => {
        boomed = true;
      });
    }

    if (boomed) {
      end(false);
    } else {
      setGrid(_grid);
    }
  };

  const checkWin = () => {
    if (!grid) return;

    const openedSquares = getOpenedSquares(grid);
    if (openedSquares.length >= rowCount * colCount - mineCount) {
      end(true);
    }
  };

  const end = (win: boolean) => {
    setStatus(win ? "WIN" : "LOSE");
  };

  return {
    createEmptyBoard,
    grid,
    status,
    remainingMineCount,
    sweep,
    flag,
    sweepAround,
    start,
    restart,
  };
};
