import { generateUniqueId } from "../utils/generateUniqueId";
import bcrypt from "bcryptjs";

async function registerUser(form) {
  const id = generateUniqueId();
  const encryptedPass = await encryptPass(form.password);
  const user = {
    id: id,
    ...form,
    password: encryptedPass,
    confirmPassword: encryptedPass,
  };

  localStorage.setItem("user", JSON.stringify(user));
  var users = localStorage.getItem("users");
  users = users ? JSON.parse(users) : [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  return user;
}
function getLoggedUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
function getAllUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : null;
}
async function startSession(form) {
  const allUsers = getAllUsers();
  for (const user of allUsers) {
    if (
      user.email === form.email &&
      (await isPassMatch(form.password, user.password))
    ) {
      setLSUser(JSON.stringify(user));
      return user;
    }
  }
  throw new Error("E-mail e/ou senha incorreto(s)");
}

function setLSUser(user) {
  localStorage.setItem("user", user);
}

async function encryptPass(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function isPassMatch(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error(error.message);
  }
}
export { registerUser, getLoggedUser, startSession, setLSUser };
