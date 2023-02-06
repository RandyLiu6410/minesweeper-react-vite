import { ISquare, Square } from "./square";

export type Grid = ISquare[][];

export type BOARD_STATUS = "READY" | "ONGOING" | "WIN" | "LOSE";

export interface IBoard {
  grid: Grid | undefined;
  minePositions: number[];
  rowCount: number;
  mineCount: number;
  startPosition: number;
  mineLeftCount: number;
  status: BOARD_STATUS;
  createBoardGrid: (startPosition: number) => void;
  initMinesPositions: () => number[];
  getNeighbors: (row: number, col: number) => ISquare[];
  getNeighborCoordinates: (row: number, col: number) => [number, number][];
  addSquare: (row: number, col: number) => void;
  openEmptyNeighbors: (row: number, col: number) => void;
  openedSquares: ISquare[];
  openSquares: () => void;
  flag: (row: number, col: number) => void;
  checkWin: () => void;
  end: (win: boolean) => void;
  start: (row: number, col: number) => void;
  clear: () => void;
}

export class BoardClass {
  grid: Grid | undefined = undefined;
  static coordinatePositionsDiff = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  minePositions: number[] = [];

  rowCount: number = 0;
  colCount: number = 0;
  mineCount: number = 0;
  startPosition: number = 0;

  remainingMineCount: number = 0;

  status: BOARD_STATUS = "READY";

  constructor(rowCount: number, colCount: number, mineCount: number) {
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.mineCount = mineCount;
  }

  static getEmptyBoard(rowCount: number, colCount: number) {
    return Array(rowCount).fill(Array(colCount).fill(null));
  }

  createBoardGrid() {
    // init random positions of mines
    this.minePositions = this.initMinesPositions();
    // init squares
    this.grid = [];
    for (let row = 0; row < this.rowCount; row++) {
      this.grid.push([]);
      for (let col = 0; col < this.colCount; col++) {
        this.addSquare(row, col);
      }
    }
  }

  initMinesPositions(): number[] {
    const positions: number[] = [];
    const limit: number = this.rowCount * this.colCount;
    const positionPool = [...Array(limit).keys()];

    positionPool.splice(this.startPosition, 1);

    for (let i = 0; i < this.mineCount; i++) {
      const positionIndex = Math.floor(Math.random() * positionPool.length);
      positionPool.splice(positionIndex, 1);
      positions.push(positionPool[positionIndex]);
    }

    return positions;
  }

  getNeighbors(row: number, col: number): ISquare[] {
    if (
      !this.grid ||
      this.grid.length === 0 ||
      !this.grid[0] ||
      this.grid[0].length === 0
    )
      return [];

    const neighborCoordinates = this.getNeighborCoordinates(row, col);
    return neighborCoordinates
      .map((coord) => this.grid![coord[1]][coord[0]])
      .filter((neighbor) => !!neighbor);
  }

  getNeighborCoordinates(row: number, col: number): [number, number][] {
    let coordinates: [number, number][] =
      BoardClass.coordinatePositionsDiff.map((diff) => [
        col + diff[1],
        row + diff[0],
      ]);
    coordinates = coordinates.filter(
      (coord) =>
        coord[0] >= 0 &&
        coord[1] >= 0 &&
        coord[0] < this.colCount &&
        coord[1] < this.rowCount
    );
    return coordinates;
  }

  addSquare(row: number, col: number) {
    if (!this.grid) return;

    const position = row * this.colCount + col;
    const square = Square(row, col, this.minePositions.includes(position));

    const mineCount = this.getNeighborCoordinates(row, col)
      .map((coord) => coord[1] * this.colCount + coord[0])
      .filter((pos) => this.minePositions.includes(pos)).length;
    square.neighborMineCount = mineCount;
    this.grid[row].push(square);
  }

  openEmptyNeighbors(row: number, col: number) {
    if (!this.grid) return;

    const target = this.grid[row][col];
    if (!target) return;

    const neighbors = [...this.getNeighbors(target.row, target.col)];

    while (neighbors.length) {
      const square = neighbors.pop();
      if (!square) continue;

      if (square.isOpened) continue;

      if (square.isEmpty()) {
        neighbors.push(...this.getNeighbors(square.row, square.col));
      }

      square.isFlagged = false;
      square.isOpened = true;
    }
  }

  get openedSquares() {
    if (!this.grid) return [];

    return this.grid.flat().filter((square) => square.isOpened);
  }

  openSquare(row: number, col: number) {
    if (!this.grid) return;

    const square = this.grid[row][col];

    if (square.isFlagged) return;

    if (square.isMine) this.end(false);

    if (square.isEmpty()) {
      this.openEmptyNeighbors(row, col);
    }

    square.isFlagged = false;
    square.isOpened = true;
  }

  openAllGridSquares() {
    if (!this.grid) return;

    for (const row of this.grid) {
      for (const square of row) {
        square.isOpened = true;
      }
    }
  }

  openNeighborSquares(row: number, col: number) {
    const neighbors = this.getNeighbors(row, col);
    for (const square of neighbors) {
      if (square.isFlagged) continue;
      this.openSquare(square.row, square.col);
    }
  }

  flag(row: number, col: number) {
    if (!this.grid) return;

    const square = this.grid[row][col];
    if (square.isOpened) return;

    if (square.isFlagged) {
      square.isFlagged = false;
      this.remainingMineCount++;
    } else {
      square.isFlagged = true;
      this.remainingMineCount--;
    }
  }

  checkWin() {
    if (
      this.openedSquares.length >=
      this.rowCount * this.colCount - this.mineCount
    )
      this.end(true);
  }

  end(win: boolean) {
    this.status = win ? "WIN" : "LOSE";
  }

  start(row: number, col: number) {
    const startPosition = row * this.colCount + col;
    this.startPosition = startPosition;

    this.createBoardGrid();

    this.openSquare(row, col);

    this.status = "ONGOING";
  }

  clear() {
    this.grid = undefined;
    this.minePositions = [];
    this.rowCount = 0;
    this.colCount = 0;
    this.mineCount = 0;
    this.startPosition = 0;
    this.status = "READY";
  }
}
