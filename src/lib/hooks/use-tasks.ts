"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTasks(status?: string) {
  const params = status ? `?status=${status}` : "";
  const { data, error, isLoading, mutate } = useSWR(
    `/api/tasks${params}`,
    fetcher,
    { refreshInterval: 5000 }
  );
  return { tasks: data ?? [], error, isLoading, mutate };
}
