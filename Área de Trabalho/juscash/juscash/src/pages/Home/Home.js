import { Header, AddButton, LeadModal } from "../../components/index.js";
import { LeadsTable } from "./LeadsTable.js";
import {
  PageContainer,
  NoLead,
  AddButtonContainer,
} from "../../assets/style/homeStyle.js";

function Home({
  steps,
  leadsList,
  handleDragOver,
  handleDrop,
  handleDragStart,
  openNewLeadModal,
  showNewLeadModal,
  setShowLeadModal,
  showLeadModal,
  leadForm,
  handleLeadForm,
  addNewLead,
  closeLeadModal,
}) {
  return (
    <PageContainer>
      {showNewLeadModal && (
        <LeadModal
        isEditModal={false}
          leadForm={leadForm}
          closeLeadModal={closeLeadModal}
          addNewLead={addNewLead}
          handleLeadForm={handleLeadForm}
        />
      )}
  {showLeadModal&& (
        <LeadModal
        isEditModal={true}
          leadForm={leadForm}
          closeLeadModal={closeLeadModal}
          addNewLead={addNewLead}
          handleLeadForm={handleLeadForm}
        />
      )}
      <AddButtonContainer>
        <AddButton text="+ Novo Lead" onClick={() => openNewLeadModal()} />
      </AddButtonContainer>
      {leadsList.length ? (
        <LeadsTable
        setShowLeadModal={setShowLeadModal}
          steps={steps}
          leadsList={leadsList}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
        />
      ) : (
        <NoLead>Nenhum Lead Cadastrado</NoLead>
      )}
    </PageContainer>
  );
}
export { Home };
