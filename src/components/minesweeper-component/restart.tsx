import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const StyledRestartWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 200ms;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const StyledIcon = styled.img`
  width: 30px;
  height: 30px;
  margin: 0 16px 2px 0;
`;

const StyledRestartButton = styled.div`
  cursor: pointer;
  padding: 8px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background: #4a752c;
  border-radius: 8px;
  font-weight: bold;
`;

export interface MinesweeperRestartProps {
  onClick?: () => void;
}

export const MinesweeperRestart = React.memo<MinesweeperRestartProps>(
  ({ onClick }) => {
    const { t, i18n } = useTranslation();

    return (
      <StyledRestartWrapper>
        <StyledRestartButton onClick={onClick}>
          <StyledIcon src="//www.gstatic.com/images/icons/material/system/2x/refresh_white_24dp.png"></StyledIcon>
          {t("game.tryAgain")}
        </StyledRestartButton>
      </StyledRestartWrapper>
    );
  }
);
