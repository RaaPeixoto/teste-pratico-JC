import { generateUniqueId } from "../utils/generateUniqueId";

async function registerUser(form) {
  const id = generateUniqueId();
  const user = {
    id: id,
    ...form,
   
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
      user.password === form.password
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

export { registerUser, getLoggedUser, startSession, setLSUser };
