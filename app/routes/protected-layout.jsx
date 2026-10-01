import { Navigate, redirect } from 'react-router'
import { authCookie } from '../auth.server.js'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import LoggedLayout from '../layouts/LoggedLayout'

export async function loader({ request }) {
    const token = await authCookie.parse(request.headers.get("Cookie"))
    if (!token) throw redirect("/login")
    return null
}

export default function ProtectedLayout() {
    const { userInfo } = useContext(AuthContext)

    if (!userInfo) {
        return <Navigate to="/login" replace />
    }

    return <LoggedLayout />
}