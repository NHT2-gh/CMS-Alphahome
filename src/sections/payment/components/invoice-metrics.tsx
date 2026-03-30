import React from "react";
import ModalCreateBill from "./modal-create-bill";

export default function InvoiceMetrics() {
  return (
    <>
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white/90">
              Overview
            </h2>
          </div>

          <ModalCreateBill />
        </div>
        <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
          <div className="border-b p-5 sm:border-r lg:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Overdue
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">
              $120.80
            </h3>
          </div>
          <div className="border-b p-5 lg:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Due within next 30 days
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">0.00</h3>
          </div>
          <div className="border-b p-5 sm:border-r sm:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Average time to get paid
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">
              24 days
            </h3>
          </div>
          <div className="p-5">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Upcoming Payout
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">
              $3,450.50
            </h3>
          </div>
        </div>
      </div>

      {/* {isOpen && <ModalCreateBill isOpen={isOpen} closeModal={closeModal} />} */}
    </>
  );
}
