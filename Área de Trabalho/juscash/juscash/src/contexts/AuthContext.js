import { createContext, useState} from "react";
import {getLoggedUser} from'../services/AuthService.js'
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
    const [user,setUser] = useState (getLoggedUser)
    return(
        <AuthContext.Provider value = {{user,setUser}}>
            {props.children}
        </AuthContext.Provider>
    )
}