import {
  PasswordCheckListContainer,
  CheckIcon,
} from "../../assets/style/passwordCheckListStyle.js";
export default function PasswordCheckList({ passwordVerify }) {
  return (
    <PasswordCheckListContainer>
      <h6>Sua senha precisa conter:</h6>
      <li>
        <CheckIcon verify={passwordVerify.mincaracteres ? "ok" : ""} /> 8 ou
        mais caracteres;
      </li>
      <li>
        <CheckIcon verify={passwordVerify.especial ? "ok" : ""} /> Pelo menos um
        caracter especial;
      </li>
      <li>
        <CheckIcon verify={passwordVerify.numerico ? "ok" : ""} /> Pelo menos um
        caracter numérico;
      </li>
      <li>
        <CheckIcon verify={passwordVerify.alfanumerico ? "ok" : ""} /> Pelo
        menos um caracter alfanumérico;
      </li>
    </PasswordCheckListContainer>
  );
}
