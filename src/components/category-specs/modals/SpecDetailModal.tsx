"use client";

import React from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import { Spec } from "@/_mocks/category-specs/specs";
import { SpecSetDetail } from "@/_mocks/category-specs/spec-set-details";

interface SpecDetailModalProps {
  specId: number | null;
  groupId: number | null;
  detail?: SpecSetDetail;
  spec?: Spec;
  onToggleProperty: (groupId: number, specId: number, property: keyof SpecSetDetail) => void;
  onUpdateOrder?: (groupId: number, specId: number, order: number) => void;
  onUpdateStatus?: (groupId: number, specId: number, status: string) => void;
  onClose: () => void;
}

export function SpecDetailModal({
  specId,
  groupId,
  detail,
  spec,
  onToggleProperty,
  onUpdateOrder,
  onUpdateStatus,
  onClose
}: SpecDetailModalProps) {
  if (!spec || !detail || !groupId || !specId) {
    return <div className="text-center">Loading...</div>;
  }

  const handleStatusChange = (value: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(groupId, specId, value);
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdateOrder) {
      onUpdateOrder(groupId, specId, parseInt(e.target.value));
    }
  };

  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Cấu hình Spec</h3>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{spec.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{spec.description || 'Không có mô tả'}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
          <Select
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'banned', label: 'Banned' },
              { value: 'deleted', label: 'Deleted' },
            ]}
            value={detail.status}
            onChange={handleStatusChange}
            placeholder="Chọn trạng thái"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Checkbox
            label="Bắt buộc nhập"
            checked={detail.is_required}
            onChange={() => onToggleProperty(groupId, specId, 'is_required')}
          />
          <Checkbox
            label="Cho phép tìm kiếm"
            checked={detail.is_searchable}
            onChange={() => onToggleProperty(groupId, specId, 'is_searchable')}
          />
          <Checkbox
            label="Cho phép lọc"
            checked={detail.is_filterable}
            onChange={() => onToggleProperty(groupId, specId, 'is_filterable')}
          />
          <Checkbox
            label="Cho phép sắp xếp"
            checked={detail.is_sortable}
            onChange={() => onToggleProperty(groupId, specId, 'is_sortable')}
          />
          <Checkbox
            label="Cho phép so sánh"
            checked={detail.is_comparable}
            onChange={() => onToggleProperty(groupId, specId, 'is_comparable')}
          />
          <Checkbox
            label="Được ưu tiên"
            checked={detail.is_priority}
            onChange={() => onToggleProperty(groupId, specId, 'is_priority')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Thứ tự hiển thị</label>
          <Input
            type="number"
            value={detail.order}
            onChange={handleOrderChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
}
