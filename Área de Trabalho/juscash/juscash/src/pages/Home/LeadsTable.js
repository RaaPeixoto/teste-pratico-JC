
import { Table } from "../../assets/style/leadsTableStyle.js";

function LeadsTable({ steps,leadsList,handleDragOver,handleDrop,handleDragStart }) {


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
                  key={index}
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div
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
