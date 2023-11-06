import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { BiSolidCheckboxChecked } from "react-icons/bi";
const PasswordCheckListContainer = styled.ul`
  font-size: 12px;
  width: 100%;
  max-width: 400px;
  li {
    margin-bottom: 5px;
    display:flex;
    align-items:center;
  }
  h6 {
    font-weight: 600;
    color: ${COLORS.darkGray};
    font-size: 14px;
    margin: 10px 0;
  }
`;
const CheckIcon = styled(BiSolidCheckboxChecked)`
  color: ${(props) => (props.verify ? COLORS.green : COLORS.lightGray)};
  font-size: 20px;
`;
export { CheckIcon, PasswordCheckListContainer };
