import ThisWeek from './ThisWeek';
import DistanceChart from './DistanceChart';
import HeartRateChart from './HeartRateChart';


function LastPerformances() {
    return (
        <div className='flex flex-col gap-26.75'>
            <div className='flex flex-col gap-8'>
                <h4>Vos dernières performances</h4>
                <div className='flex flex-row gap-7.75'>
                    <DistanceChart />
                    <HeartRateChart />
                </div>
            </div>

            <ThisWeek />
        </div>
    )

}

export default LastPerformances