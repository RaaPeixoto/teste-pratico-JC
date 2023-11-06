import styled from "styled-components";
import { COLORS } from "../../constants/colors";
const Table = styled.table`
  margin-top: 10px;
  width: 100%;
  font-size: 16px;
  th {
    padding: 0 10px;
    text-align: start;
    vertical-align: middle;
    border: 1px solid ${COLORS.gray};
    height: 50px;
    background-color: ${COLORS.white};
  }
  tr {
    overflow-y: auto;
    border-bottom: 4px double ${COLORS.gray};
  }
  tr:nth-child(odd) {
    background-color: ${COLORS.lightGray};
  }

  tr:nth-child(even) {
    background-color: ${COLORS.white};
  }

  td {
    height: 50px;
    text-align: center;
    vertical-align: middle;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-weight: 600;
      cursor: pointer;
    }

    div:active {
      color: ${COLORS.darkBlue};
      background-color: ${COLORS.darkBlue}11;
    }
  }
`;

export { Table };
