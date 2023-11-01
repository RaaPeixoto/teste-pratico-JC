import styled from "styled-components";
import { COLORS } from "../../constants/colors";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 150px 50px 50px 50px;
  background-color: ${COLORS.lightGray};
  @media (max-width: 600px) {
    padding: 150px 10px 10px 10px;
  }
`;

const NoLead = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: ${COLORS.darkGray};
  margin-top:60px;
`;

const AddButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

`

export { PageContainer, NoLead,AddButtonContainer };
