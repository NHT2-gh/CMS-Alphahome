"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Unit, UnitClass } from "@/_mocks/category-specs/units";

interface UnitManagementModalProps {
  unitClasses: UnitClass[];
  units: Unit[];
  onClose: () => void;
}

export function UnitManagementModal({ unitClasses: initialUnitClasses, units: initialUnits, onClose }: UnitManagementModalProps) {
  const [unitClasses, setUnitClasses] = useState<UnitClass[]>(initialUnitClasses);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [selectedUnitClassId, setSelectedUnitClassId] = useState<number | null>(null);

  // Get active unit classes
  const activeUnitClasses = unitClasses.filter(uc => uc.status !== 'inactive');

  // Get units for selected unit class
  const filteredUnits = selectedUnitClassId
    ? units.filter(u => u.unit_class_id === selectedUnitClassId)
    : [];

  // Count units in each unit class
  const getUnitsCount = (unitClassId: number) => {
    return units.filter(u => u.unit_class_id === unitClassId).length;
  };

  // Add new unit class
  const handleAddUnitClass = () => {
    const name = prompt('Tên nhóm đơn vị (VD: Trọng lượng, Độ dài):');
    if (!name) return;

    const newUnitClass: UnitClass = {
      id: Date.now(),
      name: name,
      order: unitClasses.length,
      status: 'active'
    };

    setUnitClasses([...unitClasses, newUnitClass]);
    alert('Nhóm đơn vị mới đã được tạo thành công!');
  };

  // Update unit class name
  const handleUpdateUnitClassName = (id: number, newName: string) => {
    setUnitClasses(unitClasses.map(uc =>
      uc.id === id ? { ...uc, name: newName } : uc
    ));
  };

  // Delete unit class
  const handleDeleteUnitClass = (id: number) => {
    const unitsInClass = units.filter(u => u.unit_class_id === id);
    if (unitsInClass.length > 0) {
      alert(`Không thể xóa nhóm đơn vị này vì có ${unitsInClass.length} đơn vị đang sử dụng!`);
      return;
    }

    if (!confirm('Xóa nhóm đơn vị này?')) return;

    setUnitClasses(unitClasses.map(uc =>
      uc.id === id ? { ...uc, status: 'inactive' as const } : uc
    ));

    if (selectedUnitClassId === id) {
      setSelectedUnitClassId(null);
    }
  };

  // Add new unit
  const handleAddUnit = () => {
    if (!selectedUnitClassId) {
      alert('Vui lòng chọn nhóm đơn vị trước!');
      return;
    }

    const name = prompt('Tên đầy đủ (VD: kilogram):');
    if (!name) return;

    const displayName = prompt('Tên hiển thị (VD: kg):');
    if (!displayName) return;

    const unitsInClass = units.filter(u => u.unit_class_id === selectedUnitClassId);
    const newUnit: Unit = {
      id: Date.now(),
      unit_class_id: selectedUnitClassId,
      name: name,
      display_name: displayName,
      order: unitsInClass.length
    };

    setUnits([...units, newUnit]);
    alert('Đơn vị mới đã được tạo thành công!');
  };

  // Update unit
  const handleUpdateUnit = (id: number, field: 'name' | 'display_name', value: string) => {
    setUnits(units.map(u =>
      u.id === id ? { ...u, [field]: value } : u
    ));
  };

  // Delete unit
  const handleDeleteUnit = (id: number) => {
    if (!confirm('Xóa đơn vị này?')) return;
    setUnits(units.filter(u => u.id !== id));
  };

  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">📏 Quản lý Đơn vị & Nhóm đơn vị</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Unit Classes */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">📦 Nhóm đơn vị (Unit Classes)</h4>
            <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700" onClick={handleAddUnitClass}>
              ➕ Thêm
            </Button>
          </div>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {activeUnitClasses.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-400">Chưa có nhóm đơn vị nào</div>
            ) : (
              activeUnitClasses.map((uc) => {
                const isSelected = selectedUnitClassId === uc.id;
                const unitsCount = getUnitsCount(uc.id);

                return (
                  <div
                    key={uc.id}
                    onClick={() => setSelectedUnitClassId(uc.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-100 shadow-md dark:border-purple-600 dark:bg-purple-900/30'
                        : 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950'
                    }`}
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={uc.name}
                        onChange={(e) => handleUpdateUnitClassName(uc.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{unitsCount} đơn vị</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUnitClass(uc.id);
                      }}
                      className="flex-shrink-0 text-lg font-bold text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Units */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">📐 Đơn vị (Units)</h4>
            <Button
              size="sm"
              className="bg-teal-600 text-white hover:bg-teal-700"
              onClick={handleAddUnit}
              disabled={!selectedUnitClassId}
            >
              ➕ Thêm
            </Button>
          </div>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {!selectedUnitClassId ? (
              <div className="py-4 text-center text-sm text-gray-400">← Chọn nhóm đơn vị để xem danh sách</div>
            ) : filteredUnits.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-400">Chưa có đơn vị nào trong nhóm này</div>
            ) : (
              filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-950"
                >
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={unit.name}
                      onChange={(e) => handleUpdateUnit(unit.id, 'name', e.target.value)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Tên đầy đủ"
                    />
                    <input
                      type="text"
                      value={unit.display_name}
                      onChange={(e) => handleUpdateUnit(unit.id, 'display_name', e.target.value)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Hiển thị"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="flex-shrink-0 text-lg font-bold text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4 border-t pt-6">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Đóng
        </Button>
      </div>
    </div>
  );
}
