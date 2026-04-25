"use client";
import React from "react";
import ModalCreateBill from "./modal-create-bill";
import { useBuilding } from "@/context/BuildingContext";
import { useAllBills } from "@/hooks/queries/use-bill";

const _metrics = [
  {
    title: "Tổng nợ",
    value: "$120.80",
  },
  // {
  //   title: "Sắp đến hạn",
  //   value: "0.00",
  // },
  // {
  //   title: "Trung bình thanh toán",
  //   value: "24 days",
  // },
  {
    title: "Tổng thu",
    value: "$3,450.50",
  },
];
export default function BillMetrics() {
  // const { building } = useBuilding();
  // const { data: bills } = useAllBills(building ? building.id : "");
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white/90">
            Overview
          </h2>
        </div>

        <ModalCreateBill />
      </div>
      <div className="flex w-full rounded-xl border border-gray-200 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
        {_metrics.map((metric, idx) => (
          <div
            key={idx}
            className="flex-1 border-b p-5 sm:border-r last:border-r-0 lg:border-b-0"
          >
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              {metric.title}
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">
              {metric.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
