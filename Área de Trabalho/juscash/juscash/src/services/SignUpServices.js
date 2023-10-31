function registerUser(form) {
  localStorage.setItem('user',JSON.stringify(form)) //signIn
  var users = localStorage.getItem('users')
  users = users?JSON.parse(users) : []
  users.push(form)
  localStorage.setItem('users',JSON.stringify(users))
  console.log("Sucesso");
}

export { registerUser };
