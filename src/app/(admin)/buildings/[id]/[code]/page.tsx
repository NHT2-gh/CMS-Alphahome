import React from "react";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string; code: string }>;
}) {
  const { id, code } = await params;
  return <div>RoomDetailPage</div>;
}
