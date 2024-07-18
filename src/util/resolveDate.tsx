import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Function to format the date
export const resolveDate = (dateString: string | undefined): { date: string; time: string } => {
    if (!dateString) return { date: '', time: '' };
    
    const date = parseISO(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = toZonedTime(date, timeZone);

    const formattedDate = format(localDate, 'dd MMM. yyyy');
    const formattedTime = format(localDate, 'HH:mma').toLowerCase();

    return { date: formattedDate, time: formattedTime };
};

// Example usage
// const gmtDateString = '2024-07-06T12:34:56.78Z';
// const localDateTime = resolveDate(gmtDateString);
// console.log(`Date: ${localDateTime.date}`); // Outputs the formatted local date
// console.log(`Time: ${localDateTime.time}`); // Outputs the formatted local time
