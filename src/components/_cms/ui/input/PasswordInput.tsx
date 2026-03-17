import React from "react";
import Input, { InputProps } from "./InputField";
import { EyeIcon } from "lucide-react";
import { EyeCloseIcon } from "@/icons";

export default function PasswordInput({ ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        placeholder="Enter your password"
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
      >
        {showPassword ? (
          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
        ) : (
          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
        )}
      </span>
    </div>
  );
}
