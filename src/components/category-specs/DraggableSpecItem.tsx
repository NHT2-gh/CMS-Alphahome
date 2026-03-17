"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { SpecSetDetail } from "@/_mocks/category-specs/spec-set-details";
import { ITEM_TYPES, type DraggableSpecItemProps } from "./types";
import Select from "@/components/form/Select";

const statusLabels = {
  draft: 'Draft',
  pending: 'Pending',
  active: 'Active',
  inactive: 'Inactive',
  banned: 'Banned',
  deleted: 'Deleted'
};

export function DraggableSpecItem({
  detail,
  index,
  groupId,
  spec,
  unitDisplayName,
  onRemove,
  onMove,
  onToggleProperty,
  onOpenDetail,
  onUpdateStatus
}: DraggableSpecItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.SPEC_IN_GROUP,
    item: { specId: detail.product_spec_id, groupId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPES.SPEC_IN_GROUP,
    drop: (item: any) => {
      if (item.groupId !== groupId) {
        onMove(item.specId, item.groupId, groupId, index);
      } else if (item.index !== index) {
        onMove(item.specId, groupId, groupId, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  drag(drop(ref));

  if (!spec) return null;

  const status = detail.status || 'active';
  const isPending = status === 'pending';

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
        isPending ? 'spec-item-pending' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
      } ${isOver ? 'border-brand-500' : ''}`}
    >
      <div className="flex flex-1 cursor-move items-center gap-3">
        <span className="text-gray-400">☰</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-white">{spec.name}</span>
            <span className={`badge-status badge-status-${status}`}>
              {statusLabels[status as keyof typeof statusLabels] || status}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {spec.data_type}
            {unitDisplayName && ` • ${unitDisplayName}`}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {detail.is_required && <span className="badge badge-required">Required</span>}
            {detail.is_searchable && <span className="badge badge-searchable">Search</span>}
            {detail.is_filterable && <span className="badge badge-filterable">Filter</span>}
            {detail.is_sortable && <span className="badge badge-sortable">Sort</span>}
            {detail.is_comparable && <span className="badge badge-comparable">Compare</span>}
            {detail.is_priority && <span className="badge badge-priority">Priority</span>}
          </div>
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2">
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'banned', label: 'Banned' },
              { value: 'deleted', label: 'Deleted' },
            ]}
            value={status}
            onChange={(value) => onUpdateStatus?.(groupId, spec.id, value)}
            className="w-32 text-xs h-9"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(spec.id, groupId);
          }}
          className="text-blue-600 hover:text-blue-800"
          title="Cấu hình"
        >
          ⚙️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(groupId, spec.id);
          }}
          className="text-red-600 hover:text-red-800"
          title="Xóa"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
