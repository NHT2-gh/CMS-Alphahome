"use client";
import { useState } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes("401")) {
                return false; // Don't retry auth errors
              }
              return failureCount < 3;
            },
          },
          mutations: {
            onError: (error, query) => {
              const q = query as Query;

              if (q.meta?.showErrorToast) {
                showToast.error({
                  title: "Lỗi",
                  description: mapErrorToMessage(error),
                });
              }
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
