import Label from "@/components/form/Label";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

import React from "react";

interface FilterItemLayoutProps {
  label?: string;
  subLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FilterItemLayout({
  label,
  subLabel,
  className,
  children,
}: FilterItemLayoutProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className={cn("space-y-3 h-full", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label className="text-sm/[120%] font-bold  text-text-primary inline-block uppercase">
            {label}
          </Label>
        )}
        {subLabel && (
          <Label className="text-xs/[120%] font-medium  text-text-primary inline-block ">
            {subLabel}
          </Label>
        )}

        <button
          className="p-1 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDownIcon
            strokeWidth={2}
            className={`w-5 h-5 text-icon-primary transition-transform duration-200 group-hover:text-status-red ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded && children}
    </div>
  );
}
