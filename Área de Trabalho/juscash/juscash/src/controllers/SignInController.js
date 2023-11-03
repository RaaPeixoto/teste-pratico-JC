import { SignIn } from "../pages/index.js";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
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

    function signIn(e) {
      e.preventDefault();
      console.log(form);
      try {
        const user = startSession(form);
        setUser(user);
        showSuccess("Bem vindo");
        navigate("/")
      } catch (error) {
        showError(error.message);
      }
    }
  
/*     function signInVerify() {
      const errorMessages = {
        missingFields: "Preencha todos os campos!",
        weakPassword:
          "Sua senha deve conter ao menos 8 caracteres, contendo ao menos, um caracter especial, um caracter numérico, um caracter alfanumérico",
        differentPass: "As senhas devem coincidir",
      };
  
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        throw new Error(errorMessages.missingFields);
      }
  
      const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
      const isStrongPassword = regex.test(form.password);
  
      if (!isStrongPassword) {
        throw new Error(errorMessages.weakPassword);
      }
  
      if (form.password !== form.confirmPassword) {
        throw new Error(errorMessages.differentPass);
      }
    } */

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