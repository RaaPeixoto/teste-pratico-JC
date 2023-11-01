import styled from 'styled-components';
import { COLORS } from "../../constants/colors";

const HeaderContainer= styled.div`
position:fixed;
width:100%;
display:flex;
padding: 40px 0;
justify-content:center;
background-color: ${COLORS.white};
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export {HeaderContainer}