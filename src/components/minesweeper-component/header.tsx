import React from "react";
import styled from "styled-components";

const StyledHeaderWrapper = styled.div`
  background-color: #4a752c;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  position: relative;
  max-height: 60px;
  font-size: 20px;
`;

export interface MinesweeperHeaderProps {
  levelSelector?: React.ReactNode;
  record?: React.ReactNode;
}

export const MinesweeperHeader = React.memo<MinesweeperHeaderProps>(
  ({ levelSelector, record }) => {
    return (
      <StyledHeaderWrapper>
        {levelSelector}
        {record}
      </StyledHeaderWrapper>
    );
  }
);
