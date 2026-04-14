import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import React from "react";

interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "info" | "warning" | "danger";
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText: string;
  onCancel?: () => void;
  cancelText?: string;
}
export default function ModalAlert({
  isOpen,
  onClose,
  type = "info",
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ModalAlertProps) {
  const Icon = iconMap[`modal-alert-${type}`];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <div className="text-center">
        <Icon />
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
          {title}
        </h4>
        <p className="mb-6 text-gray-500 dark:text-gray-400">{description}</p>

        <div className="flex items-center justify-center w-full gap-3 mt-7">
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs sm:w-auto",
              {
                "bg-error-500 hover:bg-error-600": type === "danger",
                "bg-warning-500 hover:bg-warning-600": type === "warning",
                "bg-info-500 hover:bg-info-600": type === "info",
                "bg-success-500 hover:bg-success-600": type === "success",
              },
            )}
          >
            {confirmText}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs sm:w-auto",
                {
                  "bg-error-500 hover:bg-error-600": type === "danger",
                  "bg-warning-500 hover:bg-warning-600": type === "warning",
                  "bg-info-500 hover:bg-info-600": type === "info",
                  "bg-success-500 hover:bg-success-600": type === "success",
                },
              )}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
