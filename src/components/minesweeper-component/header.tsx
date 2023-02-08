import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  MinesweeperLevelSelector,
  MinesweeperLevelSelectorProps,
} from "./level-selector";
import { MinesweeperRecord, MinesweeperRecordProps } from "./record";

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

const StyledResetButton = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid #aad750;
  border-radius: 10px;
  color: #bfe17d;
  margin-left: 1rem;

  &:hover {
    background-color: #bfe17d;
    color: #388e3b;
    cursor: pointer;
  }
`;

const StyledLevelSelectorResetWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface MinesweeperHeaderProps {
  levelSelectorProps: MinesweeperLevelSelectorProps;
  recordProps: MinesweeperRecordProps;
  onResetClick?: () => void;
}

export const MinesweeperHeader = React.memo<MinesweeperHeaderProps>(
  ({ levelSelectorProps, recordProps, onResetClick }) => {
    const { t } = useTranslation();

    return (
      <StyledHeaderWrapper>
        <StyledLevelSelectorResetWrapper>
          <MinesweeperLevelSelector {...levelSelectorProps} />
          <StyledResetButton onClick={onResetClick}>
            {t("game.reset")}
          </StyledResetButton>
        </StyledLevelSelectorResetWrapper>
        <MinesweeperRecord {...recordProps} />
      </StyledHeaderWrapper>
    );
  }
);
