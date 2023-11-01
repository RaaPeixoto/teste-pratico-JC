import {
  PageContainer,
  FormContainer,
  PasswordValidatorContainer,
  PasswordValidator,
  CheckIcon,
  EyeSlash,
  OpenedEyes,
} from "../../assets/style/signUpStyle.js";
import { Logo } from "../../components/index.js";

function SignUp({
  form,
  loading,
  handleForm,
  signUp,
  passwordVerify,
  showPassword,
  handleShowPassword,
  showConfirmPassword,
  handleShowConfirmPassword,
}) {
  return (
    <PageContainer>
      <FormContainer onSubmit={signUp}>
        <div>
          <p>
            Seu nome completo: <span>*</span>{" "}
          </p>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleForm}
            disabled={loading}
          />
        </div>
        <div>
          <p>
            E-mail: <span>*</span>{" "}
          </p>
          <input
            name="email"
            value={form.email}
            onChange={handleForm}
            type="email"
            disabled={loading}
          />
        </div>
        <div>
          <p>
            Senha: <span>*</span>
          </p>

          <input
            name="password"
            value={form.password}
            onChange={handleForm}
            type={showPassword ? "text" : "password"}
            disabled={loading}
          />
          {showPassword ? (
            <OpenedEyes onClick={handleShowPassword} />
          ) : (
            <EyeSlash onClick={handleShowPassword} />
          )}
        </div>
        <div>
          <p>
            Confirme sua senha: <span>*</span>
          </p>

          <input
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleForm}
            type={showConfirmPassword ? "text" : "password"}
            disabled={loading}
          />
          {showConfirmPassword ? (
            <OpenedEyes onClick={handleShowConfirmPassword} />
          ) : (
            <EyeSlash onClick={handleShowConfirmPassword} />
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Carregando" : "Criar Conta"}
        </button>
        A senha precisa conter ao menos:
        <PasswordValidatorContainer>
          <div>
            <CheckIcon verify={passwordVerify.mincaracteres ? "ok" : ""} /> 8
            caracteres
          </div>
          <div>
            <CheckIcon verify={passwordVerify.especial ? "ok" : ""} /> um
            caracter especial
          </div>
          <div>
            <CheckIcon verify={passwordVerify.numerico ? "ok" : ""} /> um
            caracter numérico
          </div>
          <div>
            <CheckIcon verify={passwordVerify.alfanumerico ? "ok" : ""} /> um
            caracter alfanumérico
          </div>
        </PasswordValidatorContainer>
      </FormContainer>
    </PageContainer>
  );
}
export { SignUp };
