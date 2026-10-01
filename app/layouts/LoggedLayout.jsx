import { Outlet } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

function LoggedLayout() {
    return (
        <>
            <div className='flex flex-col min-h-screen'>
                <div className='flex flex-col flex-1 pt-8.75 px-8 xl:px-37.5 gap-27'>
                    <Header />
                    <main className='flex flex-col flex-1 gap-27 pt-8.5 px-8 xl:px-13 py-32'>
                        <Outlet />
                    </main>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default LoggedLayout