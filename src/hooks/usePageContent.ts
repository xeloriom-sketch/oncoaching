/**
 * usePageContent — Loads page content from Supabase table `page_content`
 * Backed by React Query: data is cached for the session and never re-fetched
 * on back-navigation.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UsePageContentResult<T> {
  content: T | null;
  loading:  boolean;
  error:    string | null;
}

async function fetchPageContent<T>(page: string): Promise<T> {
  const { data, error } = await supabase
    .from("page_content")
    .select("content")
    .eq("page_key", page)
    .single();

  if (error) throw new Error(error.message);
  return data.content as T;
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
