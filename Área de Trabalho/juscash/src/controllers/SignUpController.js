import { SignUp } from "../pages/index.js";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser, setLSUser } from "../services/UsersServices.js";
import { showError, showSuccess } from "../utils/showMessages.js";
import checkFormFields from "../utils/checkFormFields.js";
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
    setLoading(true);
    try {
      formVerify();
      const newUser = registerUser(form);
      setUser(newUser);
      navigate("/");
      showSuccess("Usuário registrado com sucesso");
    } catch (error) {
      showError(error.message);
    }
    setLoading(false);
  }

  function formVerify() {
    const errorMessages = {
      missingFields: "Preencha todos os campos!",
      weakPassword: "Sua senha deve atender a todos os critérios solicitados!",
      differentPass: "As senhas devem coincidir!",
    };
    const isAllFieldsFilled = checkFormFields(form);
    if (!isAllFieldsFilled) {
      throw new Error(errorMessages.missingFields);
    }

    const isStrongPassword = Object.values(passwordVerify).every(
      (value) => value === true
    );

    if (!isStrongPassword) {
      throw new Error(errorMessages.weakPassword);
    }

    if (form.password !== form.confirmPassword) {
      throw new Error(errorMessages.differentPass);
    }
  }

  function handleForm(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      verifyPassword(value);
    }
  }
  function verifyPassword(pass) {
    const minCaracteresValid = pass.length >= 8;
    const especialValid = /[!@#$%^&*]/.test(pass);
    const numericoValid = /[0-9]/.test(pass);
    const alfanumericoValid = /[a-zA-Z0-9]/.test(pass);
    setPasswordVerify({
      mincaracteres: minCaracteresValid,
      especial: especialValid,
      numerico: numericoValid,
      alfanumerico: alfanumericoValid,
    });
  }

  useEffect(() => {
    setLSUser("");
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
