/**
 * usePageContent — Loads page content from /public/content/*.json
 * Backed by React Query: data is cached for the session and never re-fetched
 * on back-navigation.
 */
import { useQuery } from "@tanstack/react-query";

interface UsePageContentResult<T> {
  content: T | null;
  loading:  boolean;
  error:    string | null;
}

async function fetchJson<T>(page: string, baseUrl: string): Promise<T> {
  const res = await fetch(`${baseUrl}content/${page}.json`);
  if (!res.ok) throw new Error(`Impossible de charger ${page}.json (${res.status})`);
  return res.json() as Promise<T>;
}

export function usePageContent<T = Record<string, unknown>>(
  page: string
): UsePageContentResult<T> {
  const { data, isPending, error } = useQuery<T, Error>({
    queryKey:  ["page-content", page],
    queryFn:   () => fetchJson<T>(page, import.meta.env.BASE_URL ?? "/"),
    staleTime: Infinity,
  });

  return {
    content: data ?? null,
    loading:  isPending,
    error:    error?.message ?? null,
  };
}
