import styled from "styled-components";
import { IoIosAddCircle } from "react-icons/io";
import { useState } from "react";
export function AdsManagerPage() {
  const [filter, setFilter] = useState("");
  return (
    <>
      <Sidebar>
        <div>Logo</div>
        <div>
          <IoIosAddCircle color="#FFFFFF" />
          Add Page
        </div>
        <section>
          <h2>FILTRAR</h2>
          <FilterOption>Todos</FilterOption>
          <FilterOption>Ativos</FilterOption>
          <FilterOption>Inativos</FilterOption>
        </section>
      </Sidebar>
    </>
  );
}

const Sidebar = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  width: 387px;
  height: 100vh;
  left: 0px;
  top: 0px;
  background: #456297;
  section {
    h2 {
      background-color: #99aacb;
      width: 100%;
      height: 39px;
      font-family: "Mulish";
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 100%;
      color: #ffffff;
    }
  }
`;
const FilterOption = styled.div``;
