import { APIReport } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NestedDataApiClient, ApiClientError } from './api-client';

export function createApiHooks(client: NestedDataApiClient) {
  function useListReportsQuery(requestInit?: RequestInit) {
    const [data, setData] = useState<APIReport[] | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const fetcher = useCallback(async () => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.listReports(requestInit);
        setData(result);
      } catch (e) { setError(e as ApiClientError); } finally { setLoading(false); }
    }, [client, requestInit]);
    useEffect(() => { void fetcher(); }, [fetcher]);
    const refetch = useCallback(fetcher, [fetcher]);
    return { data, error, loading, refetch };
  }
  return { useListReportsQuery };
}
