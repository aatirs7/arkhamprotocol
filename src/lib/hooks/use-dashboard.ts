"use client";

import useSWR from "swr";
import type { DashboardData } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  return { data, error, isLoading, mutate };
}
