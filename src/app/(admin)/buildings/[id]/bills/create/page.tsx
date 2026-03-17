import { CreateBillPageView } from "@/sections/payments";
import React from "react";

export default async function CreateBillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CreateBillPageView buildingId={id} />;
}
