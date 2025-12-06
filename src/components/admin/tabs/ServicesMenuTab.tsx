"use client";

import React from "react";
import ServicesMenuManagement from "../ServicesMenuManagement";
import { ShopItem } from "@/types";

interface ServicesMenuTabProps {
  ancillaryServices: string[];
  mealOptions: string[];
  shopItems: ShopItem[];
  onAddService: () => void;
  onEditService: (service: string) => void;
  onDeleteService: (service: string) => void;
  onAddMeal: () => void;
  onEditMeal: (meal: string) => void;
  onDeleteMeal: (meal: string) => void;
  onAddShopItem: () => void;
  onEditShopItem: (item: ShopItem) => void;
  onDeleteShopItem: (id: string) => void;
}

const ServicesMenuTab: React.FC<ServicesMenuTabProps> = ({
  ancillaryServices,
  mealOptions,
  shopItems,
  onAddService,
  onEditService,
  onDeleteService,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
  onAddShopItem,
  onEditShopItem,
  onDeleteShopItem,
}) => {
  return (
    <ServicesMenuManagement
      ancillaryServices={ancillaryServices}
      mealOptions={mealOptions}
      shopItems={shopItems}
      onAddService={onAddService}
      onEditService={onEditService}
      onDeleteService={onDeleteService}
      onAddMeal={onAddMeal}
      onEditMeal={onEditMeal}
      onDeleteMeal={onDeleteMeal}
      onAddShopItem={onAddShopItem}
      onEditShopItem={onEditShopItem}
      onDeleteShopItem={onDeleteShopItem}
    />
  );
};

export default ServicesMenuTab;
