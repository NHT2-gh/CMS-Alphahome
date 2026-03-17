import React from "react";

export const SelectContext = React.createContext<{
  value?: string;
  handleOnChange?: (value: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
