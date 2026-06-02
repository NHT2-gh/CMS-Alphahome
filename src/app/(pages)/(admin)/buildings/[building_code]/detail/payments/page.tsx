import { PaymentPageView } from "@/sections/payment/view";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý thanh toán | AlphaHome",
  description: "Quản lý thanh toán AlphaHome",
};

export default function PaymentPage() {
  return <PaymentPageView />;
}
