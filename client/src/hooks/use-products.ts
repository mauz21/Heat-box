import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProducts(category?: string, spicyLevel?: number) {
  const queryParams: Record<string, string> = {};
  if (category && category !== 'All') queryParams.category = category;
  if (spicyLevel !== undefined) queryParams.spicyLevel = spicyLevel.toString();

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${api.products.list.path}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: [api.products.list.path, category, spicyLevel],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
