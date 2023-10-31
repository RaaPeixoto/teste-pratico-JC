import { createContext, useState} from "react";
import {getLoggedUser} from'../api/index.js'
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
    const [user,setUser] = useState (getLoggedUser)
    return(
        <AuthContext.Provider value = {{user,setUser}}>
            {props.children}
        </AuthContext.Provider>
    )
}