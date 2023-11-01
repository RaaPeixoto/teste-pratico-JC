import styled from "styled-components";
import { COLORS } from "../../constants/colors";

const ModalPageContainer = styled.div`
position:fixed;
z-index:5;
top:0;
right:0;
width:100vw;
height:100vh;
background-color: rgba(255, 255, 255, 0.5);
backdrop-filter: blur(5px); 
display:flex;
align-items:center;
justify-content:center;
`

const ModalContainer=styled.div`
background-color: ${COLORS.white};
width:50%;
height:50%;
`

const Form = styled.form`
input{

}
`
export{ModalPageContainer,ModalContainer,Form}