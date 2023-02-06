export declare interface ISquare {
  row: number;
  col: number;
  neighborMineCount: number;
  isMine: boolean;
  isFlagged: boolean;
  isOpened: boolean;
  isEmpty(): boolean;
}

export const Square = (row: number, col: number, isMine: boolean): ISquare => {
  return {
    row,
    col,
    neighborMineCount: 0,
    isMine,
    isFlagged: false,
    isOpened: false,
    isEmpty() {
      return this.neighborMineCount === 0 && !this.isMine;
    },
  };
};
