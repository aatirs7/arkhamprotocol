"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useActiveSession() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/sessions/active",
    fetcher,
    { refreshInterval: 5000 }
  );
  return { session: data, error, isLoading, mutate };
}
