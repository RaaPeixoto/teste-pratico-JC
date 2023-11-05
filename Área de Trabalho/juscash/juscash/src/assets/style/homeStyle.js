import styled from "styled-components";
import { COLORS } from "../../constants/colors";

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

export { PageContainer, NoLead, AddButtonContainer };
