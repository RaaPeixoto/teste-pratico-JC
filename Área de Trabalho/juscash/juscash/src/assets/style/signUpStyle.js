import styled from "styled-components";
import { CheckSquareFill } from "@styled-icons/bootstrap/CheckSquareFill";
import { COLORS } from "../../constants/colors";
import {EyeSlashFill} from "@styled-icons/bootstrap/EyeSlashFill";
import {EyeFill} from "@styled-icons/bootstrap/EyeFill";
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  padding:100px 50px 0px 50px;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  background-color:${COLORS.lightGray};
  
`;
const OpenedEyes =styled(EyeFill)`
position:absolute;
width: 15px;
right:5px;
bottom:7px;
cursor:pointer;
color:${COLORS.darkGray};

`
const EyeSlash = styled(EyeSlashFill)`
position:absolute;
width: 15px;
right:6px;
bottom:7px;
cursor:pointer;
color:${COLORS.darkGray};

`
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color:${COLORS.white};
  padding: 40px 60px;
  align-items:center;
  div {
    width:100%;
    max-width:400px;
    position:relative;
    input{
        width: 100%;
    }
  }
  p {
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0 5px 0;
    color: ${COLORS.darkBlue};
  }
  span {
    color: ${COLORS.red};
  }
  input{
    height:30px;
    width:100%;
    max-width:400px;
  }
  button {
    width: 250px;
    border: none;
    border-radius: 5px;
    background-color: ${COLORS.green};
    color: ${COLORS.white};
    padding: 10px 0;
    font-weight: 800;
    margin:20px 0;
  }

  @media (max-width: 600px) {
    width:100vw;
    height:100vh;
  }
`;
const PasswordValidatorContainer = styled.div`
font-size:16px;
margin-top:10px;
`;
const PasswordValidator = styled.div`
`;

const CheckIcon = styled(CheckSquareFill)`
  color: ${(props) => (props.verify ? COLORS.green : COLORS.lightGray)};
  width: 15px;
`;
export {
  PageContainer,
  FormContainer,
  PasswordValidatorContainer,
  PasswordValidator,
  CheckIcon,
  EyeSlash,
  OpenedEyes
};
