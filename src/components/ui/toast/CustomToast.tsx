"use client";
import React from "react";
import { Toast } from "react-hot-toast";
import Alert from "../alert/Alert";

interface CustomToastProps {
  t: Toast;
  variant: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  t,
  variant,
  title,
  description,
}) => {
  switch (variant) {
    case "success":
      return (
        <Alert
          t={t}
          variant="success"
          title={title}
          message={description}
          showLink={false}
        />
      );

    case "error":
      return (
        <Alert
          t={t}
          variant="error"
          title={title}
          message={description}
          showLink={false}
        />
      );

    case "warning":
      return (
        <Alert
          t={t}
          variant="warning"
          title={title}
          message={description}
          showLink={false}
        />
      );

    case "info":
      return (
        <Alert
          t={t}
          variant="info"
          title={title}
          message={description}
          showLink={false}
        />
      );
  }
};

export default CustomToast;
