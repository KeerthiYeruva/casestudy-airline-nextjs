# Internationalization (i18n) Guide

This guide explains how to use the internationalization features in the Airline Management System.

## Overview

The application supports multiple languages, currencies, and timezones:

- **Languages**: English, Spanish, French, German, Japanese
- **Currencies**: USD, EUR, GBP, JPY, CNY, INR
- **Timezones**: Multiple global timezones including US, European, and Asian zones

## Architecture

### Core Components

1. **next-intl Integration**: Used for translations and locale management
2. **Currency Conversion**: Real-time currency conversion with exchange rates
3. **Timezone Handling**: Locale-aware date/time formatting
4. **Locale Selector**: UI component for changing language and regional settings

### File Structure

```
src/
├── i18n.ts                     # i18n configuration
├── middleware.ts               # Locale routing middleware
├── lib/
│   └── i18nUtils.ts           # Currency, timezone utilities
├── components/
│   └── LocaleSelector.tsx     # Language/currency selector
└── messages/
    ├── en.json                # English translations
    ├── es.json                # Spanish translations
    ├── fr.json                # French translations
    ├── de.json                # German translations
    └── ja.json                # Japanese translations
```

## Using Translations

### In Components

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('submit')}</button>
    </div>
  );
}
```

### Translation Keys Structure

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "Error"
  },
  "navigation": {
    "home": "Home",
    "checkIn": "Check-In"
  },
  "checkIn": {
    "title": "Staff Check-In",
    "selectFlight": "Select Flight"
  }
}
```

## Currency Conversion

### Basic Usage

```tsx
import { formatCurrency, convertCurrency } from '@/lib/i18nUtils';

// Format currency
const priceUSD = formatCurrency(100, 'USD', 'en'); // "$100.00"
const priceEUR = formatCurrency(100, 'EUR', 'fr'); // "100,00 €"

// Convert between currencies
const amountInEUR = convertCurrency(100, 'USD', 'EUR'); // ~92 EUR
```

### Supported Currencies

- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **CNY** - Chinese Yuan (¥)
- **INR** - Indian Rupee (₹)

### Exchange Rates

Exchange rates are defined in `src/lib/i18nUtils.ts` and can be updated periodically:

```typescript
const exchangeRates: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.12
};
```

## Date and Time Formatting

### Format Dates

```tsx
import { formatDate, formatTime, formatDateTime } from '@/lib/i18nUtils';

// Format date
const date = formatDate(new Date(), 'en'); // "December 5, 2025"
const dateFr = formatDate(new Date(), 'fr'); // "5 décembre 2025"

// Format time
const time = formatTime(new Date(), 'en'); // "2:30 PM"
const time24 = formatTime(new Date(), 'en', true); // "14:30"

// Format date and time with timezone
const dateTime = formatDateTime(
  new Date(), 
  'en', 
  'America/New_York'
); // "Dec 5, 2025, 02:30 PM"
```

### Timezone Conversion

```tsx
import { convertToTimezone, getTimezoneOffset } from '@/lib/i18nUtils';

// Convert to specific timezone
const nyTime = convertToTimezone(new Date(), 'America/New_York');
const tokyoTime = convertToTimezone(new Date(), 'Asia/Tokyo');

// Get timezone offset
const offset = getTimezoneOffset('America/New_York'); // "GMT-5"
```

### Relative Time

```tsx
import { formatRelativeTime } from '@/lib/i18nUtils';

// Format relative time
const future = new Date(Date.now() + 3600000); // 1 hour from now
const relative = formatRelativeTime(future, 'en'); // "in 1 hour"

const past = new Date(Date.now() - 86400000); // 1 day ago
const relativePast = formatRelativeTime(past, 'en'); // "yesterday"
```

## Locale Preferences

### Saving User Preferences

```tsx
import { setLocalePreferences, getLocalePreferences } from '@/lib/i18nUtils';

// Get current preferences
const prefs = getLocalePreferences();
console.log(prefs.locale);     // 'en'
console.log(prefs.currency);   // 'USD'
console.log(prefs.timezone);   // 'America/New_York'

// Update preferences
setLocalePreferences({
  locale: 'es',
  currency: 'EUR',
  timezone: 'Europe/Madrid'
});
```

### Using the Locale Selector

The `LocaleSelector` component is automatically included in the layout:

```tsx
import LocaleSelector from '@/components/LocaleSelector';

<LocaleSelector currentLocale="en" />
```

Features:
- Language selection with flags
- Currency selection
- Timezone selection
- Persists preferences to localStorage

## URL-based Locale Routing

The middleware automatically handles locale-based routing:

```
/ → /en (default locale)
/es → Spanish version
/fr → French version
/de → German version
/ja → Japanese version
```

## Adding New Languages

### 1. Add Locale to Configuration

Update `src/i18n.ts`:

```typescript
export const locales = ['en', 'es', 'fr', 'de', 'ja', 'pt'] as const;
```

### 2. Create Translation File

Create `messages/pt.json`:

```json
{
  "common": {
    "welcome": "Bem-vindo",
    "loading": "Carregando..."
  }
}
```

### 3. Update Locale Selector

Add to `src/components/LocaleSelector.tsx`:

```typescript
const languages = [
  // ... existing languages
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];
```

### 4. Update Middleware

The middleware will automatically handle the new locale.

## Best Practices

### 1. Always Use Translation Keys

❌ **Don't hardcode text:**
```tsx
<button>Submit</button>
```

✅ **Use translation keys:**
```tsx
const t = useTranslations('common');
<button>{t('submit')}</button>
```

### 2. Namespace Translations

Organize translations by feature:

```typescript
const t = useTranslations('checkIn');
t('title');           // checkIn.title
t('selectFlight');    // checkIn.selectFlight
```

### 3. Format All Prices

Always format currency values:

```tsx
import { formatCurrency } from '@/lib/i18nUtils';

// Get user's preferred currency
const prefs = getLocalePreferences();

const price = formatCurrency(
  item.price, 
  prefs.currency, 
  prefs.locale
);
```

### 4. Format All Dates and Times

```tsx
import { formatDateTime } from '@/lib/i18nUtils';

const prefs = getLocalePreferences();

const formattedDate = formatDateTime(
  flight.departureTime,
  prefs.locale,
  prefs.timezone
);
```

### 5. Handle Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}
```

```tsx
const t = useTranslations('items');
const count = 5;
t('items', { count }); // "5 items"
```

## Testing Translations

### 1. Test Each Language

```bash
# English
http://localhost:3000/en

# Spanish
http://localhost:3000/es

# French
http://localhost:3000/fr
```

### 2. Test Currency Conversion

```tsx
import { convertCurrency } from '@/lib/i18nUtils';

describe('Currency Conversion', () => {
  it('converts USD to EUR', () => {
    const result = convertCurrency(100, 'USD', 'EUR');
    expect(result).toBeCloseTo(92, 1);
  });
});
```

### 3. Test Date Formatting

```tsx
import { formatDate } from '@/lib/i18nUtils';

describe('Date Formatting', () => {
  it('formats date in English', () => {
    const date = new Date('2025-12-05');
    const result = formatDate(date, 'en');
    expect(result).toContain('December');
  });
});
```

## Performance Considerations

### 1. Message Loading

Messages are loaded per route to avoid loading all translations at once:

```typescript
// Only loads messages for current locale
const messages = await getMessages();
```

### 2. Client-Side Caching

Locale preferences are cached in localStorage:

```typescript
// Preferences persist across sessions
const prefs = getLocalePreferences(); // Reads from localStorage
```

### 3. Static Generation

Use static generation for locale-specific pages:

```typescript
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

## Common Issues and Solutions

### Issue: Translations Not Showing

**Solution**: Ensure the translation key exists in all language files:

```bash
# Check all language files
grep -r "common.welcome" messages/
```

### Issue: Currency Conversion Inaccurate

**Solution**: Update exchange rates in `src/lib/i18nUtils.ts`:

```typescript
const exchangeRates = {
  USD: 1.0,
  EUR: 0.92, // Update this value
  // ...
};
```

### Issue: Timezone Not Displaying Correctly

**Solution**: Verify timezone string format:

```typescript
// ✅ Correct format
'America/New_York'

// ❌ Incorrect format
'EST'
```

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Intl API Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [IANA Time Zone Database](https://www.iana.org/time-zones)
- [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)
