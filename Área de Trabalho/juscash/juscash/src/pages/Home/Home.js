import {
  AddButton,
  LeadModal,
  LeadsTable,
} from "../../components/Home/index.js";
import {
  PageContainer,
  NoLead,
  AddButtonContainer,
  StyledLink,
  LogOutIcon
} from "../../assets/style/homeStyle.js";

function Home({
  steps,
  leadsList,
  handleDragOver,
  handleDrop,
  handleDragStart,
  openNewLeadModal,
  showNewLeadModal,
  openLeadModal,
  showLeadModal,
  leadForm,
  handleLeadForm,
  addNewLead,
  closeLeadModal,
}) {
  return (
    <PageContainer>
      <StyledLink to="/signin"><LogOutIcon/> Sair</StyledLink>
      {showNewLeadModal && (
        <LeadModal
          isEditModal={false}
          leadForm={leadForm}
          closeLeadModal={closeLeadModal}
          addNewLead={addNewLead}
          handleLeadForm={handleLeadForm}
        />
      )}
      {showLeadModal && (
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
          openLeadModal={openLeadModal}
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
