export default function formatDay(transactionDate) {
    const now = new Date();
    const txDate = new Date(transactionDate);

    const todayStr = now.toISOString().slice(0, 10);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
    const txDateStr = txDate.toISOString().slice(0, 10);

    if (txDateStr === todayStr) return "Today";
    if (txDateStr === yesterdayStr) return "Yesterday";

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[txDate.getMonth()]} ${txDate.getDate()}`;
}