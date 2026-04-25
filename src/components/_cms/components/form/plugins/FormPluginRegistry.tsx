"use client";
import { FieldRendererProps } from "@/types/form";
import React from "react";

export interface FormPlugin {
  name: string;
  version: string;
  fieldTypes: Record<string, React.ComponentType<FieldRendererProps>>;
  validators?: Record<string, (value: any, config: any) => string | null>;
  transformers?: Record<string, (value: any, config: any) => any>;
}

class FormPluginRegistry {
  private plugins: Map<string, FormPlugin> = new Map();
  private fieldComponents: Map<
    string,
    React.ComponentType<FieldRendererProps>
  > = new Map();
  private validators: Map<string, (value: any, config: any) => string | null> =
    new Map();
  private transformers: Map<string, (value: any, config: any) => any> =
    new Map();

  register(plugin: FormPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(
        `Plugin ${plugin.name} is already registered. Overwriting...`,
      );
    }

    this.plugins.set(plugin.name, plugin);

    // Register field components
    Object.entries(plugin.fieldTypes).forEach(([type, component]) => {
      this.fieldComponents.set(type, component);
    });

    // Register validators
    if (plugin.validators) {
      Object.entries(plugin.validators).forEach(([name, validator]) => {
        this.validators.set(name, validator);
      });
    }

    // Register transformers
    if (plugin.transformers) {
      Object.entries(plugin.transformers).forEach(([name, transformer]) => {
        this.transformers.set(name, transformer);
      });
    }

    console.log(
      `Plugin ${plugin.name} v${plugin.version} registered successfully`,
    );
  }

  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.warn(`Plugin ${pluginName} is not registered`);
      return;
    }

    // Remove field components
    Object.keys(plugin.fieldTypes).forEach((type) => {
      this.fieldComponents.delete(type);
    });

    // Remove validators
    if (plugin.validators) {
      Object.keys(plugin.validators).forEach((name) => {
        this.validators.delete(name);
      });
    }

    // Remove transformers
    if (plugin.transformers) {
      Object.keys(plugin.transformers).forEach((name) => {
        this.transformers.delete(name);
      });
    }

    this.plugins.delete(pluginName);
    console.log(`Plugin ${pluginName} unregistered successfully`);
  }

  getFieldComponent(
    type: string,
  ): React.ComponentType<FieldRendererProps> | null {
    return this.fieldComponents.get(type) || null;
  }

  getValidator(
    name: string,
  ): ((value: any, config: any) => string | null) | null {
    return this.validators.get(name) || null;
  }

  getTransformer(name: string): ((value: any, config: any) => any) | null {
    return this.transformers.get(name) || null;
  }

  getRegisteredPlugins(): FormPlugin[] {
    return Array.from(this.plugins.values());
  }

  getAvailableFieldTypes(): string[] {
    return Array.from(this.fieldComponents.keys());
  }

  isFieldTypeSupported(type: string): boolean {
    return this.fieldComponents.has(type);
  }
}

// Global registry instance
export const formPluginRegistry = new FormPluginRegistry();

// Hook for using plugins in components
export function useFormPlugins() {
  return {
    registry: formPluginRegistry,
    getFieldComponent: (type: string) =>
      formPluginRegistry.getFieldComponent(type),
    getValidator: (name: string) => formPluginRegistry.getValidator(name),
    getTransformer: (name: string) => formPluginRegistry.getTransformer(name),
    isSupported: (type: string) =>
      formPluginRegistry.isFieldTypeSupported(type),
  };
}

// Helper function to create a plugin
export function createFormPlugin(config: {
  name: string;
  version: string;
  fieldTypes: Record<string, React.ComponentType<FieldRendererProps>>;
  validators?: Record<string, (value: any, config: any) => string | null>;
  transformers?: Record<string, (value: any, config: any) => any>;
}): FormPlugin {
  return {
    name: config.name,
    version: config.version,
    fieldTypes: config.fieldTypes,
    validators: config.validators,
    transformers: config.transformers,
  };
}
