function getUserLeads(userId){
    const allLeads = getAllLeads()
    const userLeads = allLeads.filter((lead)=> {return lead.user_id === userId})
    return userLeads
}
function getAllLeads(){
    console.log(localStorage.getItem('leads'))
    const allLeads = localStorage.getItem('leads')? JSON.parse(localStorage.getItem('leads')) : []
    return allLeads
}
function updateLeadStep(leadId,stepId){
  
    const allLeads = getAllLeads()
    const updatedLeads = allLeads.map((l)=> {
       return leadId == l.id? {...l,step_id:stepId} : l
    })
    localStorage.setItem('leads',JSON.stringify(updatedLeads))
}
export{getUserLeads,updateLeadStep}