import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider/AuthProvider'
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, PieChart, Pie, Sector } from 'recharts';
import { APIService } from '../services/APIService';
import DateSelector from './DateSelector';

// CONSTANTS
// milliseconds per periods
const MS_PER_DAY = 1000 * 60 * 60 * 24
// Initial Data Value from API
const WeekDistanceDataInitialValue = { date: '', caloriesBurned: 0, distance: 0, duration: 0, interval: '' }
const dayHeartRateDataInitialValue = { date: '', min: 0, max: 0, average: 0, count: 0 }
// Intl formatter
const shortDayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
const dayMonthFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" })
// color for the PieChart
const COLORS = ['#0B23F4', '#B6BDFC']; // réalisées, restants

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

function renderLabel({ cx, cy, midAngle, outerRadius, value, name, payload }) {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 20                      // 20px en dehors de l'anneau
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const isRight = x > cx

    return (
        <g>
            <text x={x} y={y} textAnchor={isRight ? 'start' : 'end'}
                dominantBaseline="central" fontSize={12} fill="#707070">
                <tspan fill={payload.fill}>● </tspan>
                {value} {name}
            </text>
        </g>
    )
}

function getDateRangeFrom(daysAmount, fromDay) {
    const startDate = new Date(fromDay)
    const endDate = new Date(fromDay)
    startDate.setDate(startDate.getDate() - daysAmount + 1)
    return { startDate, endDate }
}

function LastPerformances() {
    // today
    const today = new Date().setHours(0, 0, 0, 0)
    // thisWeekRange
    const thisWeekRange = getDateRangeFrom(7, today)

    // CONTEXT
    // user information stored in AuthContext
    const { userInfo } = useContext(AuthContext)

    // USESTATE
    // weeklyGoal achievement, duration, and distance for this week
    const [thisWeekData, setThisWeekData] = useState(
        { distance: 0, duration: 0, weeklyGoal: 0, goal: [{ name: "restants", value: 0 }, { name: "réalisées", value: 0 }] }
    )
    const [thisWeekDataLoading, setThisWeekDataLoading] = useState(true)
    // Distance data for the four selected weeks in the TotalDistance chart
    const [fourWeekDistanceData, setFourWeekDistanceData] = useState([
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue },
        { ...WeekDistanceDataInitialValue }
    ])
    const [fourWeekDistanceDataLoading, setFourWeekDistanceDataLoading] = useState(true)
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
    // the selected date interval in the TotalDistance chart
    const [distanceDateRange, setDistanceDateRange] = useState(() => getDateRangeFrom(28, today))
    // the selected date interval in the HeartRate chart
    const [heartRateDateRange, setHeartRateDateRange] = useState(() => getDateRangeFrom(7, today))

    // USE EFFECT
    // Fetch data from the API and adapt it for the weekly goal achievement, duration, and distance component and chart.
    // The resulting data is stored in the thisWeekData state.
    useEffect(() => {
        let ignore = false
        setThisWeekDataLoading(true)
        APIService.getActivityInfos(userInfo.token, thisWeekRange.startDate, thisWeekRange.endDate)
            .then(response => {
                if (ignore) return
                const acc = response.reduce(({ accDistance, accDuration, accCount }, row) => ({
                    accDistance: accDistance + row.distance,
                    accDuration: accDuration + row.duration,
                    accCount: accCount + 1
                }), { accDistance: 0, accDuration: 0, accCount: 0 })

                setThisWeekData({
                    distance: acc.accDistance,
                    duration: acc.accDuration,
                    weeklyGoal: userInfo.profile.weeklyGoal || 0,
                    goal: [
                        {
                            name: "restants",
                            value: Math.max(0, userInfo.profile.weeklyGoal - acc.accCount) || 0,
                            fill: COLORS[1]
                        },
                        {
                            name: "réalisées",
                            value: acc.accCount,
                            fill: COLORS[0]
                        }]
                })
                setThisWeekDataLoading(false)
            })
            .catch(err => {
                if (ignore) return
                setThisWeekData({ "message": err.message })
                setThisWeekDataLoading(false)
            })

        return () => { ignore = true }
        // Run only once, at mount.
    }, [])

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
                setFourWeekDistanceData({ "message": err.message })
                setFourWeekDistanceDataLoading(false)
            })

        return () => { ignore = true }
    }, [distanceDateRange.startDate])

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
                setOneWeekHeartRateData({ "message": err.message })
                setOneWeekHeartRateDataLoading(false)
            })

        return () => { ignore = true }
    }, [heartRateDateRange.startDate])

    return !thisWeekData.message && (
        <div className='flex flex-col gap-26.75'>
            <div className='flex flex-col gap-8'>
                <h4>Vos dernières performances</h4>
                <div className='flex flex-row gap-7.75'>

                    {(!fourWeekDistanceDataLoading) && <div className='flex flex-col w-full xl:w-5/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
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
                    </div> ||
                        <div className='flex flex-col justify-center items-center w-full xl:w-5/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <p className='text-bluePrimary text-3xl animate-bounce'>Chargement en cours</p>
                        </div>
                    }

                    {!oneWeekHeartRateDataLoading &&
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
                        </div> ||
                        <div className='flex flex-col justify-center items-center w-full xl:w-7/12 xl:h-132 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <p className='text-bluePrimary text-3xl animate-bounce'>Chargement en cours</p>
                        </div>
                    }
                </div>
            </div>

            <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-2'>
                    <h4>Cette semaine</h4>
                    <p className='bodyLarge text-greyLight'>Du {thisWeekRange.startDate.toLocaleDateString('fr-FR')} au {thisWeekRange.endDate.toLocaleDateString('fr-FR')}</p>
                </div>
                {!thisWeekDataLoading && <div className='flex flex-row gap-7.75 pb-8'>

                    <div className='flex flex-col w-full xl:w-5/12 h-87.75 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <div className='py-2.5'>
                            <h3 className='text-bluePrimary inline-block pr-1.25'>x {thisWeekData.goal[1].value || 0}</h3>
                            <p className='text-blueLight inline-block '>{thisWeekData.weeklyGoal > 0 ? `sur objectif de ${thisWeekData.weeklyGoal}` : 'Aucun objectif fixé'}</p>
                        </div>
                        <p className='bodySmall text-greyLight'>Courses hebdomadaire réalisées</p>
                        <div className='flex-1 min-h-0'>
                            <PieChart
                                responsive
                                style={{
                                    width: '100%', height: '100%'
                                }}
                            >
                                <Pie
                                    data={thisWeekData.goal}
                                    dataKey="value"
                                    nameKey="name"

                                    innerRadius="45%"
                                    outerRadius="75%"
                                    startAngle={120}
                                    endAngle={-240}

                                    label={renderLabel}
                                    labelLine={false}
                                    animationDuration={500}
                                    animationEasing="ease-out"
                                />
                            </PieChart>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 w-full xl:w-7/12'>
                        <div className='w-full bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <div className='flex flex-col gap-4.5'>
                                <p className='bodySmall text-greyLight'>Durée d’activité</p>
                                <div>
                                    <h4 className='text-bluePrimary align-sub inline-block'>{thisWeekData.duration}</h4>
                                    <p className='bodyLarge text-blueLight align-sub inline-block pl-1'> minutes</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <div className='flex flex-col gap-4.5'>
                                <p className='bodySmall text-greyLight'>Distance</p>
                                <div>
                                    <h4 className='text-redPrimary align-sub inline-block'>{thisWeekData.distance.toFixed(3)}</h4>
                                    <p className='bodyLarge text-redLight align-sub inline-block pl-1'> kilomètres</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> ||
                    <div className='flex flex-col justify-center items-center w-full xl:w-5/12 h-87.75 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <p className='text-bluePrimary text-3xl animate-bounce'>Chargement en cours</p>
                    </div>
                }
            </div>
        </div >
    )
        || (
            <div>
                <h3>🙈</h3>
                <p className='bodyDefault'>Le site rencontre actuellement un problème technique.</p>
                <p className='bodyDefault'>Nous travaillons activement à un rétablissement rapide.</p>
                <p className='bodyDefault'>Merci de votre compréhension.</p>
            </div>
        )

}

export default LastPerformances