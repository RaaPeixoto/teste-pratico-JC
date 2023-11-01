import styled from "styled-components";
import { COLORS } from "../../constants/colors";
const Table = styled.table`

  width: 100%;
  font-size: 16px;
  th {
    padding: 0 10px;
    text-align: start;
    vertical-align: middle;
    border: 1px solid ${COLORS.darkGrey};
    height: 50px;
    background-color: ${COLORS.white};
  }
  tr {
    border-bottom: 4px double ${COLORS.darkGray};
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
      /* card */
      font-weight: 600;
      cursor: pointer;
    }
  }
`;

export { Table };
