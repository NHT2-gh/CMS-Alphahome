"use client";

import React, { useState, useEffect } from "react";
import { PopularValue, popularValues as initialPopularValues } from "@/_mocks/category-specs/popular-values";
import { Unit } from "@/_mocks/category-specs/units";
import Button from "@/components/ui/button/Button";

interface PopularValuesManagerProps {
  specId: number;
  unit: Unit | null;
}

export function PopularValuesManager({ specId, unit }: PopularValuesManagerProps) {
  const [values, setValues] = useState<PopularValue[]>([]);

  useEffect(() => {
    // Load popular values for this spec
    const specValues = initialPopularValues
      .filter(pv => pv.product_spec_id === specId && pv.status === 'active')
      .sort((a, b) => a.order - b.order);
    setValues(specValues);
  }, [specId]);

  const handleAddValue = () => {
    const name = prompt(`Tên hiển thị${unit ? ` (VD: 8 ${unit.display_name})` : ''}:`);
    if (!name) return;

    const value = prompt(`Giá trị${unit ? ' (không bao gồm đơn vị)' : ''}:`);
    if (!value) return;

    const newValue: PopularValue = {
      id: Date.now(),
      product_spec_id: specId,
      name,
      value,
      order: values.length,
      status: 'active'
    };

    setValues([...values, newValue]);
  };

  const handleUpdateValue = (id: number, field: 'name' | 'value', newValue: string) => {
    setValues(values.map(pv =>
      pv.id === id ? { ...pv, [field]: newValue } : pv
    ));
  };

  const handleDeleteValue = (id: number) => {
    const pv = values.find(v => v.id === id);
    if (!confirm(`Xóa giá trị phổ biến "${pv?.name}"?`)) return;

    setValues(values.filter(v => v.id !== id));
  };

  if (values.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-4 text-sm text-gray-400 dark:text-gray-500">
          Chưa có giá trị phổ biến nào
        </div>
        <Button
          type="button"
          onClick={handleAddValue}
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          ➕ Thêm giá trị phổ biến
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {values.map((pv) => (
          <div key={pv.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <span className="text-gray-400 cursor-move">☰</span>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pv.name}
                onChange={(e) => handleUpdateValue(pv.id, 'name', e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder={`Tên hiển thị${unit ? ` (VD: 8 ${unit.display_name})` : ''}`}
              />
              <input
                type="text"
                value={pv.value}
                onChange={(e) => handleUpdateValue(pv.id, 'value', e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder={`Giá trị${unit ? ' (không có đơn vị)' : ''}`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleDeleteValue(pv.id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={handleAddValue}
        size="sm"
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        ➕ Thêm giá trị phổ biến
      </Button>
    </div>
  );
}
