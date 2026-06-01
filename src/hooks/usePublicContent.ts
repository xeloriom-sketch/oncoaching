import { useQuery } from "@tanstack/react-query";

interface UsePublicContentResult<T> {
  content: T | null;
  loading: boolean;
  error: string | null;
}

async function fetchJson<T>(page: string): Promise<T> {
  const res = await fetch(`/content/${page}.json`);
  if (!res.ok) throw new Error(`Content not found: ${page}`);
  return res.json() as Promise<T>;
}

export function usePublicContent<T = Record<string, unknown>>(
  page: string
): UsePublicContentResult<T> {
  const { data, isPending, error } = useQuery<T, Error>({
    queryKey: ["public-content", page],
    queryFn: () => fetchJson<T>(page),
    staleTime: 1000 * 60 * 30,
  });

  return {
    content: data ?? null,
    loading: isPending,
    error: error?.message ?? null,
  };
}
