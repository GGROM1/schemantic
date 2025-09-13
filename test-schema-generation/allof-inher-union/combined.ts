// Combined TypeScript Module
// Generated: 2025-09-13T20:38:44.682Z
// Source Directory: allof-inher-union
// Architecture: Modular API client with hooks and type definitions
// api-client
import { APIPetResponse } from './types';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class InheritanceApiClient {
  private baseUrl: string;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  async getPet(pet_id: number, options?: RequestInit): Promise<APIPetResponse> {
    const url = new URL(`${this.baseUrl}${this.buildPath(`/pets/${pet_id}`, { pet_id })}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
      ...options,
    };


    return this.request<APIPetResponse>(url.toString(), requestOptions);
  }

  private buildPath(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      const value = params[key];
      if (value === undefined) {
        throw new Error('Missing required path parameter: ' + key);
      }
      return String(value);
    });
  }

  private toFormData(input: any): FormData {
    const form = new FormData();
    if (input && typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value === undefined || value === null) continue;
        if (value instanceof Blob || (typeof File !== 'undefined' && value instanceof File)) {
          form.append(key, value as any);
        } else if (Array.isArray(value)) {
          for (const v of value) {
            if (v instanceof Blob || (typeof File !== 'undefined' && v instanceof File)) form.append(key, v as any);
            else if (typeof v === 'object') form.append(key, new Blob([JSON.stringify(v)], { type: 'application/json' }));
            else form.append(key, String(v));
          }
        } else if (typeof value === 'object') {
          form.append(key, new Blob([JSON.stringify(value)], { type: 'application/json' }));
        } else {
          form.append(key, String(value));
        }
      }
    }
    return form;
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    let lastError: unknown;
    const retries = this.config.retries ?? 0;
    const delayMs = this.config.retryDelay ?? 0;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = this.config.timeout ?? 0;
        const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : undefined;
        // Link external AbortSignal if provided
        if (options.signal) {
          const ext = options.signal;
          if (ext.aborted) controller.abort();
          else ext.addEventListener('abort', () => controller.abort(), { once: true });
        }
        const { signal: _omit, ...rest } = options as any;
        const response = await fetch(url, { ...rest, signal: controller.signal });
        if (timer) clearTimeout(timer);
        if (!response.ok) {
          throw new ApiClientError('Request failed: ' + response.status + ' ' + response.statusText, response.status, response);
        }
        if (response.status === 204 || options.method === 'HEAD') {
          return undefined as unknown as T;
        }
        return (await response.json()) as T;
      } catch (err) {
        lastError = err;
        if (attempt < retries && delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        throw lastError;
      }
    }
    throw lastError as Error;
  }

  // Convenience helpers for bearer auth
  public setAuthToken(token: string) {
    this.config.headers = { ...(this.config.headers || {}), Authorization: `Bearer ${token}` };
  }
  public clearAuthToken() {
    if (this.config.headers) delete (this.config.headers as any)['Authorization'];
  }}


// barrel
// Barrel exports for type-sync generated code
export * from './types';
export * from './api-client';
export * from './hooks';


// hooks
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


// index
export type { APIBasePet } from './types';
export { InheritanceApiClient } from './api-client';
export { createApiHooks } from './hooks';

// types
export interface APIBasePet {
  id: number;
  name: string;
  age?: number;
}

