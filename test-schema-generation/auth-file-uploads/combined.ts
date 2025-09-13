// Combined TypeScript Module
// Generated: 2025-09-13T20:38:44.685Z
// Source Directory: auth-file-uploads
// Architecture: Modular API client with hooks and type definitions
// api-client
import { APILoginResponse, APILoginRequest, APIFileUploadResponse } from './types';

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

export class AuthUploadApiClient {
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

  async createLogin(body?: APILoginRequest, options?: RequestInit): Promise<APILoginResponse> {
    const url = new URL(`${this.baseUrl}${this.buildPath(`/auth/login`, {})}`);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        ...this.config.headers,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    };


    return this.request<APILoginResponse>(url.toString(), requestOptions);
  }

  async createUpload(body?: { file: string; description: string } | FormData, options?: RequestInit): Promise<APIFileUploadResponse> {
    const url = new URL(`${this.baseUrl}${this.buildPath(`/files/upload`, {})}`);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
      body: (body instanceof FormData ? body : (body !== undefined ? this.toFormData(body as any) : undefined)) as any,
      ...options,
    };


    return this.request<APIFileUploadResponse>(url.toString(), requestOptions);
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


// index
export type { APILoginRequest, APILoginResponse, APIFileUploadResponse } from './types';
export { AuthUploadApiClient } from './api-client';
export { createApiHooks } from './hooks';

// types
export interface APILoginRequest {
  username: string;
  password: string;
}

export interface APILoginResponse {
  token: string;
}

export interface APIFileUploadResponse {
  fileId: string;
  url: string;
}

