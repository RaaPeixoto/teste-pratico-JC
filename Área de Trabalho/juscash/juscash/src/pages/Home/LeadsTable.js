
import { Table } from "../../assets/style/leadsTableStyle.js";

function LeadsTable({ steps,leadsList,handleDragOver,handleDrop,handleDragStart,setShowLeadModal}) {


  return (
    <>
      <Table>
        <thead>
          <tr>
            {steps.map((step, index) => (
              <th key={index}>{step}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {

          leadsList.map((lead) => (
            <tr key={lead.id}>
              {steps.map((step, index) => (
                <td
                  key={lead.id+"_"+index}
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div
                  onClick ={()=>setShowLeadModal(true)}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, lead.id, lead.step_id)
                    }
                  >
                    {lead.step_id === index ? lead.name : ""}
                  </div>
                </td>
              ))}
            </tr>
          )) 
        }
        </tbody>
      </Table>
    </>
  );
}
export { LeadsTable };
