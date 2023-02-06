import React from "react";
import styled from "styled-components";

const StyledRecordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 4px;
`;

const StyledIconText = styled.div`
  margin: 0 4px;
  font-weight: 700;
`;

export interface MinesweeperRecordProps {
  remainingMineCount: number;
  time: number;
}

export const MinesweeperRecord = React.memo<MinesweeperRecordProps>(
  ({ remainingMineCount, time }) => {
    return (
      <StyledRecordWrapper>
        <StyledIcon src="https://www.google.com/logos/fnbx/minesweeper/flag_icon.png" />
        <StyledIconText>{remainingMineCount}</StyledIconText>
        <StyledIcon src="https://www.google.com/logos/fnbx/minesweeper/clock_icon.png" />
        <StyledIconText>{time}</StyledIconText>
      </StyledRecordWrapper>
    );
  }
);
