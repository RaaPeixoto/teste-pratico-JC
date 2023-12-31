import styled from "styled-components";
import { COLORS } from "../../constants/colors";
const Button = styled.button`
  border: none;
  padding: 10px 40px;
  background-color: ${COLORS.lightBlue};
  color: ${COLORS.white};
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 600px) {
    padding: 5px 20px;
  }
`;

export { Button };