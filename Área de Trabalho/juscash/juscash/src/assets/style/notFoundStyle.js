import styled from "styled-components";
import { COLORS } from "../../constants/colors";
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 10;
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  padding: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.white};
  h3 {
    color: ${COLORS.darkBlue};
    font-size: 20px;
    font-weight: 600;
  }
  img {
    width: 400px;
  }
`;

export { PageContainer };
