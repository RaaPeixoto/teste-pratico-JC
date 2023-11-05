import {
  PageContainer,
  FormContainer,
  EyeSlash,
  OpenedEyes,
  StyledLink,
} from "../../assets/style/signUpStyle.js";

function SignIn({
  form,
  loading,
  handleForm,
  signIn,
  showPassword,
  handleShowPassword,
}) {
  return (
    <PageContainer>
      <FormContainer onSubmit={signIn}>
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
        <StyledLink to="/signup"> Primeiro acesso? Cadastre-se</StyledLink>
        <button type="submit" disabled={loading}>
          {loading ? "Carregando" : "Entrar"}
        </button>
      </FormContainer>
    </PageContainer>
  );
}
export { SignIn };
