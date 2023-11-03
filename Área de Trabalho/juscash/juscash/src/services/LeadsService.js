import { generateUniqueId } from "../utils/generateUniqueId";
function getUserLeads(userId) {
  const allLeads = getAllLeads();
  const userLeads = allLeads.filter((lead) => {
    return lead.user_id === userId;
  });
  return userLeads;
}
function getAllLeads() {
  console.log("all");
  const allLeads = localStorage.getItem("leads")
    ? JSON.parse(localStorage.getItem("leads"))
    : [];
  return allLeads;
}
function updateLeadStep(leadId, stepId) {
  const allLeads = getAllLeads();
  const updatedLeads = allLeads.map((l) => {
    return leadId == l.id ? { ...l, step_id: stepId } : l;
  });
  saveLSLeads(updatedLeads);
}

function postNewLead(lead, user_id) {
  const id = generateUniqueId();
  const allLeads = getAllLeads();
  const newLead = {
    ...lead,
    id,
    user_id,
    step_id: 0,
  };

  allLeads.push(newLead);

  saveLSLeads(allLeads);
  const allUserLeads = getUserLeads(user_id);
  return allUserLeads;
}

function saveLSLeads(leads) {
  localStorage.setItem("leads", JSON.stringify(leads));
}
export { getUserLeads, updateLeadStep, postNewLead };
