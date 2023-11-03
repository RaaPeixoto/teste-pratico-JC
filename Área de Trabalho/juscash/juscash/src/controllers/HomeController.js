import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home } from "../pages/index.js";
import { Loading } from "../components/index.js";
import { STEPS } from "../constants/steps.js";
import {
  getUserLeads,
  updateLeadStep,
  postNewLead,
} from "../services/LeadsService.js";
import { toast } from "react-toastify";
import { OPPORTUNITIES } from "../constants/opportunities.js";
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
  const leads = getUserLeads(user?.id); //COLOCAR USE EFFECT

  const [leadsList, setLeadsList] = useState(leads);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
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

    console.log(leadForm);
  }
  function openNewLeadModal() {
    console.log(showNewLeadModal);
    setShowNewLeadModal(true);
    checkAllOpportunitiesLead();
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
  const handleDragStart = (e, leadId, originStepId) => {
    e.dataTransfer.setData("leadId", leadId);
    e.dataTransfer.setData("originStepId", originStepId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stepId) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    const originStepId = e.dataTransfer.getData("originStepId");
    if (
      parseInt(originStepId) + 1 !== stepId &&
      parseInt(originStepId) !== stepId
    ) {
      toast.error("Leads só podem ser arrastados para a próxima etapa!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    const updatedLeads = leadsList.map((lead) => {
      if (lead.id == leadId) {
        return { ...lead, step_id: stepId };
      }
      return lead;
    });

    setLeadsList(updatedLeads);
    updateLeadStep(leadId, stepId);
  };

  if (loading) {
    return <Loading />;
  }

  function closeLeadModal() {
    setShowNewLeadModal(false);
    setLeadForm({
    name: "",
    email: "",
    phone: "",
    opportunities: [],
  })
  }
  function addNewLead(e) {
    e.preventDefault();
    try{
        const newLeadsList = postNewLead(leadForm, user.id);
        setLeadsList(newLeadsList);
        console.log(leadsList)
        closeLeadModal()
    }catch(err){

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
      setShowLeadModal={setShowLeadModal}
      openNewLeadModal={openNewLeadModal}
      leadForm={leadForm}
      handleLeadForm={handleLeadForm}
      closeLeadModal={closeLeadModal}
      addNewLead={addNewLead}
    />
  );
}

export default HomeController;
