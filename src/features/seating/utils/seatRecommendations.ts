import type { Passenger } from "../../../domain/passengers/types";

export type SeatRecommendationSeverity = "high" | "medium" | "low";
export type SeatRecommendationCategory = "family" | "group" | "assistance" | "premium";

export interface SeatRecommendation {
  id: string;
  category: SeatRecommendationCategory;
  severity: SeatRecommendationSeverity;
  title: string;
  description: string;
  actionLabel: string;
  passengerIds: string[];
  currentSeats: string[];
  suggestedSeats: string[];
}

const seatLetters = ["A", "B", "C", "D", "E", "F"];
const aisleSeats = new Set(["C", "D"]);
const premiumRows = [1, 2, 3];

const getSeatRow = (seat: string) => Number.parseInt(seat.match(/^\d+/)?.[0] ?? "0", 10);
const getSeatLetter = (seat: string) => seat.match(/[A-Z]$/)?.[0] ?? "";
const getSeatSortValue = (seat: string) => getSeatRow(seat) * 10 + seatLetters.indexOf(getSeatLetter(seat));

const getOccupiedSeats = (passengers: Passenger[], excludedPassengerIds: string[] = []) => {
  const excludedIds = new Set(excludedPassengerIds);
  return new Set(
    passengers
      .filter((passenger) => passenger.seat && !excludedIds.has(passenger.id))
      .map((passenger) => passenger.seat)
  );
};

const getAvailableSeatsForRow = (row: number, occupiedSeats: Set<string>) => {
  return seatLetters.map((letter) => `${row}${letter}`).filter((seat) => !occupiedSeats.has(seat));
};

const findContiguousRowSeats = (seatsNeeded: number, occupiedSeats: Set<string>) => {
  for (let row = 1; row <= 10; row++) {
    for (let startIndex = 0; startIndex <= seatLetters.length - seatsNeeded; startIndex++) {
      const seats = seatLetters.slice(startIndex, startIndex + seatsNeeded).map((letter) => `${row}${letter}`);
      if (seats.every((seat) => !occupiedSeats.has(seat))) {
        return seats;
      }
    }
  }

  return null;
};

const findNearbySeats = (seatsNeeded: number, occupiedSeats: Set<string>) => {
  const contiguousSeats = findContiguousRowSeats(seatsNeeded, occupiedSeats);
  if (contiguousSeats) return contiguousSeats;

  for (let startRow = 1; startRow <= 9; startRow++) {
    const seats = [
      ...getAvailableSeatsForRow(startRow, occupiedSeats),
      ...getAvailableSeatsForRow(startRow + 1, occupiedSeats),
    ].slice(0, seatsNeeded);

    if (seats.length === seatsNeeded) {
      return seats;
    }
  }

  return [];
};

const findPreferredSeat = (passengers: Passenger[], predicate: (seat: string) => boolean) => {
  const occupiedSeats = getOccupiedSeats(passengers);

  return Array.from({ length: 10 }, (_, rowIndex) => rowIndex + 1)
    .flatMap((row) => seatLetters.map((letter) => `${row}${letter}`))
    .filter((seat) => !occupiedSeats.has(seat))
    .filter(predicate)
    .sort((a, b) => getSeatSortValue(a) - getSeatSortValue(b))[0];
};

const getRows = (passengers: Passenger[]) => {
  return Array.from(new Set(passengers.map((passenger) => getSeatRow(passenger.seat)).filter((row) => row > 0))).sort((a, b) => a - b);
};

const getRowSpan = (rows: number[]) => {
  if (rows.length === 0) return 0;
  return Math.max(...rows) - Math.min(...rows) + 1;
};

const groupPassengersBy = <T extends string>(passengers: Passenger[], getKey: (passenger: Passenger) => T | undefined) => {
  return passengers.reduce<Record<string, Passenger[]>>((groups, passenger) => {
    const key = getKey(passenger);
    if (!key) return groups;

    groups[key] = groups[key] ? [...groups[key], passenger] : [passenger];
    return groups;
  }, {});
};

export const getSeatRecommendations = (passengers: Passenger[]): SeatRecommendation[] => {
  const recommendations: SeatRecommendation[] = [];
  const familyGroups = groupPassengersBy(passengers, (passenger) => passenger.familySeating?.familyId);
  const groupSeatingGroups = groupPassengersBy(passengers, (passenger) => passenger.groupSeating?.groupId);

  Object.entries(familyGroups).forEach(([familyId, familyPassengers]) => {
    if (familyPassengers.length < 2) return;

    const rows = getRows(familyPassengers);
    const rowSpan = getRowSpan(rows);
    const nonInfantPassengers = familyPassengers.filter((passenger) => !passenger.infant);
    const infants = familyPassengers.filter((passenger) => passenger.infant);
    const infantWithoutAdultSameRow = infants.some((infant) => {
      const infantRow = getSeatRow(infant.seat);
      return !nonInfantPassengers.some((passenger) => getSeatRow(passenger.seat) === infantRow);
    });

    if (rowSpan > 1 || infantWithoutAdultSameRow) {
      const passengerIds = familyPassengers.map((passenger) => passenger.id);
      const suggestedSeats = findNearbySeats(Math.max(nonInfantPassengers.length, 1), getOccupiedSeats(passengers, passengerIds));

      recommendations.push({
        id: `family-${familyId}`,
        category: "family",
        severity: infantWithoutAdultSameRow ? "high" : rowSpan > 2 ? "high" : "medium",
        title: infantWithoutAdultSameRow ? "Infant separated from adult" : "Family split across rows",
        description: infantWithoutAdultSameRow
          ? "An infant passenger is not seated in the same row as an adult from the family booking."
          : `Family members are currently spread across ${rows.length} rows.`,
        actionLabel: "Review family seating",
        passengerIds,
        currentSeats: familyPassengers.map((passenger) => passenger.seat).filter(Boolean),
        suggestedSeats,
      });
    }
  });

  Object.entries(groupSeatingGroups).forEach(([groupId, groupPassengers]) => {
    if (groupPassengers.length < 2) return;

    const rows = getRows(groupPassengers);
    const rowSpan = getRowSpan(rows);
    const keepTogether = groupPassengers.some((passenger) => passenger.groupSeating?.keepTogether);

    if ((keepTogether && rowSpan > 2) || rowSpan > 3) {
      const passengerIds = groupPassengers.map((passenger) => passenger.id);
      const suggestedSeats = findNearbySeats(groupPassengers.length, getOccupiedSeats(passengers, passengerIds));

      recommendations.push({
        id: `group-${groupId}`,
        category: "group",
        severity: rowSpan > 3 ? "high" : "medium",
        title: "Group seating spread out",
        description: `Group is seated across ${rows.length} rows; keep-together preference is not well satisfied.`,
        actionLabel: "Review group seating",
        passengerIds,
        currentSeats: groupPassengers.map((passenger) => passenger.seat).filter(Boolean),
        suggestedSeats,
      });
    }
  });

  passengers.forEach((passenger) => {
    const seatLetter = getSeatLetter(passenger.seat);
    if (passenger.wheelchair && !aisleSeats.has(seatLetter)) {
      const suggestedSeat = findPreferredSeat(passengers, (seat) => aisleSeats.has(getSeatLetter(seat)) && getSeatRow(seat) <= 5);

      recommendations.push({
        id: `assistance-${passenger.id}`,
        category: "assistance",
        severity: "medium",
        title: "Wheelchair passenger away from aisle",
        description: `${passenger.name} is assigned to ${passenger.seat}; aisle seating is easier for boarding support.`,
        actionLabel: "Move to aisle seat",
        passengerIds: [passenger.id],
        currentSeats: [passenger.seat],
        suggestedSeats: suggestedSeat ? [suggestedSeat] : [],
      });
    }

    const wantsPremium = passenger.premiumUpgrade || passenger.seatPreferences?.type === "premium";
    if (wantsPremium && !premiumRows.includes(getSeatRow(passenger.seat))) {
      const suggestedSeat = findPreferredSeat(passengers, (seat) => premiumRows.includes(getSeatRow(seat)));

      recommendations.push({
        id: `premium-${passenger.id}`,
        category: "premium",
        severity: "low",
        title: "Premium passenger outside premium cabin",
        description: `${passenger.name} has a premium preference but is assigned to ${passenger.seat}.`,
        actionLabel: "Offer premium seat",
        passengerIds: [passenger.id],
        currentSeats: [passenger.seat],
        suggestedSeats: suggestedSeat ? [suggestedSeat] : [],
      });
    }
  });

  const severityRank: Record<SeatRecommendationSeverity, number> = { high: 0, medium: 1, low: 2 };

  return recommendations.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
};
