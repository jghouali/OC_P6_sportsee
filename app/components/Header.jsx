import { NavLink } from 'react-router'
import Logo from './Logo'

function Header() {
    return (
        <header className='flex flex-row justify-between'>
            <Logo withCompanyName />

            <nav className='flex bg-white rounded-[40px] gap-10 py-4 px-12'>
                <NavLink to="/dashboard" end className='text-darkPrimary no-underline hover:text-bluePrimary'>Dashboard</NavLink>
                <NavLink to="/profile" className='text-darkPrimary no-underline hover:text-bluePrimary'>Mon profil</NavLink>
                <hr className='h-4.25 border-l border-bluePrimary mt-1' />
                <NavLink to="/logout" className='text-bluePrimary no-underline'>Se déconnecter</NavLink>
            </nav>
        </header>
    )
}

export default Header
