// Frontend validation utilities
// Shared validation functions for components

/**
 * Regular expressions for common validations
 */
export const ValidationRegex = {
  SEAT: /^[0-9]+[A-F]$/,
  BOOKING_REFERENCE: /^[A-Z]{3}[0-9]{3,7}$/,
  FLIGHT_NUMBER: /^[A-Z]{2}[0-9]{1,4}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME_12H: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
  PASSPORT: /^[A-Z0-9]{6,20}$/,
  CURRENCY: /^[A-Z]{3}$/,
  NAME: /^[a-zA-Z\s\u0080-\uFFFF.'-]+$/,
} as const;

/**
 * Validates seat number format (e.g., "1A", "12F")
 * @param seat - Seat number to validate
 * @returns true if valid, false otherwise
 */
export function validateSeat(seat: string): boolean {
  if (!seat || typeof seat !== 'string') return false;
  return ValidationRegex.SEAT.test(seat.trim().toUpperCase());
}

/**
 * Validates seat number with detailed error message
 * @param seat - Seat number to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateSeatWithMessage(seat: string): { valid: boolean; error?: string } {
  if (!seat || seat.trim() === '') {
    return { valid: false, error: 'Seat number is required' };
  }
  
  if (!ValidationRegex.SEAT.test(seat.trim().toUpperCase())) {
    return { valid: false, error: 'Invalid seat format. Use format like 1A, 2B, etc.' };
  }
  
  return { valid: true };
}

/**
 * Validates passenger name
 * @param name - Name to validate
 * @returns true if valid, false otherwise
 */
export function validatePassengerName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100 && ValidationRegex.NAME.test(trimmed);
}

/**
 * Validates passenger name with detailed error message
 * @param name - Name to validate
 * @returns { valid: boolean, error?: string }
 */
export function validatePassengerNameWithMessage(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must not exceed 100 characters' };
  }
  
  if (!ValidationRegex.NAME.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }
  
  return { valid: true };
}

/**
 * Validates booking reference format
 * @param reference - Booking reference to validate
 * @returns true if valid, false otherwise
 */
export function validateBookingReference(reference: string): boolean {
  if (!reference || typeof reference !== 'string') return false;
  return ValidationRegex.BOOKING_REFERENCE.test(reference.trim().toUpperCase());
}

/**
 * Validates booking reference with detailed error message
 * @param reference - Booking reference to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateBookingReferenceWithMessage(reference: string): { valid: boolean; error?: string } {
  if (!reference || reference.trim() === '') {
    return { valid: false, error: 'Booking reference is required' };
  }
  
  if (!ValidationRegex.BOOKING_REFERENCE.test(reference.trim().toUpperCase())) {
    return { valid: false, error: 'Invalid booking reference format. Use format like ABC123' };
  }
  
  return { valid: true };
}

/**
 * Validates flight number format
 * @param flightNumber - Flight number to validate
 * @returns true if valid, false otherwise
 */
export function validateFlightNumber(flightNumber: string): boolean {
  if (!flightNumber || typeof flightNumber !== 'string') return false;
  return ValidationRegex.FLIGHT_NUMBER.test(flightNumber.trim().toUpperCase());
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns true if valid, false otherwise
 */
export function validateDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false;
  
  if (!ValidationRegex.DATE.test(date)) return false;
  
  // Also check if it's a valid date
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * Validates date with detailed error message
 * @param date - Date string to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateDateWithMessage(date: string): { valid: boolean; error?: string } {
  if (!date || date.trim() === '') {
    return { valid: false, error: 'Date is required' };
  }
  
  if (!ValidationRegex.DATE.test(date)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date value' };
  }
  
  return { valid: true };
}

/**
 * Validates passport number
 * @param passportNumber - Passport number to validate
 * @returns true if valid, false otherwise
 */
export function validatePassportNumber(passportNumber: string): boolean {
  if (!passportNumber || typeof passportNumber !== 'string') return false;
  return ValidationRegex.PASSPORT.test(passportNumber.trim().toUpperCase());
}

/**
 * Validates price value
 * @param price - Price to validate
 * @returns true if valid, false otherwise
 */
export function validatePrice(price: number | string): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0 && isFinite(numPrice);
}

/**
 * Validates price with detailed error message
 * @param price - Price to validate
 * @returns { valid: boolean, error?: string }
 */
export function validatePriceWithMessage(price: number | string): { valid: boolean; error?: string } {
  if (price === undefined || price === null || price === '') {
    return { valid: false, error: 'Price is required' };
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Price must be a valid number' };
  }
  
  if (numPrice <= 0) {
    return { valid: false, error: 'Price must be greater than 0' };
  }
  
  if (!isFinite(numPrice)) {
    return { valid: false, error: 'Price must be a finite number' };
  }
  
  return { valid: true };
}

/**
 * Validates quantity value
 * @param quantity - Quantity to validate
 * @returns true if valid, false otherwise
 */
export function validateQuantity(quantity: number | string): boolean {
  const numQty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  return !isNaN(numQty) && numQty > 0 && Number.isInteger(numQty);
}

/**
 * Validates quantity with detailed error message
 * @param quantity - Quantity to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateQuantityWithMessage(quantity: number | string): { valid: boolean; error?: string } {
  if (quantity === undefined || quantity === null || quantity === '') {
    return { valid: false, error: 'Quantity is required' };
  }
  
  const numQty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  
  if (isNaN(numQty)) {
    return { valid: false, error: 'Quantity must be a valid number' };
  }
  
  if (!Number.isInteger(numQty)) {
    return { valid: false, error: 'Quantity must be a whole number' };
  }
  
  if (numQty <= 0) {
    return { valid: false, error: 'Quantity must be at least 1' };
  }
  
  return { valid: true };
}

/**
 * Validates that a string is not empty after trimming
 * @param value - String to validate
 * @param fieldName - Name of the field for error message
 * @returns { valid: boolean, error?: string }
 */
export function validateRequired(value: string | undefined | null, fieldName: string): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validates currency code (3-letter ISO code)
 * @param currency - Currency code to validate
 * @returns true if valid, false otherwise
 */
export function validateCurrency(currency: string): boolean {
  if (!currency || typeof currency !== 'string') return false;
  return ValidationRegex.CURRENCY.test(currency.trim().toUpperCase());
}

/**
 * Sanitizes user input by trimming whitespace
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input?.trim() || '';
}

/**
 * Sanitizes and validates seat number
 * @param seat - Seat number to sanitize and validate
 * @returns { valid: boolean, sanitized: string, error?: string }
 */
export function sanitizeAndValidateSeat(seat: string): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(seat).toUpperCase();
  const validation = validateSeatWithMessage(sanitized);
  return { ...validation, sanitized };
}

/**
 * Checks if passenger has missing information
 * @param passenger - Passenger object to check
 * @returns Object indicating which fields are missing
 */
export function checkMissingPassengerInfo(passenger: {
  passport?: { number?: string; expiryDate?: string; country?: string };
  address?: string;
  dateOfBirth?: string;
}): {
  hasAnyMissing: boolean;
  missingPassport: boolean;
  missingAddress: boolean;
  missingDOB: boolean;
} {
  const missingPassport = !passenger.passport?.number?.trim();
  const missingAddress = !passenger.address?.trim();
  const missingDOB = !passenger.dateOfBirth?.trim();
  
  return {
    hasAnyMissing: missingPassport || missingAddress || missingDOB,
    missingPassport,
    missingAddress,
    missingDOB,
  };
}
