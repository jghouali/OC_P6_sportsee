import Logo from "./Logo"

function Footer() {
    return (
        <footer className='flex flex-row justify-between py-2.5 px-25 bg-white'>
            <div className='flex flex-row items-center gap-2.25'><p>©Sportsee</p><p>Tous droits réservés</p></div>
            <div className='flex flex-row items-center gap-4'><p>Conditions générales</p><p className="pr-4">Contact</p><Logo /></div>

        </footer>
    )

}

export default Footer