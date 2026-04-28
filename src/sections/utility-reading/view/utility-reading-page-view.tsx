"use client";
import React, { useEffect, useState } from "react";
import FolderCard from "../components/FolderCard";
import { useBuilding } from "@/context/BuildingContext";
import ModalCreatReading from "../components/modal-creat-reading";
import { useUtilityReadingOverview } from "@/hooks/queries/use-utility-reading";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import EditViewReading from "../components/edit-view-utility-reading";

export default function UtilityReadingPageView() {
  const { building } = useBuilding();
  const { isOpen, closeModal, openModal } = useModal();
  const { data: utilityReading } = useUtilityReadingOverview(building?.id);
  const [dateSelected, setDateSelected] = useState<
    [string, string] | undefined
  >(undefined);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách bản ghi theo từng tháng
        </h2>
        <ModalCreatReading />
      </div>

      {utilityReading && utilityReading.size > 0 ? (
        Array.from(utilityReading.entries()).map(([year, yearData]) => (
          <div
            key={year}
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 mb-6"
          >
            <div className="px-4 py-4 sm:pl-6 sm:pr-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Năm {year}
                </h3>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500"
                >
                  View All
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                      fill=""
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-6">
                {yearData.data.map((monthData) => {
                  const waterReading = monthData.utility_readings
                    .filter((item) => item.utility_type === "water")
                    .reduce(
                      (acc, reading) =>
                        acc +
                        (isNaN(Number(reading.total_consumption))
                          ? 0
                          : Number(reading.total_consumption)),
                      0,
                    );

                  const electricityReading = monthData.utility_readings
                    .filter((item) => item.utility_type === "electricity")
                    .reduce(
                      (acc, reading) =>
                        acc +
                        (isNaN(Number(reading.total_consumption))
                          ? 0
                          : Number(reading.total_consumption)),
                      0,
                    );

                  return (
                    <FolderCard
                      key={monthData.month}
                      id={`${year}-${monthData.month}-01`}
                      title={`Tháng ${monthData.month}`}
                      waterCount={waterReading}
                      electricityCount={electricityReading}
                      handleDelete={() => {}}
                      handleViewMore={(id) => {
                        setDateSelected([id, `${year}-${monthData.month}-28`]);
                        openModal();
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))
      ) : (
        <span>Không có dữ liệu</span>
      )}

      {dateSelected && (
        <Modal isOpen={isOpen} onClose={closeModal} className="py-4 md:py-8">
          <EditViewReading rangeDateSelected={dateSelected} />
        </Modal>
      )}
    </section>
  );
}
