import React from "react";
import { InvoiceMetrics } from "./components";
import PaymentsListTable from "./components/payments-table";

export default function PaymentManagement() {
  return (
    <section>
      <InvoiceMetrics />
      <PaymentsListTable />
    </section>
  );
}
