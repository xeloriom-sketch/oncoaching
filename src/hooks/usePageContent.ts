import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UsePageContentResult<T> {
  content: T | null;
  loading:  boolean;
  error:    string | null;
}

// Try Supabase first; fall back to local JSON if it fails or is misconfigured
async function fetchPageContent<T>(page: string): Promise<T> {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("content")
      .eq("page_key", page)
      .single();

    if (!error && data?.content) return data.content as T;
  } catch { /* network error — fall through to local JSON */ }

  const res = await fetch(`/content/${page}.json`);
  if (!res.ok) throw new Error(`Content not found: ${page}`);
  return res.json() as Promise<T>;
}

export function usePageContent<T = Record<string, unknown>>(
  page: string
): UsePageContentResult<T> {
  const { data, isPending, error } = useQuery<T, Error>({
    queryKey:  ["page-content", page],
    queryFn:   () => fetchPageContent<T>(page),
    staleTime: Infinity,
  });

  return {
    content: data ?? null,
    loading:  isPending,
    error:    error?.message ?? null,
  };
}
