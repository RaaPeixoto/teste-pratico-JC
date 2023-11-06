import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 130px 50px 50px 50px;
  background-color: ${COLORS.lightGray};
  @media (max-width: 600px) {
    padding: 130px 10px 10px 10px;
  }
`;

const NoLead = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: ${COLORS.gray};
  margin-top: 60px;
`;

const AddButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  position: fixed;
  top: 20px;
  right: 50px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  align-items:flex-end;
  color: ${COLORS.darkGray};
   @media (max-width: 600px) {
    top: 5px;
    right: 5px;
  }
`;

const LogOutIcon = styled(BiLogOut)`
  font-size: 20px;
`;
export { PageContainer, NoLead, AddButtonContainer, StyledLink, LogOutIcon };
