"use client";
import React, { useEffect, useState } from "react";

import { Blocks, ChartBar, CreditCard, NotepadText } from "lucide-react";
import { APP_ROUTES } from "@/config/app-routes";
import { useBuilding } from "@/context/BuildingContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
export interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  appRoute: string;
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

export default function MainLayoutBuildingDetail({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { building } = useBuilding();
  const [activeTab, setActiveTab] = useState<TabData["id"]>("overview");

  useEffect(() => {
    if (!building) {
      router.push(APP_ROUTES.ADMIN.BUILDINGS.BASE);
      return;
    }
  }, [building]);
  const tabData: TabData[] = [
    {
      id: "overview",
      label: "Thống kê",
      icon: <ChartBar />,
      appRoute: APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(building?.id || ""),
    },
    {
      id: "rooms",
      label: "Danh sách phòng",
      icon: <Blocks />,
      appRoute: APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS(building?.id || ""),
    },
    {
      id: "utility-reading",
      label: "Bản ghi số",
      icon: <NotepadText />,
      appRoute: APP_ROUTES.ADMIN.BUILDINGS.ID.UTILITY_READINGS(
        building?.id || "",
      ),
    },
    {
      id: "bills",
      label: "Thanh toán",
      icon: <CreditCard />,
      appRoute: APP_ROUTES.ADMIN.BUILDINGS.ID.PAYMENT(building?.id || ""),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {tabData.map((tab) => (
            <Link href={tab.appRoute}>
              <TabButton
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            </Link>
          ))}
        </nav>
      </div>

      <div className="">{children}</div>
    </section>
  );
}
