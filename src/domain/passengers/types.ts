import type { FamilySeating, GroupSeating, SeatPreferences } from '../seats/types';
import type { ShopRequest } from '../services/types';

export interface Passport {
  number: string;
  expiryDate: string;
  country: string;
}

export interface Passenger {
  id: string;
  name: string;
  seat: string;
  flightId: string;
  passport?: Passport;
  address?: string;
  dateOfBirth?: string;
  ancillaryServices: string[];
  specialMeal: string;
  wheelchair: boolean;
  infant: boolean;
  checkedIn: boolean;
  bookingReference: string;
  shopRequests: ShopRequest[];
  seatPreferences?: SeatPreferences;
  groupSeating?: GroupSeating;
  familySeating?: FamilySeating;
  premiumUpgrade?: boolean;
}
