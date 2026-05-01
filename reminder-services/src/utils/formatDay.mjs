export default function formatDay(dateValue) {
    const now = new Date();
    const targetDate = new Date(dateValue);

    const todayStr = now.toISOString().slice(0, 10);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
    const targetDateStr = targetDate.toISOString().slice(0, 10);

    if (targetDateStr === todayStr) return "Today";
    if (targetDateStr === yesterdayStr) return "Yesterday";

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}`;
}
