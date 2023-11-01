import styled from 'styled-components';
import { COLORS } from "../../constants/colors";
const LoadingContainer = styled.div`
width:100vw;  
height:100vh;
background-color:${COLORS.lightGray};
display:flex;
align-items:center;
justify-content:center;
img{
    width:200px;
}
`

export {LoadingContainer}