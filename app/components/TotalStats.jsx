import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import BlueBlock from './BlueBlock'

function TotalStats() {
    const { userInfo } = useContext(AuthContext)
    const fullDateFormat = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
                <h4 className='text-darkPrimary'>Vos statistiques</h4>
                <p className='bodyDefault text-greyLight'>
                    depuis le {fullDateFormat.format(new Date(userInfo.profile.createdAt))}
                </p>
            </div>
            <div className='flex flex-row flex-wrap gap-4.5'>
                <BlueBlock className='w-6/13'>
                    <p className='bodyDefault text-white'>Temps total couru</p>
                    <div>
                        <h4 className='inline-block align-bottom pl-1 text-white'>{Math.floor(userInfo.statistics.totalDuration / 60)}h</h4>
                        <p className='inline-block align-bottom pl-1 bodyLarge text-blueLight'> {userInfo.statistics.totalDuration % 60}min </p >
                    </div>
                </BlueBlock>
                <BlueBlock className='w-6/13'>
                    <p className='bodyDefault text-white'>Calories brûlées</p>
                    <div>
                        <h4 className='inline-block align-bottom pl-1 text-white'>{userInfo.statistics.totalCaloriesBurned}</h4>
                        <p className='inline-block align-bottom pl-1 bodyLarge text-blueLight'> cal</p>
                    </div >
                </BlueBlock >
                <BlueBlock className='w-6/13'>
                    <p className='bodyDefault text-white'>Distance totale parcourue</p>
                    <div>
                        <h4 className='inline-block align-bottom pl-1 text-white'>{userInfo.statistics.totalDistance}</h4>
                        <p className='inline-block align-bottom pl-1 bodyLarge text-blueLight'> km</p>
                    </div >
                </BlueBlock >
                <BlueBlock className='w-6/13'>
                    <p className='bodyDefault text-white'>Nombre de jours de repos</p>
                    <div>
                        <h4 className='inline-block align-bottom pl-1 text-white'>
                            {
                                Math.round(
                                    (
                                        (new Date(new Date().setHours(0, 0, 0, 0))) - new Date(userInfo.profile.createdAt + "T00:00")
                                    ) / (1000 * 60 * 60 * 24)
                                ) - userInfo.statistics.totalSessions
                            }
                        </h4>
                        <p className='inline-block align-bottom pl-1 bodyLarge text-blueLight'> jours</p>
                    </div >
                </BlueBlock >
                <BlueBlock className='w-6/13'>
                    <p className='bodyDefault text-white'>Nombre de sessions</p>
                    <div>
                        <h4 className='inline-block align-bottom pl-1 text-white'>{userInfo.statistics.totalSessions}</h4>
                        <p className='inline-block align-bottom pl-1 bodyLarge text-blueLight'> sessions</p>
                    </div >
                </BlueBlock >
            </div >
        </div >
    )
}

export default TotalStats