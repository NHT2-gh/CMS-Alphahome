"use client";
import React, { useEffect, useState } from "react";

import { Blocks, ChartBar, CreditCard, NotepadText } from "lucide-react";
import {
  AnalyticsBuilding,
  PaymentManagement,
  RoomsTable,
  UtilityReadingView,
} from "..";
import { useBuilding } from "@/context/BuildingContext";
import { Building } from "@/types/building";
import { stringParser, useQueryState } from "@/hooks/use-state-url";

export interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  params: string;
}

interface TabButtonProps extends TabData {
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`inline-flex items-center gap-2 border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400"
          : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

interface TabContentProps {
  content: React.ReactNode;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ content, isActive }) => {
  if (!isActive) return null;

  return <div>{content}</div>;
};

export default function MainContentBuildingDetail({
  building,
}: {
  building: Building;
}) {
  const [activeTab, setActiveTab] = useState<TabData["id"]>("overview");
  const { setBuilding } = useBuilding();
  const [tab, setTab] = useQueryState("tab", stringParser, "overview");

  useEffect(() => {
    if (building) {
      setBuilding(building);
    }
  }, [building, setBuilding]);

  const tabData: TabData[] = [
    {
      id: "overview",
      label: "Thống kê",
      icon: <ChartBar />,
      content: <AnalyticsBuilding />,
      params: "overview",
    },
    {
      id: "rooms",
      label: "Danh sách phòng",
      icon: <Blocks />,
      content: <RoomsTable />,
      params: "rooms",
    },
    {
      id: "utility-reading",
      label: "Bản ghi số",
      icon: <NotepadText />,
      content: <UtilityReadingView />,
      params: "utility-reading",
    },
    {
      id: "bills",
      label: "Thanh toán",
      icon: <CreditCard />,
      content: <PaymentManagement />,
      params: "bills",
    },
  ];

  return (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {tabData.map((tab) => (
            <TabButton
              key={tab.id}
              {...tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4">
        {tabData.map((tab) => (
          <TabContent
            key={tab.id}
            content={tab.content}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>
    </div>
  );
}
