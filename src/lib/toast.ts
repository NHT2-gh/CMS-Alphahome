import { toast } from "react-hot-toast";
import { createElement } from "react";
import CustomToast from "@/components/ui/toast/CustomToast";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showToast = {
  success: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "success",
          title,
          description,
        }),
      { duration, position: "bottom-right" },
    );
  },

  error: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "error",
          title,
          description,
        }),
      { duration, position: "bottom-right" },
    );
  },

  warning: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "warning",
          title,
          description,
        }),
      { duration, position: "bottom-right" },
    );
  },

  info: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "info",
          title,
          description,
        }),
      { duration, position: "bottom-right" },
    );
  },
};
