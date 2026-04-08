import { BuildingFilter } from "@/services/building.service";

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
    allByBuildingId: (buildingId: string, page?: number, limit?: number) => [
      "bills",
      "building",
      buildingId,
      page,
      limit,
    ],
    byTrackingCode: (trackingCode: string) => [
      "bills",
      "tracking-code",
      trackingCode,
    ],
    servicesDetail: (billId: string) => ["bills", "services-detail", billId],
    createSignleBill: () => ["create-one-bill"],
    createMultipleBills: () => ["create-multiple-bills"],
  },

  transactions: {
    allByBuildingId: (buildingId: string) => ["transactions", buildingId],
    create: () => ["create-transaction"],
  },
  categories: {
    all: () => ["categories"],
  },
};
