import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { IoMdClose } from "react-icons/io";
const ModalPageContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CloseIcon = styled(IoMdClose)`
  width: 25px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${COLORS.darkGray};
  cursor: pointer;
`;
const ModalContainer = styled.div`
  position: relative;
  background-color: ${COLORS.white};
  padding: 30px 10px 20px 30px;
  max-width: 600px;
  width: 90%;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  h4 {
    margin-bottom: 30px;
    color: ${COLORS.darkGray};
    font-size: 20px;
    font-weight: 600;
  }
`;
const OpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Form = styled.form`
  h5 {
    margin-left: 5px;
    color: ${COLORS.darkGray};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
  }
  input[type="text"],
  input[type="email"],
  input[type="tel"] {
    margin: 10px 0;
    width: 90%;
    height: 30px;
    padding: 0 10px;
  }

  label {
    font-size: 14px;
    display: flex;
    align-items: center;
    color: ${COLORS.darkGray};
    margin-top: 5px;
  }
  input[type="checkbox"] {
    -webkit-appearance: none;
    background-color: white;
    border: 1px solid ${COLORS.gray};
    width: 15px;
    height: 15px;
    margin-right: 5px;
    position: relative;
  }

  input[type="checkbox"]:checked {
    border: none;
    background-color: ${COLORS.lightBlue};
  }

  input[type="checkbox"]:checked::before {
    content: "✔";
    display: block;
    color: white;
    font-size: 14px;
    text-align: center;
    line-height: 15px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ButtonsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    font-size: 14px;
    cursor: pointer;
    padding: 5px 20px;
    border: 0.5px solid ${COLORS.gray};
    background-color: ${COLORS.white};
    color: ${COLORS.gray};
    border-radius: 5px;
  }
  button[type="submit"] {
    margin: 0 10px 0 20px;
    border: none;
    color: ${COLORS.white};
    background-color: ${COLORS.lightBlue};
  }
`;
export { ModalPageContainer, ModalContainer, Form, CloseIcon, OpportunitiesContainer, ButtonsContainer };
