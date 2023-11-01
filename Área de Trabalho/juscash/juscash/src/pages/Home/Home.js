import { Header, AddButton,LeadModal } from "../../components/index.js";
import { LeadsTable } from "./LeadsTable.js";
import { PageContainer } from "../../assets/style/homeStyle.js";

function Home({
  steps,
  leadsList,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleLeadModal,
  showLeadModal
}) {
  return (
    <PageContainer>
      {showLeadModal&& <LeadModal/> }
      <AddButton text="+ Novo Lead" onClick={() => handleLeadModal()}/>
      <LeadsTable
        steps={steps}
        leadsList={leadsList}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
      />
    </PageContainer>
  );
}
export { Home };
