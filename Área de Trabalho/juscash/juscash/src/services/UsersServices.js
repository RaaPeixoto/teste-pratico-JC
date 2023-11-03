import { generateUniqueId } from "../utils/generateUniqueId";
function registerUser(form) {
  const id = generateUniqueId();
  const user = { id: id, ...form };
  localStorage.setItem("user", JSON.stringify(user)); //signIn
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
function startSession(form) {
  const allUsers = getAllUsers();
  const user = allUsers.find((u) => u.email === form.email && u.password === form.password);
  if (!user) {
    throw new Error("E-mail e/ou senha incorreto(s)");

  }
  return user;
}
export { registerUser, getLoggedUser, startSession };
