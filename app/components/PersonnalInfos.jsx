import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider/AuthProvider'

function PersonnalInfos() {
    const { userInfo } = useContext(AuthContext)

    return (
        <div className='flex flex-col gap-8 bg-white rounded-[20px] py-6 pr-13 pl-8'>
            <div>
                <h4 className='text-darkPrimary'>Votre profil</h4>
                <hr className='border-b border-greyLight2 border-0 mt-6 ' />
            </div>
            <div className='flex flex-col gap-6'>
                <p className='bodyLarge text-greyLight'>Âge : {userInfo.profile.age}</p>
                <p className='bodyLarge text-greyLight'>Genre : {userInfo.profile.gender === 'female' ? 'Femme' : 'Homme'}</p>
                <p className='bodyLarge text-greyLight'>Taille : {`${Math.floor(userInfo.profile.height / 100)}m${String(userInfo.profile.height % 100).padStart(2, '0')}`}</p>
                <p className='bodyLarge text-greyLight'>Poids : {userInfo.profile.weight}kg</p>
            </div>
        </div>
    )
}

export default PersonnalInfos