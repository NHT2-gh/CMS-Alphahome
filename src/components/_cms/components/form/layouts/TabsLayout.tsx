"use client";
import React, { useState } from "react";
import { TabLayoutConfig, FieldConfig } from "@/types/form";
import { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";

interface TabsLayoutProps {
  layout: TabLayoutConfig;
  fields: FieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export default function TabsLayout({
  layout,
  fields,
  form,
  disabled,
}: TabsLayoutProps) {
  const [activeTab, setActiveTab] = useState(layout.tabs[0]?.id || "");

  const getFieldsForTab = (tabId: string) => {
    const tab = layout.tabs.find((t) => t.id === tabId);
    if (!tab) return [];

    return fields.filter((field) => tab.fields.includes(field.name));
  };

  const hasTabErrors = (tabId: string) => {
    const tab = layout.tabs.find((t) => t.id === tabId);
    if (!tab) return false;

    return tab.fields.some((fieldName) => form.formState.errors[fieldName]);
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {layout.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } ${hasTabErrors(tab.id) ? "text-red-500" : ""}`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {hasTabErrors(tab.id) && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {layout.tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            <div className="space-y-6">
              {getFieldsForTab(tab.id).map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  form={form}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
