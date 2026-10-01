import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider/AuthProvider";
import BlueBlock from "./BlueBlock";
import goal from '../assets/goal.png'

function TotalDistance() {
    const { userInfo } = useContext(AuthContext)

    return (
        < div className='flex flex-row items-center gap-4.5' >
            <p className='bodyDefault text-greyLight' >Distance totale parcourue</p>
            <BlueBlock width={'250px'}>
                <div className='flex flex-row items-center gap-4.5 animate-reveal'>
                    <img className="size-14" src={goal} alt="" />
                    <h4 className="text-white">{userInfo.statistics.totalDistance} km</h4>
                </div>
            </BlueBlock>

        </div >
    )

}

export default TotalDistance