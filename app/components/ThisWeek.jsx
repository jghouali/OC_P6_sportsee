import { useContext, useEffect, useState } from 'react'
import { useSubmit } from 'react-router';
import { PieChart, Pie, Sector } from 'recharts';
import { APIService } from '../services/APIService';
import { getDateRangeFrom } from '../utils/dates.js';
import { handleErrorAPI } from '../utils/handleErrorAPI.js'
import { AuthContext } from '../context/AuthProvider/AuthProvider'

// color for the PieChart
const COLORS = ['#0B23F4', '#B6BDFC']; // réalisées, restants

function renderLabel({ cx, cy, midAngle, outerRadius, value, name, payload }) {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 20
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

function ThisWeek() {
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

    const submit = useSubmit()

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
                handleErrorAPI(err, setThisWeekData, setThisWeekDataLoading, submit)
            })

        return () => { ignore = true }
        // Run only once, at mount.
    }, [])

    return (
        < div className='flex flex-col gap-8' >
            <div className='flex flex-col gap-2'>
                <h4>Cette semaine</h4>
                <p className='bodyLarge text-greyLight'>Du {thisWeekRange.startDate.toLocaleDateString('fr-FR')} au {thisWeekRange.endDate.toLocaleDateString('fr-FR')}</p>
            </div>
            {
                thisWeekDataLoading ?
                    <div className='flex flex-col justify-center items-center w-full xl:w-5/12 h-87.75 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                        <p className='text-bluePrimary text-3xl animate-bounce'>Chargement en cours</p>
                    </div> :
                    thisWeekData.message ?
                        <div className='flex flex-col justify-center items-center w-full xl:w-5/12 h-87.75 bg-white rounded-[10px] pt-4 px-10 pb-6 shadow-chart hover:shadow-chart-hover transition-shadow duration-300 ease-chart-shadow-hover'>
                            <p className='text-bluePrimary text-3xl animate-bounce'>{thisWeekData.message}</p>
                        </div> :
                        <div className='flex flex-row gap-7.75 pb-8'>

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
                        </div>
            }

        </div >
    )

}

export default ThisWeek