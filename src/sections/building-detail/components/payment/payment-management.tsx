import { PaymentsListTable } from "@/sections/payments";
import React from "react";
import { InvoiceMetrics } from "./components";

export default function PaymentManagement() {
  return (
    <section>
      <InvoiceMetrics />
      <PaymentsListTable />
    </section>
  );
}
