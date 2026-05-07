import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabaseClients";
import { subscribeDashboardChanges } from "@/supabase/realtime/dashboard.subscription";
import { debounce } from "@/lib/utils";

export const useBuildingDashboardRealtime = (buildingId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const debouncedInvalidate = debounce(() => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", buildingId],
      });
    }, 1500);

    const unsubscribe = subscribeDashboardChanges({
      supabase,
      buildingId,
      onChange: debouncedInvalidate,
    });

    return () => {
      debouncedInvalidate();
      unsubscribe();
    };
  }, [buildingId, queryClient]);
};
