import { Navigate } from 'react-router'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import LoggedLayout from '../layouts/LoggedLayout'

export default function ProtectedLayout() {
    const { userInfo } = useContext(AuthContext)

    if (!userInfo) {
        return <Navigate to="/login" replace />
    }

    return <LoggedLayout />
}