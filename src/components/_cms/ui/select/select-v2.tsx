import { SelectContext } from "@/context/select-context";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

import React from "react";

export interface SelectProps {
  children: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  handleOnChange?: (value: string) => void;
}

export function Select({
  children,
  disabled,
  placeholder,
  value,
  handleOnChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the selected option to display its content
  const selectedChild = (
    React.Children.toArray(children)[0] as any
  ).props.children
    .find((child: any) => Array.isArray(child))
    ?.find((child: any) => child.key === value) as
    | React.ReactElement
    | undefined;

  const displayContent = selectedChild
    ? (selectedChild.props as any).children
    : placeholder;

  return (
    <SelectContext.Provider value={{ value, handleOnChange, setIsOpen }}>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary flex items-center justify-between w-full h-[40px] p-2.5 text-txt-primary text-[0.9375rem]/[1.25rem] border border-stroke-primary focus:outline-none disabled:opacity-30"
        >
          <span className="truncate">{displayContent}</span>
          <ChevronDownIcon
            className={cn(
              "w-4 h-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* {isOpen && ( */}
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className="absolute top-[calc(100%+2px)] z-10 bg-primary left-0 right-0 w-full border border-stroke-primary max-h-60 overflow-y-auto shadow-lg"
        >
          {children}
        </div>
        {/* )} */}
      </div>
    </SelectContext.Provider>
  );
}

export function Option({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("Option must be used within a Select component");
  }

  const { handleOnChange, setIsOpen, value: selectedValue } = context;
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => {
        handleOnChange?.(value);
        setIsOpen(false);
      }}
      className={cn(
        "h-[40px] block w-full text-left p-2.5 text-txt-primary text-[0.9375rem]/[1.25rem] border-b border-stroke-primary last:border-b-0 hover:bg-red-subtle5",
        isSelected && "font-medium bg-red-subtle5/50",
      )}
    >
      {children}
    </button>
  );
}
