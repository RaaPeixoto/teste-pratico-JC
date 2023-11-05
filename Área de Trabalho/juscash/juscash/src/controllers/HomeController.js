import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home } from "../pages/index.js";
import Loading from "../components/Loading.js";
import { STEPS } from "../constants/steps.js";
import {
  getUserLeads,
  updateLeadStep,
  postNewLead,
} from "../services/LeadsService.js";
import { showError, showSuccess } from "../utils/showMessages.js";
import { OPPORTUNITIES } from "../constants/opportunities.js";
import checkFormFields from "../utils/checkFormFields.js";
function HomeController() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    opportunities: [],
  });

  const [leadsList, setLeadsList] = useState([]);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
    const leads = getUserLeads(user?.id);
    setLeadsList(leads);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  function handleLeadForm(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (value === "all") {
        if (checked) {
          checkAllOpportunitiesLead();
        } else {
          setLeadForm({
            ...leadForm,
            opportunities: [],
          });
        }

        return;
      }
      if (checked) {
        setLeadForm({
          ...leadForm,
          opportunities: [...leadForm.opportunities, value],
        });
      } else {
        setLeadForm({
          ...leadForm,
          opportunities: leadForm.opportunities.filter(
            (opportunity) => opportunity !== value
          ),
        });
      }
    } else {
      setLeadForm({ ...leadForm, [name]: value });
    }
  }
  function openNewLeadModal() {
    setShowNewLeadModal(true);
    checkAllOpportunitiesLead();
  }
  function openLeadModal(lead) {
    setLeadForm(lead);
    setShowLeadModal(true);
  }
  function checkAllOpportunitiesLead() {
    const allOpportunities = OPPORTUNITIES.map((o) => {
      return o.id;
    });
    setLeadForm({
      ...leadForm,
      opportunities: allOpportunities,
    });
  }
  function handleDragStart(e, leadId, originStepId) {
    e.dataTransfer.setData("leadId", leadId);
    e.dataTransfer.setData("originStepId", originStepId);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, stepId) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    const originStepId = e.dataTransfer.getData("originStepId");
    if (
      parseInt(originStepId) + 1 !== stepId &&
      parseInt(originStepId) !== stepId
    ) {
      showError("Leads só podem ser arrastados para a próxima etapa!");
      return;
    }
    const updatedLeads = leadsList.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, step_id: stepId };
      }
      return lead;
    });

    setLeadsList(updatedLeads);
    updateLeadStep(leadId, stepId);
  }

  if (loading) {
    return <Loading />;
  }

  function closeLeadModal() {
    setShowNewLeadModal(false);
    setShowLeadModal(false);
    setLeadForm({
      name: "",
      email: "",
      phone: "",
      opportunities: [],
    });
  }
  function addNewLead(e) {
    e.preventDefault();
    try {
      const isAllFieldsFilled = checkFormFields(leadForm);
      if (!isAllFieldsFilled) {
        throw new Error("Preencha Todos os campos");
      }
      const newLeadsList = postNewLead(leadForm, user.id);
      setLeadsList(newLeadsList);
      closeLeadModal();
      showSuccess("Lead adicionado com sucesso!");
    } catch (error) {
      showError(error.message);
    }
  }

  return (
    <Home
      steps={STEPS}
      leadsList={leadsList}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      handleDragStart={handleDragStart}
      showNewLeadModal={showNewLeadModal}
      showLeadModal={showLeadModal}
      openLeadModal={openLeadModal}
      openNewLeadModal={openNewLeadModal}
      leadForm={leadForm}
      handleLeadForm={handleLeadForm}
      closeLeadModal={closeLeadModal}
      addNewLead={addNewLead}
    />
  );
}

export default HomeController;
