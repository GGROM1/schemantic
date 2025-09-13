import { APIPostListResponse, APIPost } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BlogApiClient, ApiClientError } from './api-client';

export function createApiHooks(client: BlogApiClient) {
  function useListPostsQuery(args: { query?: { limit?: number; offset?: number } }, requestInit?: RequestInit) {
    const [data, setData] = useState<APIPostListResponse | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const argsRef = useRef(args);
    useEffect(() => { argsRef.current = args; }, [args]);
    const fetcher = useCallback(async () => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.listPosts(args?.query?.limit, args?.query?.offset, requestInit);
        setData(result);
      } catch (e) { setError(e as ApiClientError); } finally { setLoading(false); }
    }, [client, args, requestInit]);
    useEffect(() => { void fetcher(); }, [fetcher]);
    const refetch = useCallback(fetcher, [fetcher]);
    return { data, error, loading, refetch };
  }
  function useGetPostQuery(args: { path: { id: number } }, requestInit?: RequestInit) {
    const [data, setData] = useState<APIPost | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const argsRef = useRef(args);
    useEffect(() => { argsRef.current = args; }, [args]);
    const fetcher = useCallback(async () => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.getPost(args!.path.id, requestInit);
        setData(result);
      } catch (e) { setError(e as ApiClientError); } finally { setLoading(false); }
    }, [client, args, requestInit]);
    useEffect(() => { void fetcher(); }, [fetcher]);
    const refetch = useCallback(fetcher, [fetcher]);
    return { data, error, loading, refetch };
  }
  return { useListPostsQuery, useGetPostQuery };
}
