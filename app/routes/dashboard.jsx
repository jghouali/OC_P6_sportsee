import AccountInfos from '../components/AccountInfos.jsx'
import TotalDistance from '../components/TotalDistance.jsx'
import LastPerformances from '../components/LastPerformances.jsx'

export default function Dashboard() {
    return (
        <>
            <div className='flex flex-row w-full justify-between items-center rounded-[20px] py-8 px-12.75 bg-linear-to-b from-white to-[#FFFFFF00]'>
                <AccountInfos />
                <TotalDistance />
            </div>
            <LastPerformances />
        </>
    );
}