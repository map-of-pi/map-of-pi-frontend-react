'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#386f4f',  // green
        },
        secondary: {
            main: '#ffc153',  // yellow
        },
    },
    typography: {
        fontFamily: 'Lato, Roboto, sans-serif',
    },
});

export default theme;

export const invertedTheme = createTheme({
    palette: {
        primary: {
            main: '#ffc153',  // yellow
        },
        secondary: {
            main: '#386f4f',  // green
        },
    },
    typography: {
        fontFamily: 'Lato, Roboto, sans-serif',
    },
});