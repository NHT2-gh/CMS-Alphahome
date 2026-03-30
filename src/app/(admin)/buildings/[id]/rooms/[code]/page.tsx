import RoomDetailPageView from "@/sections/room-detail/view/room-detail-page-view";
import React from "react";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string; code: string }>;
}) {
  const { id, code } = await params;
  return (
    <RoomDetailPageView
      currentRoom={{
        code: code,
        ...{
          room_id: id,
          occupants_count: 0,
          deposit_amount: 0,
          current_rent: 0,
          status: "available",
          area: 0,
          furniture_status: "unfurnished",
          tenant_name: "",
          start_date: "",
          end_date: "",
          updated_at: "",
        },
      }}
    />
  );
}
