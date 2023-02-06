import React from "react";
import { LEVEL } from "./minesweeper";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const StyledLevelSelect = styled.select`
  background: #ffffff;
  border: none;
  color: black;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
`;

const StyledLevelOption = styled.option`
  background: #ffffff;
`;

export interface MinesweeperLevelSelectorProps {
  currentLevel: LEVEL;
  levels: LEVEL[];
  onLevelChange: (level: LEVEL) => void;
}

export const MinesweeperLevelSelector =
  React.memo<MinesweeperLevelSelectorProps>(
    ({ currentLevel, levels, onLevelChange }) => {
      const { t } = useTranslation();

      const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onLevelChange(e.target.value as LEVEL);
      };

      return (
        <StyledLevelSelect value={currentLevel} onChange={handleSelectChange}>
          {levels.map((level, index) => (
            <StyledLevelOption key={index} value={level}>
              {t(`game.level.${level}`)}
            </StyledLevelOption>
          ))}
        </StyledLevelSelect>
      );
    }
  );
