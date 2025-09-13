import { APIPetResponse } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InheritanceApiClient, ApiClientError } from './api-client';

export function createApiHooks(client: InheritanceApiClient) {
  function useGetPetQuery(args: { path: { pet_id: number } }, requestInit?: RequestInit) {
    const [data, setData] = useState<APIPetResponse | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const argsRef = useRef(args);
    useEffect(() => { argsRef.current = args; }, [args]);
    const fetcher = useCallback(async () => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.getPet(args!.path.pet_id, requestInit);
        setData(result);
      } catch (e) { setError(e as ApiClientError); } finally { setLoading(false); }
    }, [client, args, requestInit]);
    useEffect(() => { void fetcher(); }, [fetcher]);
    const refetch = useCallback(fetcher, [fetcher]);
    return { data, error, loading, refetch };
  }
  return { useGetPetQuery };
}
