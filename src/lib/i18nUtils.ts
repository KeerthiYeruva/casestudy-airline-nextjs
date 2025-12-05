/**
 * Internationalization utilities for currency conversion, timezone handling, and locale formatting
 */

import type { Locale } from '@/i18n';

// ============ Currency Configuration ============
export const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

// Exchange rates relative to USD (updated periodically)
const exchangeRates: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.12
};

// Currency symbols
const currencySymbols: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹'
};

// ============ Currency Conversion ============
export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number {
  const amountInUSD = amount / exchangeRates[fromCurrency];
  return amountInUSD * exchangeRates[toCurrency];
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  locale: Locale = 'en'
): string {
  // Get locale string for Intl
  const localeString = getLocaleString(locale);
  
  return new Intl.NumberFormat(localeString, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }).format(amount);
}

export function getCurrencySymbol(currency: SupportedCurrency): string {
  return currencySymbols[currency];
}

// ============ Timezone Handling ============
export const supportedTimezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney'
] as const;

export type SupportedTimezone = (typeof supportedTimezones)[number];

export function convertToTimezone(date: Date | string, timezone: SupportedTimezone): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Convert to the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return new Date(formatter.format(dateObj));
}

export function getTimezoneOffset(timezone: SupportedTimezone): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset'
  });
  
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(part => part.type === 'timeZoneName');
  return offsetPart?.value || '';
}

// ============ Locale-specific Date/Time Formatting ============
export function getLocaleString(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP'
  };
  return localeMap[locale];
}

export function formatDate(
  date: Date | string,
  locale: Locale = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeString = getLocaleString(locale);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat(localeString, options || defaultOptions).format(dateObj);
}

export function formatTime(
  date: Date | string,
  locale: Locale = 'en',
  use24Hour: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeString = getLocaleString(locale);
  
  return new Intl.DateTimeFormat(localeString, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour && locale === 'en'
  }).format(dateObj);
}

export function formatDateTime(
  date: Date | string,
  locale: Locale = 'en',
  timezone?: SupportedTimezone,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeString = getLocaleString(locale);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  };

  return new Intl.DateTimeFormat(localeString, options || defaultOptions).format(dateObj);
}

export function formatRelativeTime(
  date: Date | string,
  locale: Locale = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  
  const localeString = getLocaleString(locale);
  const rtf = new Intl.RelativeTimeFormat(localeString, { numeric: 'auto' });

  const intervals = [
    { seconds: 31536000, unit: 'year' },
    { seconds: 2592000, unit: 'month' },
    { seconds: 86400, unit: 'day' },
    { seconds: 3600, unit: 'hour' },
    { seconds: 60, unit: 'minute' }
  ] as const;

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(
        diffInSeconds < 0 ? -count : count,
        interval.unit
      );
    }
  }

  return rtf.format(diffInSeconds, 'second');
}

// ============ Locale Preferences ============
export interface LocalePreferences {
  locale: Locale;
  currency: SupportedCurrency;
  timezone: SupportedTimezone;
  use24Hour: boolean;
}

const defaultPreferences: LocalePreferences = {
  locale: 'en',
  currency: 'USD',
  timezone: 'America/New_York',
  use24Hour: false
};

export function getLocalePreferences(): LocalePreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  
  const stored = localStorage.getItem('localePreferences');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
}

export function setLocalePreferences(preferences: Partial<LocalePreferences>): void {
  if (typeof window === 'undefined') return;
  
  const current = getLocalePreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('localePreferences', JSON.stringify(updated));
}

// ============ Number Formatting ============
export function formatNumber(
  value: number,
  locale: Locale = 'en',
  options?: Intl.NumberFormatOptions
): string {
  const localeString = getLocaleString(locale);
  return new Intl.NumberFormat(localeString, options).format(value);
}
