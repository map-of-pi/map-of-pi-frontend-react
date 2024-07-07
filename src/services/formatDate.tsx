//npm install date-fns date-fns-tz

// import { parseISO, format } from 'date-fns';
// import { utcToZonedTime } from 'date-fns-tz';

// // Function to format the date
// export const formatDateToLocalTime = (dateString: string | undefined): string => {
//     if (!dateString) return '';
//     const date = parseISO(dateString);
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const localDate = utcToZonedTime(date, timeZone);
//     return format(localDate, 'yyyy-MM-dd HH:mm');
// };