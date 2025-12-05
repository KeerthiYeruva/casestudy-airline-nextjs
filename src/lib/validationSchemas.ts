// Validation schemas using Zod for type-safe API validation
import { z } from 'zod';

/**
 * Validation schema for Passport information
 */
export const PassportSchema = z.object({
  number: z.string().min(6, 'Passport number must be at least 6 characters').max(20, 'Passport number too long'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)'),
  country: z.string().min(2, 'Country code must be at least 2 characters').max(50, 'Country name too long'),
}).optional().or(z.object({
  number: z.literal(''),
  expiryDate: z.literal(''),
  country: z.literal(''),
}));

/**
 * Validation schema for Shop Request items
 */
export const ShopRequestSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  itemName: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)'),
});

/**
 * Validation schema for creating a new Passenger
 */
export const CreatePassengerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u0080-\uFFFF.'-]+$/, 'Name contains invalid characters'),
  
  seat: z.string()
    .regex(/^[0-9]+[A-F]$/, 'Invalid seat format (e.g., 1A, 2B)'),
  
  flightId: z.string().min(1, 'Flight ID is required'),
  
  bookingReference: z.string()
    .min(6, 'Booking reference must be at least 6 characters')
    .max(10, 'Booking reference must not exceed 10 characters')
    .regex(/^[A-Z]{3}[0-9]{3,7}$/, 'Invalid booking reference format (e.g., ABC123)'),
  
  passport: PassportSchema,
  
  address: z.string().max(200, 'Address too long').optional().or(z.literal('')),
  
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  
  ancillaryServices: z.array(z.string()).default([]),
  
  specialMeal: z.string().default('Regular'),
  
  wheelchair: z.boolean().default(false),
  
  infant: z.boolean().default(false),
  
  checkedIn: z.boolean().default(false),
  
  shopRequests: z.array(ShopRequestSchema).default([]),
  
  seatPreferences: z.object({
    position: z.array(z.enum(['window', 'aisle', 'middle', 'front', 'back', 'exitRow'])).optional(),
    type: z.enum(['standard', 'premium', 'exit', 'bulkhead']).optional(),
    nearFamily: z.boolean().optional(),
  }).optional(),
  
  groupSeating: z.object({
    groupId: z.string(),
    size: z.number().int().positive(),
    keepTogether: z.boolean(),
    leadPassengerId: z.string(),
  }).optional(),
  
  familySeating: z.object({
    familyId: z.string(),
    adults: z.number().int().positive(),
    children: z.number().int().nonnegative(),
    infants: z.number().int().nonnegative(),
    autoAllocate: z.boolean(),
  }).optional(),
  
  premiumUpgrade: z.boolean().optional(),
});

/**
 * Validation schema for updating a Passenger
 * All fields are optional for partial updates
 */
export const UpdatePassengerSchema = CreatePassengerSchema.partial();

/**
 * Validation schema for creating a new Flight
 */
export const CreateFlightSchema = z.object({
  name: z.string().min(1, 'Flight name is required'),
  
  flightNumber: z.string()
    .regex(/^[A-Z]{2}[0-9]{1,4}$/, 'Invalid flight number format (e.g., AA101)'),
  
  origin: z.string().min(3, 'Origin is required'),
  
  destination: z.string().min(3, 'Destination is required'),
  
  from: z.string().min(3, 'From location is required'),
  
  to: z.string().min(3, 'To location is required'),
  
  departureTime: z.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (use HH:MM AM/PM)'),
  
  arrivalTime: z.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (use HH:MM AM/PM)'),
  
  time: z.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format (use HH:MM AM/PM)'),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)'),
  
  status: z.enum(['On Time', 'Delayed', 'Boarding', 'Departed', 'Cancelled']),
  
  aircraft: z.string().min(1, 'Aircraft type is required'),
  
  gate: z.string().min(1, 'Gate number is required'),
  
  terminal: z.string().min(1, 'Terminal is required'),
  
  totalSeats: z.number().int().positive('Total seats must be positive'),
  
  availableSeats: z.number().int().nonnegative('Available seats cannot be negative'),
});

/**
 * Validation schema for updating a Flight
 */
export const UpdateFlightSchema = CreateFlightSchema.partial();

/**
 * Validation schema for Shop Items
 */
export const CreateShopItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name too long'),
  
  category: z.string().min(1, 'Category is required'),
  
  price: z.number().positive('Price must be positive'),
  
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)'),
  
  description: z.string().optional(),
});

/**
 * Validation schema for updating Shop Items
 */
export const UpdateShopItemSchema = CreateShopItemSchema.partial();

/**
 * Validation schema for seat change requests
 */
export const SeatChangeSchema = z.object({
  seat: z.string()
    .min(1, 'Seat number is required')
    .regex(/^[0-9]+[A-F]$/, 'Invalid seat format (e.g., 1A, 2B)'),
});

/**
 * Helper function to validate data against a schema
 * Returns parsed data or throws a validation error
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Helper function to safely validate data
 * Returns { success: true, data } or { success: false, error }
 */
export function safeValidateSchema<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}
