function DateSelector({ dateRange, setDateRange }) {

    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const isPlusDisabled = dateRange.endDate >= today

    const dateFormat = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
    });

    function handleclick(sign) {
        setDateRange((current) => {
            const startDate = new Date(current.startDate)
            const endDate = new Date(current.endDate)
            startDate.setDate(startDate.getDate() + sign * 7)
            endDate.setDate(endDate.getDate() + sign * 7)

            return { startDate, endDate }
        })
    }

    return (
        <div className='flex flex-row gap-1.5 items-center text-darkPrimary bodySmall'>
            <button className='bg-white size-6 border rounded-[10px] border-greyDark hover:not-disabled:bg-blueHover hover:not-disabled:text-white' onClick={() => handleclick(-1)} >{'<'}</button>

            {dateFormat.format(dateRange.startDate)} - {dateFormat.format(dateRange.endDate)}

            <button className='bg-white size-6 border rounded-[10px] border-greyDark hover:not-disabled:bg-blueHover hover:not-disabled:text-white disabled:opacity-20 disabled:bg-greyDark disabled:cursor-not-allowed disabled:border-greyDark' onClick={() => handleclick(1)} disabled={isPlusDisabled} >{'>'}</button>
        </div>
    )
}

export default DateSelector