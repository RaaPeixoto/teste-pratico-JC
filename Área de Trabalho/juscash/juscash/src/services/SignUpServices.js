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

export { registerUser };
