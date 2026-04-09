import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Serialize value to string for URL
 */
function serializeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => serializeValue(v)).join(",");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Deserialize string from URL to appropriate type
 */
function deserializeValue(str: string, hint?: string): unknown {
  if (!str) return null;

  // If hint is provided, try to parse based on hint
  if (hint === "json") {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  if (hint === "number") {
    const num = Number(str);
    return isNaN(num) ? str : num;
  }

  if (hint === "boolean") {
    return str === "true";
  }

  if (hint === "array") {
    return str.split(",");
  }

  // Try to auto-detect type
  // Check if it's a number
  if (/^\d+(\.\d+)?$/.test(str)) {
    return Number(str);
  }

  // Check if it's a boolean
  if (str === "true" || str === "false") {
    return str === "true";
  }

  // Check if it's JSON
  if (
    (str.startsWith("{") && str.endsWith("}")) ||
    (str.startsWith("[") && str.endsWith("]"))
  ) {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  // Default to string
  return str;
}

/**
 * Custom hook to manage state synchronized with URL search parameters
 * @param key - The URL parameter key
 * @param defaultValue - Default value when parameter is not present
 * @returns [value, setValue] tuple similar to useState
 */
export function useUrlState(key: string, defaultValue: string = "") {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get(key) || defaultValue;

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newValue === defaultValue || !newValue) {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.push(`${window.location.pathname}${newUrl}`, { scroll: false });
    },
    [key, defaultValue, router, searchParams]
  );

  return [value, setValue] as const;
}

/**
 * Hook specifically for managing multiple URL parameters at once
 * Supports multiple data types: string, number, boolean, array, and objects
 * @param defaultParams - Object with default parameter values (can be any type)
 * @returns [params, updateParams] tuple
 */
export function useUrlParams(defaultParams: Record<string, unknown> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = Object.keys(defaultParams).reduce((acc, key) => {
    const urlValue = searchParams.get(key);

    if (urlValue) {
      // Determine the hint based on the default value type
      let hint: string | undefined;
      const defaultValue = defaultParams[key];
      
      if (Array.isArray(defaultValue)) {
        hint = "array";
      } else if (typeof defaultValue === "number") {
        hint = "number";
      } else if (typeof defaultValue === "boolean") {
        hint = "boolean";
      } else if (typeof defaultValue === "object" && defaultValue !== null) {
        hint = "json";
      }
      
      acc[key] = deserializeValue(urlValue, hint);
    } else {
      acc[key] = defaultParams[key];
    }
    return acc;
  }, {} as Record<string, unknown>);

  const updateParams = useCallback(
    (updates: Record<string, unknown>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        const serialized = serializeValue(value);
        const defaultSerialized = serializeValue(defaultParams[key]);

        if (
          value === null ||
          value === undefined ||
          serialized === defaultSerialized ||
          !serialized
        ) {
          newParams.delete(key);
        } else {
          newParams.set(key, serialized);
        }
      });

      const newUrl = newParams.toString() ? `?${newParams.toString()}` : "";
      router.push(`${window.location.pathname}${newUrl}`, { scroll: false });
    },
    [defaultParams, router, searchParams]
  );

  return [params, updateParams] as const;
}
