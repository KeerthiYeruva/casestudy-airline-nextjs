'use client';

/**
 * Locale Selector Component
 * Allows users to change language, currency, and timezone preferences
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import {
  Language as LanguageIcon,
  AttachMoney as CurrencyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n';
import type { SupportedCurrency, SupportedTimezone } from '@/lib/i18nUtils';
import {
  getLocalePreferences,
  setLocalePreferences,
  supportedCurrencies,
  supportedTimezones
} from '@/lib/i18nUtils';

const LocaleSelector: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  
  const [currency, setCurrency] = useState<SupportedCurrency>(() => {
    if (typeof window === 'undefined') return 'USD';
    return getLocalePreferences().currency;
  });
  const [timezone, setTimezone] = useState<SupportedTimezone>(() => {
    if (typeof window === 'undefined') return 'America/New_York';
    return getLocalePreferences().timezone;
  });

  // Suppress the React hooks linter for this specific case of hydration check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (locale: Locale) => {
    if (!mounted) return;
    
    setLocalePreferences({ locale });
    
    // Update URL to use new locale
    const segments = pathname.split('/');
    if (segments[1] && ['en', 'es', 'fr', 'de', 'ja'].includes(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    
    router.push(segments.join('/'));
    handleLanguageClose();
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    setCurrency(newCurrency);
    setLocalePreferences({ currency: newCurrency });
  };

  const handleTimezoneChange = (newTimezone: SupportedTimezone) => {
    setTimezone(newTimezone);
    setLocalePreferences({ timezone: newTimezone });
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {/* Language Selector - Compact */}
      <Button
        onClick={handleLanguageClick}
        startIcon={<LanguageIcon />}
        variant="outlined"
        size="small"
        color="inherit"
        sx={{ 
          minWidth: 'auto',
          px: 1,
          fontSize: '0.75rem'
        }}
      >
        {currentLanguage.flag}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageClose}
      >
        {languages.map(lang => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === currentLocale}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
            {lang.code === currentLocale && (
              <CheckIcon fontSize="small" color="primary" />
            )}
          </MenuItem>
        ))}
      </Menu>

      {/* Currency & Timezone Settings */}
      <Button
        onClick={handleSettingsClick}
        startIcon={<CurrencyIcon />}
        variant="outlined"
        size="small"
      >
        {currency}
      </Button>
      <Popover
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Regional Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value as SupportedCurrency)}
                label="Currency"
              >
                {supportedCurrencies.map(curr => (
                  <MenuItem key={curr} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={timezone}
                onChange={(e) => handleTimezoneChange(e.target.value as SupportedTimezone)}
                label="Timezone"
              >
                {supportedTimezones.map(tz => (
                  <MenuItem key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};

export default LocaleSelector;
