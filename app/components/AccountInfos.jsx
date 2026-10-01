import { AuthContext } from '../context/AuthProvider/AuthProvider'
import { useContext } from 'react'

function AccountInfos() {
    const { userInfo } = useContext(AuthContext)
    // console.log('dans AccountInfos, userInfo = ', userInfo)
    const fullDateFormat = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className='flex flex-row gap-9 rounded-[20px]'>
            <div className='block overflow-hidden rounded-[10px]'>
                <img className='w-19 h-18 xl:w-26 xl:h-29.25 object-cover transition-transform duration-300 ease-in-out hover:scale-150 hover:-translate-y-4' src={userInfo.profile.profilePicture} alt="" />
            </div>
            <div className='flex flex-col gap-4 justify-center' >
                <h4 className='text-darkPrimary' >{userInfo.profile.firstName} {userInfo.profile.lastName}</h4>
                <p className='bodyDefault text-greyLight' >Membre depuis le {fullDateFormat.format(new Date(userInfo.profile.createdAt))}</p>
            </div>
        </div >
    )
}

export default AccountInfos