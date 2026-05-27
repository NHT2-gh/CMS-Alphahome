import { UtilityReadingPageView } from "@/sections/utility-reading/view";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Định mức sử dụng | AlphaHome",
  description: "Định mức sử dụng AlphaHome",
};

export default function UtilityReadingsPageView() {
  return <UtilityReadingPageView />;
}
