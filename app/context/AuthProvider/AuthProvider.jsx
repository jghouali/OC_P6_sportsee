import { createContext, useState } from "react";

export const AuthContext = createContext(null)

function AuthProvider({ children }) {

    const [auth, setAuth] = useState(() => {
        const userCookie = document.cookie.split('; ')
            .find((part) => part.startsWith('auth='))
            ?.slice('auth='.length)
        // console.log("voici le cookie", userCookie)

        return (userCookie
            ? JSON.parse(userCookie)
            : { userInfo: null })
    })

    // console.log('Dans AuthProvider, dans auth on a : ', auth)

    return (
        <AuthContext.Provider value={{ userInfo: auth.userInfo, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider