'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpIcon from '@mui/icons-material/Help';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider } from '@mui/material/styles';
import { invertedTheme } from '@/components/mui/theme/Theme';

const handleClickHelp = (e: any) => {
  e.preventDefault();
  window.open("https://mapofpi.zapier.app", "_blank", "noopener, noreferrer");
};

export default function SimpleBottomNavigation() {
  const t = useTranslations();
  const locale = useLocale();
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <ThemeProvider theme={invertedTheme}>
        <BottomNavigation
          sx={{ backgroundColor: 'secondary.main' }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction 
            label="Discover" 
            icon={<LocationOnIcon />} 
            component={Link} 
            href="/" 
          />
          <BottomNavigationAction 
            label={t('HOME.ADD_SELLER')} 
            icon={<SellIcon />} 
            component={Link} 
            href={`/${locale}/seller/registration`} 
          />
          <BottomNavigationAction 
            label="Help" 
            icon={<HelpIcon />} 
            onClick={handleClickHelp} 
          />
          <BottomNavigationAction 
            label="Settings" 
            icon={<SettingsIcon />} 
            component={Link} 
            href={`/${locale}/settings`} 
          />
        </BottomNavigation>
      </ThemeProvider>
    </Box>
  );
}
