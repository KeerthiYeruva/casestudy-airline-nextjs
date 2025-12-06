"use client";

import React from "react";
import PassengerManagement from "../PassengerManagement";
import { Flight, Passenger } from "@/types";

interface FilterOptions {
  missingPassport: boolean;
  missingAddress: boolean;
  missingDOB: boolean;
}

interface PassengerTabProps {
  passengers: Passenger[];
  flights: Flight[];
  selectedFlightId: string;
  onFlightSelect: (flightId: string) => void;
  filterOptions: FilterOptions;
  onFilterChange: (filter: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  onResetData: () => Promise<void>;
  dataStoreError: string | null;
  onAddPassenger: (passenger: Omit<Passenger, "id">) => Promise<boolean>;
  onUpdatePassenger: (id: string, passenger: Partial<Passenger>) => Promise<boolean>;
  onDeletePassenger: (id: string) => Promise<boolean>;
}

const PassengerTab: React.FC<PassengerTabProps> = ({
  passengers,
  flights,
  selectedFlightId,
  onFlightSelect,
  filterOptions,
  onFilterChange,
  onClearFilters,
  onResetData,
  dataStoreError,
  onAddPassenger,
  onUpdatePassenger,
  onDeletePassenger,
}) => {
  return (
    <PassengerManagement
      passengers={passengers}
      flights={flights}
      selectedFlightId={selectedFlightId}
      onFlightSelect={onFlightSelect}
      filterOptions={filterOptions}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onResetData={onResetData}
      dataStoreError={dataStoreError}
      onAddPassenger={onAddPassenger}
      onUpdatePassenger={onUpdatePassenger}
      onDeletePassenger={onDeletePassenger}
    />
  );
};

export default PassengerTab;
