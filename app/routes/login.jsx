import Logo from '../components/Logo.jsx'
import marathonImage from '../assets/marathon.png'
import LoginForm from '../components/LoginForm.jsx'

import { redirect } from 'react-router'
import { authCookie } from '../auth.server'
import { APIService } from '../services/APIService'

export async function loader({ request }) {
    const token = await authCookie.parse(request.headers.get("Cookie"))
    if (token) throw redirect("/dashboard")
    return null
}

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username || !password) {
        return { error: 'Veuillez entrer vos identifiants' }
    }

    try {
        const { token } = await APIService.getLogin(username, password)
        if (!token) return { error: "Aucun token valide reçu" }

        return redirect("/dashboard", {
            headers: { "Set-Cookie": await authCookie.serialize(token) },
        })
    } catch (err) {
        if (err.status === 401) return { error: "Identifiant ou mot de passe incorrect" }
        if (!err.status) return { error: "Serveur injoignable, réessayez plus tard" }
        return { error: "Une erreur est survenue" }
    }
}

function HomeLogin() {
    return (
        <main className="flex flex-row w-full min-h-screen justify-between">
            <div className="flex flex-col w-1/2 xl:w-5/12 gap-6 xl:gap-37.75 pl-13.75 xl:pl-25 pt-13.75">
                <div className='w-full'><Logo withCompanyName /></div>
                <div className='flex w-full items-center'><LoginForm /></div>
            </div>

            <div className="w-1/2 xl:w-7/12 bg-cover bg-center" style={{ backgroundImage: `url(${marathonImage})` }}>
            </div>
            <p className='absolute right-6 bottom-7.25 bodySmall text-bluePrimary w-[288px] h-15.5 bg-white rounded-[50px] p-4'>Analysez vos performances en un clin d’œil,
                suivez vos progrès et atteignez vos objectifs.</p>
        </main >
    )
}

export default HomeLogin