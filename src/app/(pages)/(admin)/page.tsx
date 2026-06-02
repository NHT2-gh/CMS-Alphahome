import { MainContainer } from "@/components/_cms/common/page-layout";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | AlphaHome",
  description: "Dashboard quản lý AlphaHome",
};

export default function Dashboard() {
  return (
    <MainContainer title="Dashboard">
      <p>Welcome to your CMS dashboard</p>
    </MainContainer>
  );
}
