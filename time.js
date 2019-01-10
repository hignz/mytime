const days = [
    'Sun',
    'Mon',
    'Tues',
    'Wed',
    'Thursday',
    'Fri',
    'Sat',
]

document.addEventListener('DOMContentLoaded', () => {
    const d = new Date();
    document.getElementById('date-time').innerHTML = days[d.getDay()];
});