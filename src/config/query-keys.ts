import { FilterValue } from "@/components/_cms/components/filter/box/type";
import { BuildingFilter } from "@/services/building.service";
import { Pagination } from "@/types/common";

export const queryKeys = {
  buildings: {
    list: (params: BuildingFilter) => ["buildings", params],
    detail: (id: string) => ["buildings", id],
    services: (id: string) => ["buildings", id, "services"],
    buildingRevenueCombined: (id: string) => [
      "buildings",
      id,
      "building-revenue-combined",
    ],
  },
  rooms: {
    list: (buildingId: string) => ["rooms", buildingId],
    create: () => ["rooms", "create"],
    update: () => ["rooms", "update"],
  },

  utilityReading: {
    overview: (buildingId: string) => ["utility-reading-overview", buildingId],
    detail: (buildingId: string, date: string) => [
      "utility-reading",
      buildingId,
      date,
    ],
  },
  contract: {
    byRoomId: (roomId: string) => ["contract", "room", roomId],
  },
  bills: {
    allByBuildingId: (
      buildingId: string,
      pagination?: Pagination,
      filter?: Record<string, FilterValue>,
    ) => [
      "bills",
      "building",
      buildingId,
      pagination?.page,
      pagination?.limit,
      filter,
    ],
    byTrackingCode: (trackingCode: string) => [
      "bills",
      "tracking-code",
      trackingCode,
    ],
    servicesDetail: (billId: string) => ["bills", "services-detail", billId],
    createSignleBill: () => ["create-one-bill"],
    createMultipleBills: () => ["create-multiple-bills"],
    updateStatusBill: () => ["update-status-bill"],
  },

  transactions: {
    allByBuildingId: (buildingId: string) => ["transactions", buildingId],
    create: () => ["create-transaction"],
  },
  categories: {
    all: () => ["categories"],
  },
};
