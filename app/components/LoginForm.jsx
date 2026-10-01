import { Link, useNavigate } from 'react-router'
import { useState, useContext } from 'react'
import { APIService } from '../services/APIService.js'
import { AuthContext } from '../context/AuthProvider/AuthProvider.jsx'

function LoginForm() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { setAuth } = useContext(AuthContext)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        let datas = null

        try {
            datas = await APIService.getLogin(username, password)
        } catch (err) {
            setError(err.message)
            setLoading(false)
            return null
        }

        if (!datas.token) {
            setError('No token retrieved')
            setLoading(false)
            return null
        }

        let datasUserInfo = null
        try {
            datasUserInfo = await APIService.getUserInfo(datas.token)
        } catch (err) {
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
        datasUserInfo.token = datas.token

        document.cookie = "auth=" + JSON.stringify({ userInfo: datasUserInfo }) + "; expires=" + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) + "; path=/";

        setAuth({ userInfo: datasUserInfo })
        navigate('/dashboard')
    }

    if (loading) return <p>Chargement..</p>

    return (
        <div className='flex flex-col w-99.5 gap-4 color-[#141629] items-baseline bg-white p-10 pb-20 rounded-[20px]'>
            <form className='flex flex-col gap-10' onSubmit={handleSubmit} method="post">
                <h3 className='text-bluePrimary'>Transformez vos stats en résultats</h3>

                <div className='flex flex-col gap-6'>
                    <h4>Se connecter</h4>
                    {error && <p>{error}</p>}
                    <div className='flex flex-col gap-2'>
                        <label className='bodyDefault text-greyLight' htmlFor="loginUsernameInput">Nom d'utilisateur</label>
                        <input className='border border-[#71717155] focus:border-bluePrimary transition-colors duration-300 ease-in h-14.5 w-79.25 pl-5 rounded-[10px] disabled:bg-greyLight disabled:text-greyLight outline-none' type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} id="loginUsernameInput" disabled={loading} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='bodyDefault text-greyLight' htmlFor="loginPasswordInput">Mot de passe</label>
                        <input className='border border-[#71717155] focus:border-bluePrimary transition-colors duration-300 ease-in h-14.5 w-79.25 pl-5 rounded-[10px] disabled:bg-greyLight disabled:text-greyLight outline-none' type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="loginPasswordInput" disabled={loading} />
                    </div>
                    <button className='h-14.5 w-79.25 bg-bluePrimary hover:bg-blueHover transition-colors duration-300 ease-in rounded-[10px] text-white bodyLarge py-4 px-10 disabled:text-greyLight' disabled={loading} type="submit">{loading ? 'Chargement en cours...' : 'Se connecter'}</button>
                </div>
                <Link className='no-underline bodyDefault text-darkPrimary' to="/recover">Mot de passe oublié ?</Link>
            </form >
        </div >
    )
}

export default LoginForm