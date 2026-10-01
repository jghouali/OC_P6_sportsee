import AccountInfos from '../components/AccountInfos'
import PersonnalInfos from '../components/PersonnalInfos'
import TotalStats from '../components/TotalStats'

function Profile() {
    return (
        <div className='flex flex-row justify-between gap-14.25 xl:gap-20'>
            <div className='flex flex-col flex-1 gap-4 '>
                <div className='flex flex-col w-full py-6 bg-white pl-12.75 pr-8 rounded-[10px]'>
                    <AccountInfos />
                </div>
                <div className='flex flex-col flex-1 w-full'>
                    <PersonnalInfos />
                </div>
            </div>
            <div className='flex flex-col flex-1'>
                <TotalStats />
            </div>
        </div>
    )
}

export default Profile