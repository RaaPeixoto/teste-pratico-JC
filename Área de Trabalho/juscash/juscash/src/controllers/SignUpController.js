import { SignUp } from "../pages/index.js";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { registerUser } from "../services/SignUpServices.js";
function SignUpController() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVerify, setPasswordVerify] = useState({
    mincaracteres: false,
    especial: false,
    numerico: false,
    alfanumerico: false,
  });
  function handleShowPassword() {
    setShowPassword(!showPassword);
  }
  function handleShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }
  function signUp(e) {
    e.preventDefault();
    console.log(form);
    try {
      formVerify();
      const newUser = registerUser(form);
      setUser(newUser);
      showSuccess("Usuário registrado com sucesso");
    } catch (error) {
      showError(error.message);
    }
  }

  function formVerify() {
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
  }
  function showSuccess(message) {
    Swal.fire("Sucesso!", message, "success").then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  }
  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: message,
    });
  }
  function handleForm(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    name === "password" && verifyPassword(value);
  }
  function verifyPassword(pass) {
    const minCaracteresValid = pass.length >= 8;
    const especialValid = /[!@#$%^&*]/.test(pass);
    const numericoValid = /[0-9]/.test(pass);
    const alfanumericoValid = /[a-zA-Z0-9]/.test(pass);
    console.log(especialValid);
    setPasswordVerify({
      mincaracteres: minCaracteresValid,
      especial: especialValid,
      numerico: numericoValid,
      alfanumerico: alfanumericoValid,
    });
  }

  useEffect(() => {
    localStorage.setItem("user", ""); //SER NO SERVICE
    setUser(null);
  }, []);

  return (
    <SignUp
      loading={loading}
      form={form}
      handleForm={handleForm}
      signUp={signUp}
      passwordVerify={passwordVerify}
      showPassword={showPassword}
      handleShowPassword={handleShowPassword}
      showConfirmPassword={showConfirmPassword}
      handleShowConfirmPassword={handleShowConfirmPassword}
    />
  );
}

export default SignUpController;
