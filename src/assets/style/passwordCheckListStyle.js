import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { CheckSquareFill } from "@styled-icons/bootstrap/CheckSquareFill";
const PasswordCheckListContainer = styled.ul`
  font-size: 12px;
  width: 100%;
  max-width: 400px;
  li {
    margin-bottom: 5px;
  }
  h6 {
    font-weight: 600;
    color: ${COLORS.darkGray};
    font-size: 14px;
    margin: 10px 0;
  }
`;
const CheckIcon = styled(CheckSquareFill)`
  color: ${(props) => (props.verify ? COLORS.green : COLORS.lightGray)};
  width: 15px;
`;
export { CheckIcon, PasswordCheckListContainer };
