import { z } from 'zod';

export interface APILoginRequest {
  username: string;
  password: string;
}



/**
 * Zod validation schema for APILoginRequest
 */
export const APILoginRequestSchema = z.object({
  username: z.string(),
  password: z.string()
}).strict();

/**
 * Validate APILoginRequest data with detailed error reporting
 */
export function validateAPILoginRequest(data: unknown): { success: true; data: APILoginRequest } | { success: false; errors: string[] } {
  const result = APILoginRequestSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APILoginRequest data with exception on validation failure
 */
export function parseAPILoginRequest(data: unknown): APILoginRequest {
  return APILoginRequestSchema.parse(data);
}
/**
 * Branded type for APILoginRequest with compile-time guarantees
 */
export type BrandedAPILoginRequest = APILoginRequest & { __brand: 'APILoginRequest' };

/**
 * Create a branded APILoginRequest instance
 */
export function createBrandedAPILoginRequest(data: APILoginRequest): BrandedAPILoginRequest {
  return data as BrandedAPILoginRequest;
}
/**
 * Runtime type guard for APILoginRequest
 */
export function isAPILoginRequest(value: unknown): value is APILoginRequest {
  return APILoginRequestSchema.safeParse(value).success;
}

export interface APILoginResponse {
  token: string;
}



/**
 * Zod validation schema for APILoginResponse
 */
export const APILoginResponseSchema = z.object({
  token: z.string()
}).strict();

/**
 * Validate APILoginResponse data with detailed error reporting
 */
export function validateAPILoginResponse(data: unknown): { success: true; data: APILoginResponse } | { success: false; errors: string[] } {
  const result = APILoginResponseSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APILoginResponse data with exception on validation failure
 */
export function parseAPILoginResponse(data: unknown): APILoginResponse {
  return APILoginResponseSchema.parse(data);
}
/**
 * Branded type for APILoginResponse with compile-time guarantees
 */
export type BrandedAPILoginResponse = APILoginResponse & { __brand: 'APILoginResponse' };

/**
 * Create a branded APILoginResponse instance
 */
export function createBrandedAPILoginResponse(data: APILoginResponse): BrandedAPILoginResponse {
  return data as BrandedAPILoginResponse;
}
/**
 * Runtime type guard for APILoginResponse
 */
export function isAPILoginResponse(value: unknown): value is APILoginResponse {
  return APILoginResponseSchema.safeParse(value).success;
}

export interface APIFileUploadResponse {
  fileId: string;
  url: string;
}



/**
 * Zod validation schema for APIFileUploadResponse
 */
export const APIFileUploadResponseSchema = z.object({
  file_id: z.string(),
  url: z.string()
}).strict().transform((val) => ({
  fileId: val["file_id"]
}));

/**
 * Validate APIFileUploadResponse data with detailed error reporting
 */
export function validateAPIFileUploadResponse(data: unknown): { success: true; data: APIFileUploadResponse } | { success: false; errors: string[] } {
  const result = APIFileUploadResponseSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIFileUploadResponse data with exception on validation failure
 */
export function parseAPIFileUploadResponse(data: unknown): APIFileUploadResponse {
  return APIFileUploadResponseSchema.parse(data);
}
/**
 * Branded type for APIFileUploadResponse with compile-time guarantees
 */
export type BrandedAPIFileUploadResponse = APIFileUploadResponse & { __brand: 'APIFileUploadResponse' };

/**
 * Create a branded APIFileUploadResponse instance
 */
export function createBrandedAPIFileUploadResponse(data: APIFileUploadResponse): BrandedAPIFileUploadResponse {
  return data as BrandedAPIFileUploadResponse;
}
/**
 * Runtime type guard for APIFileUploadResponse
 */
export function isAPIFileUploadResponse(value: unknown): value is APIFileUploadResponse {
  return APIFileUploadResponseSchema.safeParse(value).success;
}