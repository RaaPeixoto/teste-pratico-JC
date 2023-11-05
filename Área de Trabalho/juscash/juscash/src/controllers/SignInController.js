import { SignIn } from "../pages/index.js";
import { AuthContext } from "../contexts/AuthContext";
import { useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { startSession } from "../services/UsersServices.js";
import { showError, showSuccess } from "../utils/showMessages.js";
function SignInController() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  async function signIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await startSession(form);
      setUser(user);
      showSuccess(`Bem vindo(a) ${user.name}!`);
      navigate("/");
    } catch (error) {
      showError(error.message);
    }
    setLoading(false);
  }
  function handleForm(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  return (
    <SignIn
      loading={loading}
      form={form}
      handleForm={handleForm}
      signIn={signIn}
      showPassword={showPassword}
      handleShowPassword={handleShowPassword}
    />
  );
}

export default SignInController;
