import { SupabaseClient } from "@supabase/supabase-js";

type DashboardSubscriptionProps = {
  supabase: SupabaseClient;
  buildingId: string;
  onChange: () => void;
};

export const subscribeDashboardChanges = ({
  supabase,
  buildingId,
  onChange,
}: DashboardSubscriptionProps) => {
  const channel = supabase
    .channel(`dashboard:${buildingId}`)

    // transactions
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `building_id=eq.${buildingId}`,
      },
      onChange,
    )

    // contracts
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "contracts",
      },
      onChange,
    )

    // rooms
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms",
        filter: `building_id=eq.${buildingId}`,
      },
      onChange,
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
