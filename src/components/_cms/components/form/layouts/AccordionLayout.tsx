"use client";
import React, { useState } from "react";
import { AccordionLayoutConfig, FieldConfig } from "@/types/form";
import { UseFormReturn } from "react-hook-form";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import FormField from "../FormField";

interface AccordionLayoutProps {
  layout: AccordionLayoutConfig;
  fields: FieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export default function AccordionLayout({
  layout,
  fields,
  form,
  disabled,
}: AccordionLayoutProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(layout.sections.filter((s) => s.defaultOpen).map((s) => s.id)),
  );

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const getFieldsForSection = (sectionId: string) => {
    const section = layout.sections.find((s) => s.id === sectionId);
    if (!section) return [];

    return fields.filter((field) => section.fields.includes(field.name!));
  };

  const hasSectionErrors = (sectionId: string) => {
    const section = layout.sections.find((s) => s.id === sectionId);
    if (!section) return false;

    return section.fields.some((fieldName) => form.formState.errors[fieldName]);
  };

  return (
    <div className="w-full space-y-2">
      {layout.sections.map((section) => {
        const isOpen = openSections.has(section.id);
        const hasErrors = hasSectionErrors(section.id);

        return (
          <div
            key={section.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                hasErrors ? "border-l-4 border-red-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {section.icon && <span>{section.icon}</span>}
                <div>
                  <h3
                    className={`font-medium ${
                      hasErrors
                        ? "text-red-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {section.description}
                    </p>
                  )}
                </div>
                {hasErrors && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>

              {isOpen ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {isOpen && (
              <div className="p-4 space-y-6 bg-white dark:bg-gray-900">
                {getFieldsForSection(section.id).map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    form={form}
                    disabled={disabled}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
