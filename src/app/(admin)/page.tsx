import { MainContainer } from "@/components/_cms/common";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "AlphaHome CMS Dashboard",
};

export default function Dashboard() {
  return (
    <MainContainer title="Dashboard">
      <p>Welcome to your CMS dashboard</p>
    </MainContainer>
  );
}
