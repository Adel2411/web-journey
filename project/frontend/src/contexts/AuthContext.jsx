import { createContext, useState, useEffect } from "react";
import { loginUser} from "../services/api";


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)


    useEffect(()=> {
        const token = localStorage.getItem("token")

        if(token){
            setUser({name : "test"})
        }

        setLoading(false)
    }, [])

    //login function

    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            localStorage.setItem("token", response.token);

            setUser(response.user)
            return { success : true }

        } catch(err) {
            return { success: false, message: err.message };
        }
    }

    //register function

    const register = async (userData) => {
        try{
            const response = await registerUser(userData)
            localStorage.setItem("token", response.token)

            setUser(response.user);
            return { success : true }

        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    //logout function

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }


    return(
        <AuthContext.Provider value={{ user, login, register, logout, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

