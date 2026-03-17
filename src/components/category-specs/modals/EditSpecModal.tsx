"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { Spec } from "@/_mocks/category-specs/specs";
import { UnitClass, Unit } from "@/_mocks/category-specs/units";
import { PopularValuesManager } from "../PopularValuesManager";

interface EditSpecModalProps {
  specId: number | null;
  spec?: Spec;
  unitClasses: UnitClass[];
  units: Unit[];
  onClose: () => void;
  onSave?: (specData: Partial<Spec>) => void;
}

export function EditSpecModal({ specId, spec, unitClasses, units, onClose, onSave }: EditSpecModalProps) {
  const isEdit = !!specId;

  // Form state
  const [slug, setSlug] = useState(spec?.slug || '');
  const [displayName, setDisplayName] = useState(spec?.display_name || '');
  const [name, setName] = useState(spec?.name || '');
  const [enName, setEnName] = useState(spec?.en_name || '');
  const [description, setDescription] = useState(spec?.description || '');
  const [dataType, setDataType] = useState(spec?.data_type || 'text');
  const [status, setStatus] = useState(spec?.status || 'active');
  const [unitClassId, setUnitClassId] = useState<number | null>(spec?.unit_class_id || null);
  const [unitId, setUnitId] = useState<number | null>(spec?.unit_id || null);

  // Filter units based on selected unit class
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (unitClassId) {
      setFilteredUnits(units.filter(u => u.unit_class_id === unitClassId));
    } else {
      setFilteredUnits([]);
      setUnitId(null);
    }
  }, [unitClassId, units]);

  const dataTypes = ['text', 'multi-text', 'integer', 'float', 'char', 'boolean', 'date', 'datetime', 'color', 'ip', 'size2d', 'size3d', 'integer_range', 'float_range'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const specData: Partial<Spec> = {
      slug,
      display_name: displayName,
      name,
      en_name: enName,
      description,
      data_type: dataType as Spec['data_type'],
      status: status as 'active' | 'inactive',
      unit_class_id: unitClassId,
      unit_id: unitId
    };

    if (onSave) {
      onSave(specData);
    }

    onClose();
  };

  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
        {isEdit ? 'Chỉnh sửa Spec' : 'Tạo mới Spec'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="cpu-speed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="CPU"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên thông số <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tốc độ CPU"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên tiếng Anh</label>
          <Input
            type="text"
            value={enName}
            onChange={(e) => setEnName(e.target.value)}
            placeholder="CPU Speed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            placeholder="Mô tả chi tiết thông số"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kiểu dữ liệu <span className="text-red-500">*</span>
            </label>
            <Select
              options={dataTypes.map(type => ({ value: type, label: type }))}
              value={dataType}
              onChange={setDataType}
              placeholder="Chọn kiểu dữ liệu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trạng thái</label>
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              value={status}
              onChange={setStatus}
              placeholder="Chọn trạng thái"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhóm đơn vị (Unit Class)
            </label>
            <Select
              options={unitClasses
                .filter(uc => uc.status !== 'inactive')
                .map(uc => ({ value: String(uc.id), label: uc.display_name || uc.name }))}
              value={unitClassId ? String(unitClassId) : ''}
              onChange={(value) => setUnitClassId(value ? parseInt(value) : null)}
              placeholder="-- Không có --"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đơn vị mặc định
            </label>
            <Select
              options={filteredUnits.map(unit => ({
                value: String(unit.id),
                label: `${unit.name} (${unit.display_name})`
              }))}
              value={unitId ? String(unitId) : ''}
              onChange={(value) => setUnitId(value ? parseInt(value) : null)}
              disabled={!unitClassId}
              placeholder="-- Không có --"
            />
          </div>
        </div>

        {isEdit && dataType !== 'boolean' && (
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Popular Values (Giá trị phổ biến)
              </label>
            </div>
            <PopularValuesManager
              specId={specId!}
              unit={unitId ? filteredUnits.find(u => u.id === unitId) || null : null}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </div>
  );
}
