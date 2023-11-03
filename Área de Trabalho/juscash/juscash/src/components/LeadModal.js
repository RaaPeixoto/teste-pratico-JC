import {
  ModalPageContainer,
  ModalContainer,
  Form,
  CloseIcon,
  OpportunitiesContainer,
  ButtonsContainer,
} from "../assets/style/leadModalStyle.js";
import InputMask from "react-input-mask"; //DESINSTALAR
import { OPPORTUNITIES } from "../constants/opportunities.js";
export default function LeadModal({
  isEditModal,
  leadForm,
  handleLeadForm,
  addNewLead,
  closeLeadModal,
}) {
  console.log(isEditModal);
  return (
    <ModalPageContainer>
      <ModalContainer>
        <CloseIcon />
        {isEditModal ? <h4>Lead</h4> : <h4>Novo Lead</h4>}
        <Form onSubmit={isEditModal ? closeLeadModal : addNewLead}>
          <h5>Dados do Lead</h5>
          <div>
            <p>
              Nome completo: <span>*</span>
            </p>
            <input
              type="text"
              name="name"
              value={leadForm.name}
              onChange={handleLeadForm}
              disabled={isEditModal}
            />
          </div>
          <div>
            <p>
              E-mail: <span>*</span>
            </p>
            <input
              name="email"
              value={leadForm.email}
              onChange={handleLeadForm}
              type="email"
              disabled={isEditModal}
            />
          </div>
          <div>
            <p>
              Telefone: <span>*</span>
            </p>

            <input
              name="phone"
              value={leadForm.phone}
              onChange={handleLeadForm}
              type="tel"
              disabled={isEditModal}
            />
          </div>
          <h5>Oportunidades</h5>
          <OpportunitiesContainer>
            <label htmlFor="all">
              <input
                disabled={isEditModal}
                type="checkbox"
                id="all"
                name="opportunities"
                checked={leadForm.opportunities.length === OPPORTUNITIES.length}
                onChange={handleLeadForm}
                value="all"
              />
              Todos
            </label>
            {OPPORTUNITIES.map((o) => (
              <label key={o.id} htmlFor={o.id}>
                <input
                  disabled={isEditModal}
                  type="checkbox"
                  id={o.id}
                  name="opportunities"
                  checked={leadForm.opportunities.includes(o.id)}
                  onChange={handleLeadForm}
                  value={o.id}
                />
                {o.title}
              </label>
            ))}
          </OpportunitiesContainer>
          <ButtonsContainer>
            <button type="button" onClick={closeLeadModal}>
              Cancelar
            </button>
            <button type="submit">Salvar</button>
          </ButtonsContainer>
        </Form>
      </ModalContainer>
    </ModalPageContainer>
  );
}
