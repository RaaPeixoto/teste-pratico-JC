import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home } from "../pages/index.js";
import { Loading } from "../components/index.js";
import { STEPS } from "../constants/steps.js";
import { getUserLeads,updateLeadStep  } from "../services/LeadsService.js";
import { toast } from "react-toastify";


function HomeController() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLeadModal,setShowLeadModal]=useState(false);
  const leads = getUserLeads(user?.id) ;
  /*     [{id:0,user_id:"lofp4tot16lp9",step_id:0,name:"AWS Advocacia",email:"sadsadsa",telefone:"312312",opportunities_id:[0]}] */
  const [leadsList, setLeadsList] = useState(leads);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
    
  }, []);
  
  function handleLeadModal(){
    console.log(showLeadModal)
    setShowLeadModal(!showLeadModal)
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
    if (parseInt(originStepId) + 1 !== stepId && parseInt(originStepId) !== stepId) {
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

  return <Home steps={STEPS}leadsList={leadsList} handleDragOver={handleDragOver}
    handleDrop={handleDrop} handleDragStart={handleDragStart} showLeadModal={showLeadModal} handleLeadModal={handleLeadModal}/>;
}

export default HomeController;
