import { I18nextProvider } from "react-i18next";

import { Minesweeper } from "./components/minesweeper-component/minesweeper";
import i18n from "./i18n/i18n";
import styled from "styled-components";

const StyledMinesweeperWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <StyledMinesweeperWrapper>
        <Minesweeper />
      </StyledMinesweeperWrapper>
    </I18nextProvider>
  );
}

export default App;
