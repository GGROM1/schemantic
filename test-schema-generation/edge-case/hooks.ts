import { APIUserResponse, APIItem, APICreateItemRequest } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SampleApiClient, ApiClientError } from './api-client';

export function createApiHooks(client: SampleApiClient) {
  function useGetUserQuery(args: { path: { user_id: number }; query?: { verbose?: boolean } }, requestInit?: RequestInit) {
    const [data, setData] = useState<APIUserResponse | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const argsRef = useRef(args);
    useEffect(() => { argsRef.current = args; }, [args]);
    const fetcher = useCallback(async () => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.getUser(args!.path.user_id, args?.query?.verbose, requestInit);
        setData(result);
      } catch (e) { setError(e as ApiClientError); } finally { setLoading(false); }
    }, [client, args, requestInit]);
    useEffect(() => { void fetcher(); }, [fetcher]);
    const refetch = useCallback(fetcher, [fetcher]);
    return { data, error, loading, refetch };
  }
  function useCreateItemMutation() {
    const [data, setData] = useState<APIItem | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const mutate = useCallback(async (payload: { body?: APICreateItemRequest }, requestInit?: RequestInit) => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.createItem(payload?.body, requestInit);
        setData(result);
        return result;
      } catch (e) { setError(e as ApiClientError); throw e; } finally { setLoading(false); }
    }, [client]);
    const reset = useCallback(() => { setData(undefined); setError(undefined); setLoading(false); }, []);
    return { mutate, data, error, loading, reset };
  }
  return { useGetUserQuery, useCreateItemMutation };
}
