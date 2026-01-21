import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertReservation } from "@shared/schema";

export function useCreateReservation() {
  return useMutation({
    mutationFn: async (data: InsertReservation) => {
      const res = await fetch(api.reservations.create.path, {
        method: api.reservations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create reservation");
      }
      return api.reservations.create.responses[201].parse(await res.json());
    },
  });
}
