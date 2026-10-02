import { useContext, useEffect, useState } from 'react'
import { useSubmit } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { APIService } from '../services/APIService';
import { getDateRangeFrom, MS_PER_DAY, dayMonthFormat } from '../utils/dates.js';
import { handleErrorAPI } from '../utils/handleErrorAPI.js'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import DateSelector from './DateSelector';

// CONSTANTS
// Initial Data Value from API
const WeekDistanceDataInitialValue = { date: '', caloriesBurned: 0, distance: 0, duration: 0, interval: '' }

function DistanceTooltip({ active, payload }) {
    if (!active || !payload?.length) {
        return null;
    }
    const { distance, interval } = payload[0].payload
    return (
        <div className='bg-black opacity-100 color-greyLight p-2.5 rounded-[10px]'>
            <div style={{ color: '#E7E7E7' }}>
                <p>{interval}</p>
                <strong>Distance : {distance.toFixed(3)} km</strong>
            </div>
        </div>
    );
}

function DistanceChart() {
    // today
    const today = new Date().setHours(0, 0, 0, 0)

    // CONTEXT
    // user information stored in AuthContext
    const { userInfo } = useContext(AuthContext)

    // USESTATE
    // Distance data for the four selected weeks in the TotalDistance chart
    const [fourWeekDistanceData, setFourWeekDistanceData] = useState([
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue }
    ])
    const [fourWeekDistanceDataLoading, setFourWeekDistanceDataLoading] = useState(true)

    // the selected date interval in the TotalDistance chart
    const [distanceDateRange, setDistanceDateRange] = useState(() => getDateRangeFrom(28, today))

    const submit = useSubmit()

    // USE EFFECT
    // Fetch data from the API and adapt it for the TotalDistance chart for the four selected weeks.
    // The resulting data is stored in the fourWeekDistanceData state.
    useEffect(() => {
        let ignore = false
        setFourWeekDistanceDataLoading(true)
        const fourWeekDistanceDataAgregate = [
            { ...WeekDistanceDataInitialValue },
            { ...WeekDistanceDataInitialValue },
            { ...WeekDistanceDataInitialValue },
            { ...WeekDistanceDataInitialValue }
        ]

        APIService.getActivityInfos(userInfo.token, distanceDateRange.startDate, distanceDateRange.endDate)
            .then(response => {
                if (ignore) return
                // Keep only the relevant data
                const mapped = response.map(row => ({
                    caloriesBurned: row.caloriesBurned,
                    date: row.date,
                    distance: row.distance,
                    duration: row.duration
                }))

                // keep it safely sorted
                const sorted = mapped.sort((a, b) => a.date.localeCompare(b.date))

                // For each element, calculate its week index based on its position within the four selected weeks,
                // then accumulate its data in the corresponding bucket.
                for (const element of sorted) {
                    const days = Math.round((new Date(distanceDateRange.endDate) - new Date(element.date + "T00:00")) / MS_PER_DAY)
                    const weekIndex = Math.floor(days / 7)

                    if (weekIndex < 0 || weekIndex > 3) continue
                    const bucket = { ...fourWeekDistanceDataAgregate[weekIndex] }

                    bucket.caloriesBurned += element.caloriesBurned
                    bucket.duration += element.duration
                    bucket.distance += element.distance

                    fourWeekDistanceDataAgregate[weekIndex] = { ...bucket }
                }

                for (const element of fourWeekDistanceDataAgregate) {
                    const weekIndex = fourWeekDistanceDataAgregate.indexOf(element)
                    const startDate = new Date(distanceDateRange.endDate)
                    const endDate = new Date(distanceDateRange.endDate)
                    startDate.setDate(startDate.getDate() - (weekIndex * 7) - 6)
                    endDate.setDate(endDate.getDate() - (weekIndex * 7))
                    const start = dayMonthFormat.format(startDate)
                    const end = dayMonthFormat.format(endDate)

                    element.date = ['S4', 'S3', 'S2', 'S1'][weekIndex]
                    element.interval = `${start} au ${end}`
                }

                // Store the result in the fourWeekDistanceData state.
                setFourWeekDistanceData(fourWeekDistanceDataAgregate.reverse())
                setFourWeekDistanceDataLoading(false)
            })
            .catch(err => {
                if (ignore) return
                handleErrorAPI(err, setFourWeekDistanceData, setFourWeekDistanceDataLoading, submit)
            })

        return () => { ignore = true }
    }, [distanceDateRange.startDate])

    return (
        <>
            {
                fourWeekDistanceDataLoading ?
                    <div className='flex flex-col justify-center items-center w-full xl:w-5/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <p className='text-bluePrimary text-3xl animate-bounce' > Chargement en cours</p>
                    </div >
                    : fourWeekDistanceData.message ?
                        <div className='flex flex-col justify-center items-center w-full xl:w-5/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <p className='text-bluePrimary text-3xl animate-bounce'>{fourWeekDistanceData.message}</p>
                        </div>
                        :
                        <div className='flex flex-col w-full xl:w-5/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <div className='flex flex-col pb-4'>
                                <div className='flex flex-row justify-between py-2.5'>
                                    <h4 className='text-bluePrimary'>{(fourWeekDistanceData.reduce((acc, el) => acc + el.distance, 0) / 4).toFixed(0)}km en moyenne</h4>
                                    <DateSelector dateRange={distanceDateRange} setDateRange={setDistanceDateRange} />
                                </div>
                                <p className='bodySmall text-greyLight'>Total des kilomètres 4 dernières semaines</p>
                            </div>
                            <BarChart
                                responsive
                                data={fourWeekDistanceData}
                                style={{ width: '100%', height: '80%' }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    strokeWidth={1}
                                    strokeOpacity={0.3}
                                    strokeDasharray={2}
                                    horizontalCoordinatesGenerator={({ yAxis }) => [
                                        0,
                                        yAxis.niceTicks?.at(-1) * 0.4,
                                        yAxis.niceTicks?.at(-1) * 0.8,
                                    ].map((value) => yAxis.scale?.map(value))}
                                    verticalCoordinatesGenerator={() => []}
                                />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                />
                                <YAxis
                                    tickLine={false}
                                    tickCount={4}
                                />
                                <Tooltip
                                    content={<DistanceTooltip />}
                                    cursor={false}
                                />
                                <Legend
                                    align='left'
                                    verticalAlign='bottom'
                                    iconType='circle'
                                    iconSize={8}
                                    formatter={(label) => <span className='text-greyLight'>{label}</span>}
                                />
                                <Bar
                                    activeBar={{ fill: '#0B23F4' }}
                                    name="Km"
                                    dataKey="distance"
                                    radius={30}
                                    fill='#B6BDFC'
                                    barSize={14}
                                    animationDuration={200}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </div>
            }
        </>
    )
}

export default DistanceChart