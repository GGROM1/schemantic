import { z } from 'zod';

export interface APIPost {
  id: number;
  title: string;
  author: APIUser;
  tags?: string[] | undefined;
}



/**
 * Zod validation schema for APIPost
 */
export const APIPostSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  author: APIUserSchema,
  tags: z.array(z.string()).optional()
}).strict();

/**
 * Validate APIPost data with detailed error reporting
 */
export function validateAPIPost(data: unknown): { success: true; data: APIPost } | { success: false; errors: string[] } {
  const result = APIPostSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIPost data with exception on validation failure
 */
export function parseAPIPost(data: unknown): APIPost {
  return APIPostSchema.parse(data);
}
/**
 * Branded type for APIPost with compile-time guarantees
 */
export type BrandedAPIPost = APIPost & { __brand: 'APIPost' };

/**
 * Create a branded APIPost instance
 */
export function createBrandedAPIPost(data: APIPost): BrandedAPIPost {
  return data as BrandedAPIPost;
}
/**
 * Runtime type guard for APIPost
 */
export function isAPIPost(value: unknown): value is APIPost {
  return APIPostSchema.safeParse(value).success;
}

export interface APIUser {
  id: number;
  username: string;
}



/**
 * Zod validation schema for APIUser
 */
export const APIUserSchema = z.object({
  id: z.number().int(),
  username: z.string()
}).strict();

/**
 * Validate APIUser data with detailed error reporting
 */
export function validateAPIUser(data: unknown): { success: true; data: APIUser } | { success: false; errors: string[] } {
  const result = APIUserSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIUser data with exception on validation failure
 */
export function parseAPIUser(data: unknown): APIUser {
  return APIUserSchema.parse(data);
}
/**
 * Branded type for APIUser with compile-time guarantees
 */
export type BrandedAPIUser = APIUser & { __brand: 'APIUser' };

/**
 * Create a branded APIUser instance
 */
export function createBrandedAPIUser(data: APIUser): BrandedAPIUser {
  return data as BrandedAPIUser;
}
/**
 * Runtime type guard for APIUser
 */
export function isAPIUser(value: unknown): value is APIUser {
  return APIUserSchema.safeParse(value).success;
}

export interface APIPostListResponse {
  items: APIPost[];
  total: number;
}



/**
 * Zod validation schema for APIPostListResponse
 */
export const APIPostListResponseSchema = z.object({
  items: z.array(APIPostSchema),
  total: z.number().int()
}).strict();

/**
 * Validate APIPostListResponse data with detailed error reporting
 */
export function validateAPIPostListResponse(data: unknown): { success: true; data: APIPostListResponse } | { success: false; errors: string[] } {
  const result = APIPostListResponseSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIPostListResponse data with exception on validation failure
 */
export function parseAPIPostListResponse(data: unknown): APIPostListResponse {
  return APIPostListResponseSchema.parse(data);
}
/**
 * Branded type for APIPostListResponse with compile-time guarantees
 */
export type BrandedAPIPostListResponse = APIPostListResponse & { __brand: 'APIPostListResponse' };

/**
 * Create a branded APIPostListResponse instance
 */
export function createBrandedAPIPostListResponse(data: APIPostListResponse): BrandedAPIPostListResponse {
  return data as BrandedAPIPostListResponse;
}
/**
 * Runtime type guard for APIPostListResponse
 */
export function isAPIPostListResponse(value: unknown): value is APIPostListResponse {
  return APIPostListResponseSchema.safeParse(value).success;
}