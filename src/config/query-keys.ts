import { BuildingFilter } from "@/services/building.service";

export const queryKeys = {
  buildings: {
    list: (params: BuildingFilter) => ["buildings", params],
    detail: (id: string) => ["buildings", id],
  },
  rooms: {
    list: (buildingId: string) => ["rooms", buildingId],
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
    allByBuildingId: (buildingId: string) => ["bills", "building", buildingId],
    byTrackingCode: (trackingCode: string) => [
      "bills",
      "tracking-code",
      trackingCode,
    ],
    servicesDetail: (billId: string) => ["bills", "services-detail", billId],
  },
};
