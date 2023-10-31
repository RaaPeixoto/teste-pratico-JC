function getLoggedUser(){
    const user = localStorage.getItem("user")
    return user
}

export {getLoggedUser}