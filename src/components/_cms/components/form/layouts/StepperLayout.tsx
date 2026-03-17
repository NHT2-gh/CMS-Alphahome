/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { StepperLayoutConfig, FieldConfig } from "@/types/form";
import { UseFormReturn } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "lucide-react";
import FormField from "../FormField";

interface StepperLayoutProps {
  layout: StepperLayoutConfig;
  fields: FieldConfig[];
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export default function StepperLayout({
  layout,
  fields,
  form,
  disabled,
}: StepperLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const getFieldsForStep = (stepIndex: number) => {
    const step = layout.steps[stepIndex];
    if (!step) return [];

    return fields.filter((field) => step.fields.includes(field.name));
  };

  const hasStepErrors = (stepIndex: number) => {
    const step = layout.steps[stepIndex];
    if (!step) return false;

    return step.fields.some((fieldName) => form.formState.errors[fieldName]);
  };

  const isStepValid = async (stepIndex: number) => {
    const step = layout.steps[stepIndex];
    if (!step || !step.validation) return true;

    const stepData = step.fields.reduce((acc, fieldName) => {
      acc[fieldName] = form.getValues(fieldName);
      return acc;
    }, {} as any);

    try {
      await step.validation.parseAsync(stepData);
      return true;
    } catch {
      return false;
    }
  };

  const nextStep = async () => {
    if (currentStep < layout.steps.length - 1) {
      const valid = await isStepValid(currentStep);
      if (valid) {
        setCurrentStep(currentStep + 1);
      } else {
        // Trigger validation for current step fields
        const step = layout.steps[currentStep];
        await form.trigger(step.fields);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || stepIndex === 0) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="w-full">
      {/* Stepper Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {layout.steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep && index !== 0}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm ${
                    index < currentStep
                      ? "bg-brand-500 border-brand-500 text-white"
                      : index === currentStep
                        ? "border-brand-500 text-brand-500 bg-white dark:bg-gray-900"
                        : "border-gray-300 text-gray-500 bg-white dark:bg-gray-900"
                  } ${
                    hasStepErrors(index) ? "border-red-500 text-red-500" : ""
                  }`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : layout.showStepNumbers !== false ? (
                    index + 1
                  ) : (
                    ""
                  )}
                </button>

                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      index === currentStep
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400">{step.description}</p>
                  )}
                </div>
              </div>

              {index < layout.steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-0.5 ${
                      index < currentStep ? "bg-brand-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        <div className="space-y-6">
          {getFieldsForStep(currentStep).map((field) => (
            <FormField
              key={field.name}
              field={field}
              form={form}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0 || disabled}
          startIcon={<ChevronLeftIcon className="w-4 h-4" />}
        >
          Previous
        </Button>

        {currentStep < layout.steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={disabled}
            endIcon={<ChevronRightIcon className="w-4 h-4" />}
          >
            Next
          </Button>
        ) : (
          <Button disabled={disabled}>Submit</Button>
        )}
      </div>
    </div>
  );
}
