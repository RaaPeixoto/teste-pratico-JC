import {ModalPageContainer,ModalContainer,Form} from '../assets/style/leadModalStyle.js'
import InputMask from 'react-input-mask';
export default function LeadModal ({isEditModal}) {

return (
    <ModalPageContainer>
        <ModalContainer> 
        <Form /* onSubmit={} */>
        <div>
          <p>
           Nome completo: <span>*</span>{" "}
          </p>
          <input
            type="text"
            name="name"
        /*     value={form.name} */
           /*  onChange={handleForm} */
            disabled={isEditModal}
          />
        </div>
        <div>
          <p>
            E-mail: <span>*</span>{" "}
          </p>
          <input
            name="email"
           /*  value={form.email} */
           /*  onChange={handleForm} */
            type="email"
            disabled={isEditModal}
          />
        </div>
        <div>
          <p>
            Telefone: <span>*</span>
          </p>

          <InputMask
              mask="(999) 99999-9999"
            name="phone"
           /*  value={form.password} */
          /*   onChange={handleForm} */
            type={"text"}
            disabled={isEditModal}

          />
       
        </div>
     
        <button type="submit" >
         "Salvar"
        </button>
        </Form>
        </ModalContainer>
        </ModalPageContainer>
)
}