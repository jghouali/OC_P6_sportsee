// milliseconds per periods
export const MS_PER_DAY = 1000 * 60 * 60 * 24
// Intl formatter
export const shortDayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
export const dayMonthFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" })

export function getDateRangeFrom(daysAmount, fromDay) {
    const startDate = new Date(fromDay)
    const endDate = new Date(fromDay)
    startDate.setDate(startDate.getDate() - daysAmount + 1)
    return { startDate, endDate }
}