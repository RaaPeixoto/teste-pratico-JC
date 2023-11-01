import { Header, AddButton,LeadModal } from "../../components/index.js";
import { LeadsTable } from "./LeadsTable.js";
import { PageContainer,NoLead,AddButtonContainer } from "../../assets/style/homeStyle.js";

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

      <AddButtonContainer><AddButton text="+ Novo Lead" onClick={() => handleLeadModal()}/></AddButtonContainer>
      {leadsList.length?       <LeadsTable
        steps={steps}
        leadsList={leadsList}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
      /> :
      <NoLead>Nenhum Lead Cadastrado</NoLead>}
 
    </PageContainer>
  );
}
export { Home };
