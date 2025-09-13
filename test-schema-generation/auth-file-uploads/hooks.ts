import { APILoginResponse, APILoginRequest, APIFileUploadResponse } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthUploadApiClient, ApiClientError } from './api-client';

export function createApiHooks(client: AuthUploadApiClient) {
  function useCreateLoginMutation() {
    const [data, setData] = useState<APILoginResponse | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const mutate = useCallback(async (payload: { body?: APILoginRequest }, requestInit?: RequestInit) => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.createLogin(payload?.body, requestInit);
        setData(result);
        return result;
      } catch (e) { setError(e as ApiClientError); throw e; } finally { setLoading(false); }
    }, [client]);
    const reset = useCallback(() => { setData(undefined); setError(undefined); setLoading(false); }, []);
    return { mutate, data, error, loading, reset };
  }
  function useCreateUploadMutation() {
    const [data, setData] = useState<APIFileUploadResponse | undefined>(undefined);
    const [error, setError] = useState<ApiClientError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const mutate = useCallback(async (payload: { body?: { file: string; description: string } }, requestInit?: RequestInit) => {
      setLoading(true); setError(undefined);
      try {
        const result = await client.createUpload(payload?.body, requestInit);
        setData(result);
        return result;
      } catch (e) { setError(e as ApiClientError); throw e; } finally { setLoading(false); }
    }, [client]);
    const reset = useCallback(() => { setData(undefined); setError(undefined); setLoading(false); }, []);
    return { mutate, data, error, loading, reset };
  }
  return { useCreateLoginMutation, useCreateUploadMutation };
}
