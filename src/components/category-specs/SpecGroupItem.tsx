"use client";

import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ITEM_TYPES, type SpecGroupItemProps } from "./types";
import { DraggableSpecItem } from "./DraggableSpecItem";
import Input from "@/components/form/input/InputField";

export function SpecGroupItem({
  group,
  details,
  index,
  onDeleteGroup,
  onRemoveSpec,
  onMoveSpec,
  onMoveGroup,
  onToggleProperty,
  onOpenDetail,
  onUpdateStatus,
  onUpdateGroupName,
  getSpecById,
  getUnitDisplayName
}: SpecGroupItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(group.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.SPEC_GROUP,
    item: { groupId: group.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: [ITEM_TYPES.SPEC_IN_GROUP, ITEM_TYPES.AVAILABLE_SPEC, ITEM_TYPES.SPEC_GROUP],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) return;

      if (item.type === ITEM_TYPES.AVAILABLE_SPEC) {
        // Add from available specs
        if (!details.some(d => d.product_spec_id === item.spec.id)) {
          onMoveSpec(item.spec.id, -1, group.id, details.length);
        }
      } else if (item.type === ITEM_TYPES.SPEC_GROUP && item.groupId !== group.id) {
        // Reorder groups
        onMoveGroup?.(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  drag(drop(ref));

  // Handle name edit
  const handleStartEdit = () => {
    setIsEditingName(true);
    setEditingName(group.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSaveEdit = () => {
    const newName = editingName.trim() || group.name;
    onUpdateGroupName(group.id, newName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditingName(group.name);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`rounded-xl border-2 p-4 transition-all ${
        isOver ? 'border-brand-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-800' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-white dark:border-gray-700 dark:from-blue-950 dark:to-gray-800'
      }`}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex flex-1 items-baseline gap-3">
          <span className="cursor-move text-2xl leading-none text-gray-400">☰</span>
          {isEditingName ? (
            <input
              ref={inputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-lg border-2 border-brand-500 bg-white px-3 py-1 text-lg font-bold text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-brand-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-700"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3
              className="flex-1 cursor-pointer text-lg font-bold text-gray-800 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                handleStartEdit();
              }}
            >
              {group.name}
              {group.is_highlight && (
                <span className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  ⭐ Nổi bật
                </span>
              )}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">({details.length} specs)</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup(group.id);
            }}
            className="text-xl font-bold text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Specs in this group */}
      <div className="space-y-2">
        {details.map((detail, index) => (
          <DraggableSpecItem
            key={detail.product_spec_id}
            detail={detail}
            index={index}
            groupId={group.id}
            spec={getSpecById(detail.product_spec_id)}
            unitDisplayName={getUnitDisplayName(getSpecById(detail.product_spec_id)?.unit_id || null)}
            onRemove={onRemoveSpec}
            onMove={onMoveSpec}
            onToggleProperty={onToggleProperty}
            onOpenDetail={onOpenDetail}
            onUpdateStatus={onUpdateStatus}
          />
        ))}

        {details.length === 0 && (
          <div className="rounded bg-gray-50 py-4 text-center text-sm text-gray-500 dark:bg-gray-900">
            Chưa có specs. Kéo thả từ danh sách bên phải.
          </div>
        )}
      </div>
    </div>
  );
}
