"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePrayers() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/prayers/today",
    fetcher,
    { refreshInterval: 5000 }
  );
  return { prayers: data ?? [], error, isLoading, mutate };
}
