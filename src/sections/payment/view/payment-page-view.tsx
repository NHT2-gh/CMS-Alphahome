import React from "react";
import { BillMetrics, PaymentsListTable } from "../components";

export default function PaymentPageView() {
  return (
    <section>
      <BillMetrics />
      <PaymentsListTable />
    </section>
  );
}
