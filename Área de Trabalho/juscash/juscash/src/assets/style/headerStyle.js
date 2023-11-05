import styled from "styled-components";
import { COLORS } from "../../constants/colors";

const HeaderContainer = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  z-index: 4;
  height: 120px;
  justify-content: center;
  background-color: ${COLORS.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export { HeaderContainer };
