import { useContext, useEffect, useState } from 'react'
import { useSubmit } from 'react-router';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import { APIService } from '../services/APIService';
import { getDateRangeFrom, MS_PER_DAY, shortDayFormat } from '../utils/dates.js';
import { handleErrorAPI } from '../utils/handleErrorAPI.js'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import DateSelector from './DateSelector';

// CONSTANTS
// Initial Data Value from API
const dayHeartRateDataInitialValue = { date: '', min: 0, max: 0, average: 0, count: 0 }

function HeartRateTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }
    const { min, max, average } = payload[0].payload
    return (
        <div className='bg-black opacity-100 color-greyLight p-2.5 rounded-[10px]'>
            <strong style={{ color: payload[0].color }}>{label}</strong>

            <div style={{ color: payload[0].color }}>
                <p>Min : {min.toFixed(1)}</p>
                <p>Max : {max.toFixed(1)}</p>
                <p>Moyenne : {average.toFixed(1)}</p>
            </div>
        </div>
    );
}

function HeartRateChart() {
    // today
    const today = new Date().setHours(0, 0, 0, 0)

    // CONTEXT
    // user information stored in AuthContext
    const { userInfo } = useContext(AuthContext)

    // USESTATE
    // Minimum, maximum, and average heart rate for the selected week in the HeartRate Chart
    const [oneWeekHeartRateData, setOneWeekHeartRateData] = useState([
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue },
        { ...dayHeartRateDataInitialValue }
    ])
    const [oneWeekHeartRateDataLoading, setOneWeekHeartRateDataLoading] = useState(true)

    // the selected date interval in the HeartRate chart
    const [heartRateDateRange, setHeartRateDateRange] = useState(() => getDateRangeFrom(7, today))

    const submit = useSubmit()

    // USE EFFECT
    // Fetch data from the API and adapt it for the HeartRate chart for the selected week.
    // The resulting data is stored in the oneWeekHeartRateData state.
    useEffect(() => {
        let ignore = false
        setOneWeekHeartRateDataLoading(true)

        const oneWeekHeartRateDataAgregate = [
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue },
            { ...dayHeartRateDataInitialValue }
        ]

        APIService.getActivityInfos(userInfo.token, heartRateDateRange.startDate, heartRateDateRange.endDate)
            .then(response => {
                if (ignore) return

                const mapped = response.map((row) => {
                    return {
                        date: row.date,
                        min: row.heartRate.min,
                        max: row.heartRate.max,
                        average: row.heartRate.average
                    }
                })

                // keep it safely sorted
                const sorted = mapped.sort((a, b) => a.date.localeCompare(b.date))

                // For each element, calculate its day index based on its position within the selected week,
                // get the abbreviated weekday name, then accumulate its data in the corresponding bucket.
                for (const element of sorted) {
                    const arrayIndex = Math.round((new Date(heartRateDateRange.endDate) - new Date(element.date + "T00:00")) / MS_PER_DAY)
                    if (arrayIndex < 0 || arrayIndex > 6) continue

                    const bucket = { ...oneWeekHeartRateDataAgregate[arrayIndex] }
                    bucket.min += element.min
                    bucket.max += element.max
                    bucket.average += element.average
                    bucket.count++

                    oneWeekHeartRateDataAgregate[arrayIndex] = { ...bucket }
                }

                // Calculate the weekly average by dividing the total by the element count and complete day of the week.
                for (const element of oneWeekHeartRateDataAgregate) {
                    const labelDate = new Date(heartRateDateRange.endDate)
                    labelDate.setDate(labelDate.getDate() - oneWeekHeartRateDataAgregate.indexOf(element))
                    element.date = shortDayFormat.format(labelDate)
                    element.min = element.min / element.count || 0
                    element.max = element.max / element.count || 0
                    element.average = element.average / element.count || 0
                }
                // Store the result in the oneWeekHeartRateData state.
                setOneWeekHeartRateData(oneWeekHeartRateDataAgregate.reverse())
                setOneWeekHeartRateDataLoading(false)
            })
            .catch(err => {
                if (ignore) return
                handleErrorAPI(err, setOneWeekHeartRateData, setOneWeekHeartRateDataLoading, submit)
            })

        return () => { ignore = true }
    }, [heartRateDateRange.startDate])

    return (
        <>
            {oneWeekHeartRateDataLoading ?
                <div className='flex flex-col justify-center items-center w-full xl:w-7/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                    <p className='text-bluePrimary text-3xl animate-bounce'>Chargement en cours</p>
                </div> :
                oneWeekHeartRateData.message ?
                    <div className='flex flex-col justify-center items-center w-full xl:w-7/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <p className='text-bluePrimary text-3xl animate-bounce'>{oneWeekHeartRateData.message}</p>
                    </div> :
                    <div className='flex flex-col w-full xl:w-7/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <div className='flex flex-col pb-4'>
                            <div className='flex flex-row justify-between py-2.5'>
                                <h4 className='text-redPrimary'>{
                                    (oneWeekHeartRateData.reduce((acc, el) => acc + el.average, 0) / oneWeekHeartRateData.filter((el) => el.average !== 0).length || 0).toFixed(1)
                                }BPM</h4>
                                <DateSelector dateRange={heartRateDateRange} setDateRange={setHeartRateDateRange} />
                            </div>
                            <p className='bodySmall text-greyLight'>Fréquence cardiaque moyenne</p>
                        </div>
                        <ComposedChart
                            className='[&:hover_.recharts-line-curve]:stroke-bluePrimary'
                            responsive
                            data={oneWeekHeartRateData}
                            style={{ width: '100%', height: '80%' }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeWidth={1}
                                strokeOpacity={0.3}
                                strokeDasharray={2}

                                horizontalCoordinatesGenerator={({ yAxis }) => [
                                    yAxis.niceTicks?.at(-1) * 0.33,
                                    yAxis.niceTicks?.at(-1) * 0.66,
                                    yAxis.niceTicks?.at(-1) * 0.99,
                                ].map((value) => yAxis.scale?.map(value))}
                                verticalCoordinatesGenerator={() => []}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tick={{
                                    fontSize: 12,
                                    letterSpacing: 0,
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                tick={{
                                    fontSize: 12,
                                    letterSpacing: 0,
                                }}
                                tickCount={5}
                            />
                            <Tooltip
                                content={<HeartRateTooltip />}
                            />
                            <Legend
                                align='left'
                                verticalAlign='bottom'
                                iconType='circle'
                                iconSize={8}
                                formatter={(label) => <span className='text-greyLight'>{label}</span>}
                            />
                            <Line
                                name="Average BPM"
                                activeDot={{ fill: '#0B23F4' }}
                                type="monotone"
                                dataKey="average"
                                stroke="#F2F3FF"
                                strokeWidth={3}
                                dot={{ stroke: 'blue', fill: 'blue', strokeWidth: 1 }}
                                animationDuration={500}
                                animationEasing="ease-out"
                            />
                            <Bar
                                name="Min"
                                dataKey="min"
                                radius={30}
                                fill='#FCC1B6'
                                barSize={14}
                                animationDuration={100}
                                animationEasing="ease-out"
                            />
                            <Bar
                                name="Max BPM"
                                dataKey="max"
                                radius={30}
                                fill='#F4320B'
                                barSize={14}
                                animationDuration={200}
                                animationEasing="ease-out"
                            />
                        </ComposedChart>
                    </div>
            }
        </>
    )
}

export default HeartRateChart