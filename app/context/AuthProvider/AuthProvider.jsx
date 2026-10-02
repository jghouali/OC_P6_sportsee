import { createContext } from "react";

export const AuthContext = createContext(null)

function AuthProvider({ children, userInfo }) {

    return (
        <AuthContext.Provider value={{ userInfo }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider