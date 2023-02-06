import React from "react";
import styled, { keyframes } from "styled-components";

const StyledPlaceholderWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 200ms;
  z-index: 999;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const StyledPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  display: block;
  background-size: 100px auto;
  background-repeat: no-repeat;
  background-position: center;
`;

const digCrossfadeAnimation = keyframes`
0% {
    opacity:1
   }
   40% {
    opacity:1
   }
   50% {
    opacity:0
   }
   90% {
    opacity:0
   }
   100% {
    opacity:1
   }
`;

const StyledDig = styled(StyledPlaceholder)`
  background-image: url(//www.google.com/logos/fnbx/minesweeper/tutorial_desktop_dig.png);
  animation: ${digCrossfadeAnimation} 6s infinite;
`;

const flagCrossfadeAnimation = keyframes`
0% {
    opacity:0
   }
   40% {
    opacity:0
   }
   50% {
    opacity:1
   }
   90% {
    opacity:1
   }
   100% {
    opacity:0
   }
`;

const StyledFlag = styled(StyledPlaceholder)`
  background-image: url(//www.google.com/logos/fnbx/minesweeper/tutorial_desktop_flag.png);
  animation: ${flagCrossfadeAnimation} 6s infinite;
`;

export const MinesweeperPlaceholder = React.memo(() => {
  return (
    <StyledPlaceholderWrapper>
      <StyledDig />
      <StyledFlag />
    </StyledPlaceholderWrapper>
  );
});
