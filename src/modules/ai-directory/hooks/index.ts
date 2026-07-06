/**
 * AI Directory — React hooks
 *
 * Local state helpers for filters, search, and pagination. Data fetching
 * hooks (useQuery-based) will be added once the backend is live.
 */

import { useCallback, useMemo, useState } from "react";
import type { DirectoryFilters, SortOption } from "../types";
import { DEFAULT_PAGE_SIZE } from "../constants";

export function useDirectoryFilters(initial: DirectoryFilters = {}) {
  const [filters, setFilters] = useState<DirectoryFilters>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: "most-popular",
    ...initial,
  });

  const update = useCallback((patch: Partial<DirectoryFilters>) => {
    setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));
  }, []);

  const reset = useCallback(() => {
    setFilters({ page: 1, pageSize: DEFAULT_PAGE_SIZE, sort: "most-popular" });
  }, []);

  const setPage = useCallback((page: number) => setFilters((f) => ({ ...f, page })), []);
  const setSort = useCallback((sort: SortOption) => setFilters((f) => ({ ...f, sort, page: 1 })), []);
  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query, page: 1 })), []);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.category) n++;
    if (filters.subCategory) n++;
    n += filters.tags?.length ?? 0;
    n += filters.pricing?.length ?? 0;
    n += filters.platforms?.length ?? 0;
    n += filters.languages?.length ?? 0;
    n += filters.flags?.length ?? 0;
    return n;
  }, [filters]);

  return { filters, update, reset, setPage, setSort, setQuery, activeCount };
}

export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
