import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLoyaltyAccount() {
  return useQuery({
    queryKey: [api.loyalty.get.path],
    queryFn: async () => {
      const res = await fetch(api.loyalty.get.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch loyalty account");
      return api.loyalty.get.responses[200].parse(await res.json());
    },
  });
}
