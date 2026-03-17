"use client";

import React from "react";
import { useDrag } from "react-dnd";
import { ITEM_TYPES, type AvailableSpecItemProps } from "./types";

export function AvailableSpecItem({ spec, unitDisplayName, usedInGroups, onEdit }: AvailableSpecItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.AVAILABLE_SPEC,
    item: { spec, type: ITEM_TYPES.AVAILABLE_SPEC },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const isUsed = usedInGroups.length > 0;

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`cursor-move rounded-lg border-2 p-3 transition-all ${
        isUsed
          ? 'border-green-200 bg-green-50 hover:border-green-400 dark:border-green-900 dark:bg-green-950'
          : 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800 dark:text-white">{spec.name}</div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {spec.data_type}
            {unitDisplayName && ` • ${unitDisplayName}`}
          </div>
          {isUsed && (
            <div className="mt-2 space-y-1 text-xs">
              <div className="font-medium text-gray-600 dark:text-gray-400">Đang dùng trong:</div>
              <div className="flex flex-wrap gap-1">
                {usedInGroups.map((groupName, idx) => (
                  <div
                    key={idx}
                    className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    📁 {groupName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400" title="Chỉnh sửa">
            ✏️
          </button>
        </div>
      </div>
    </div>
  );
}
