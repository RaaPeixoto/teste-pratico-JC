import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 130px 0 10px 0;
`;
const OpenedEyes = styled(AiFillEye)`
  position: absolute;
  font-size: 20px;
  right: 5px;
  bottom: 5px;
  cursor: pointer;
  color: ${COLORS.gray};
`;
const EyeSlash = styled(AiFillEyeInvisible)`
  position: absolute;
  font-size: 20px;
  right: 6px;
  bottom: 5px;
  cursor: pointer;
  color: ${COLORS.gray};
`;
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
  align-items: center;
  div {
    width: 100%;
    max-width: 400px;
    position: relative;
    input {
      width: 100%;
    }
  }
  p {
    font-size: 16px;
    font-weight: 600;
    margin: 15px 0 5px 0;
    color: ${COLORS.darkBlue};
  }
  span {
    color: ${COLORS.red};
  }
  input {
    height: 30px;
    width: 100%;
    max-width: 400px;
  }
  button {
    cursor: pointer;
    width: 150px;
    border: none;
    border-radius: 5px;
    background-color: ${COLORS.green};
    color: ${COLORS.white};
    padding: 10px 0;
    font-weight: 800;
    margin: 10px 0 0 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${COLORS.darkBlue};
  font-size: 14px;
  font-weight: 600;
  margin: 15px 0 5px 0;
  width: 100%;
  max-width: 400px;
  text-align: end;
  &:hover {
    text-decoration: underline;
  }
`;

export { PageContainer, FormContainer, EyeSlash, OpenedEyes, StyledLink };
