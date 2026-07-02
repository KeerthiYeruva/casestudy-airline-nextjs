export type SeatPreference = 'window' | 'aisle' | 'middle' | 'front' | 'back' | 'exitRow';
export type SeatType = 'standard' | 'premium' | 'exit' | 'bulkhead';

export interface SeatPreferences {
  position?: SeatPreference[];
  type?: SeatType;
  nearFamily?: boolean;
}

export interface GroupSeating {
  groupId: string;
  groupName?: string;
  size: number;
  keepTogether: boolean;
  leadPassengerId: string;
  priority?: 'HIGH' | 'NORMAL';
  assignedRows?: number[];
}

export interface FamilySeating {
  familyId: string;
  adults: number;
  children: number;
  infants: number;
  autoAllocate: boolean;
}

export interface PremiumSeatUpsell {
  seatNumber: string;
  basePrice: number;
  upgradePrice: number;
  currency: string;
  features: string[];
  available: boolean;
}

export interface SeatMap {
  seatNumber: string;
  type: SeatType;
  available: boolean;
  premium: boolean;
  price?: number;
}
