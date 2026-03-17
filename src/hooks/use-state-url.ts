import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type Parser<T> = {
  parse: (value: string | null) => T | null;
  serialize: (value: T) => string | null;
};

export function useQueryState<T>(
  key: string,
  parser: Parser<T>,
  defaultValue: T,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const value = parser.parse(searchParams.get(key)) ?? defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams.toString());

      const serialized = parser.serialize(newValue);

      if (serialized === null) {
        params.delete(key);
      } else {
        params.set(key, serialized);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, key, pathname, router, parser],
  );

  return [value, setValue] as const;
}

export const stringParser = {
  parse: (v: string | null) => v,
  serialize: (v: string) => v,
};

export const numberParser = {
  parse: (v: string | null) => (v ? Number(v) : null),
  serialize: (v: number) => String(v),
};

export const booleanParser = {
  parse: (v: string | null) => v === "true",
  serialize: (v: boolean) => String(v),
};
