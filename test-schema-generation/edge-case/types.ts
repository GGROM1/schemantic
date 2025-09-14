import { z } from 'zod';

export interface APIUserResponse {
  id: number;
  name: string;
  role: APIUserRole;
  profile?: APIUserProfile | undefined;
}



/**
 * Zod validation schema for APIUserResponse
 */
export const APIUserResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  role: APIUserRoleSchema,
  profile: APIUserProfileSchema.optional()
}).strict();

/**
 * Validate APIUserResponse data with detailed error reporting
 */
export function validateAPIUserResponse(data: unknown): { success: true; data: APIUserResponse } | { success: false; errors: string[] } {
  const result = APIUserResponseSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIUserResponse data with exception on validation failure
 */
export function parseAPIUserResponse(data: unknown): APIUserResponse {
  return APIUserResponseSchema.parse(data);
}
/**
 * Branded type for APIUserResponse with compile-time guarantees
 */
export type BrandedAPIUserResponse = APIUserResponse & { __brand: 'APIUserResponse' };

/**
 * Create a branded APIUserResponse instance
 */
export function createBrandedAPIUserResponse(data: APIUserResponse): BrandedAPIUserResponse {
  return data as BrandedAPIUserResponse;
}
/**
 * Runtime type guard for APIUserResponse
 */
export function isAPIUserResponse(value: unknown): value is APIUserResponse {
  return APIUserResponseSchema.safeParse(value).success;
}

export enum APIUserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER"
}
export type APIUserRoleValues = "ADMIN" | "EDITOR" | "VIEWER";


/**
 * Zod validation schema for APIUserRole
 */
export const APIUserRoleSchema = z.enum(["ADMIN", "EDITOR", "VIEWER"]);

/**
 * Validate APIUserRole data with detailed error reporting
 */
export function validateAPIUserRole(data: unknown): { success: true; data: APIUserRole } | { success: false; errors: string[] } {
  const result = APIUserRoleSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIUserRole data with exception on validation failure
 */
export function parseAPIUserRole(data: unknown): APIUserRole {
  return APIUserRoleSchema.parse(data);
}
/**
 * Branded type for APIUserRole with compile-time guarantees
 */
export type BrandedAPIUserRole = APIUserRole & { __brand: 'APIUserRole' };

/**
 * Create a branded APIUserRole instance
 */
export function createBrandedAPIUserRole(data: APIUserRole): BrandedAPIUserRole {
  return data as BrandedAPIUserRole;
}
/**
 * Runtime type guard for APIUserRole
 */
export function isAPIUserRole(value: unknown): value is APIUserRole {
  return APIUserRoleSchema.safeParse(value).success;
}

export interface APIUserProfile {
  bio?: string | undefined;
  social?: string[] | undefined;
}



/**
 * Zod validation schema for APIUserProfile
 */
export const APIUserProfileSchema = z.object({
  bio: z.string().optional(),
  social: z.array(z.string()).optional()
}).strict();

/**
 * Validate APIUserProfile data with detailed error reporting
 */
export function validateAPIUserProfile(data: unknown): { success: true; data: APIUserProfile } | { success: false; errors: string[] } {
  const result = APIUserProfileSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIUserProfile data with exception on validation failure
 */
export function parseAPIUserProfile(data: unknown): APIUserProfile {
  return APIUserProfileSchema.parse(data);
}
/**
 * Branded type for APIUserProfile with compile-time guarantees
 */
export type BrandedAPIUserProfile = APIUserProfile & { __brand: 'APIUserProfile' };

/**
 * Create a branded APIUserProfile instance
 */
export function createBrandedAPIUserProfile(data: APIUserProfile): BrandedAPIUserProfile {
  return data as BrandedAPIUserProfile;
}
/**
 * Runtime type guard for APIUserProfile
 */
export function isAPIUserProfile(value: unknown): value is APIUserProfile {
  return APIUserProfileSchema.safeParse(value).success;
}

export interface APIBook {
  type: string;
  title: string;
  author: string;
}



/**
 * Zod validation schema for APIBook
 */
export const APIBookSchema = z.object({
  type: z.literal("book"),
  title: z.string(),
  author: z.string()
}).strict();

/**
 * Validate APIBook data with detailed error reporting
 */
export function validateAPIBook(data: unknown): { success: true; data: APIBook } | { success: false; errors: string[] } {
  const result = APIBookSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIBook data with exception on validation failure
 */
export function parseAPIBook(data: unknown): APIBook {
  return APIBookSchema.parse(data);
}
/**
 * Branded type for APIBook with compile-time guarantees
 */
export type BrandedAPIBook = APIBook & { __brand: 'APIBook' };

/**
 * Create a branded APIBook instance
 */
export function createBrandedAPIBook(data: APIBook): BrandedAPIBook {
  return data as BrandedAPIBook;
}
/**
 * Runtime type guard for APIBook
 */
export function isAPIBook(value: unknown): value is APIBook {
  return APIBookSchema.safeParse(value).success;
}

export interface APIMovie {
  type: string;
  title: string;
  director: string;
}



/**
 * Zod validation schema for APIMovie
 */
export const APIMovieSchema = z.object({
  type: z.literal("movie"),
  title: z.string(),
  director: z.string()
}).strict();

/**
 * Validate APIMovie data with detailed error reporting
 */
export function validateAPIMovie(data: unknown): { success: true; data: APIMovie } | { success: false; errors: string[] } {
  const result = APIMovieSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIMovie data with exception on validation failure
 */
export function parseAPIMovie(data: unknown): APIMovie {
  return APIMovieSchema.parse(data);
}
/**
 * Branded type for APIMovie with compile-time guarantees
 */
export type BrandedAPIMovie = APIMovie & { __brand: 'APIMovie' };

/**
 * Create a branded APIMovie instance
 */
export function createBrandedAPIMovie(data: APIMovie): BrandedAPIMovie {
  return data as BrandedAPIMovie;
}
/**
 * Runtime type guard for APIMovie
 */
export function isAPIMovie(value: unknown): value is APIMovie {
  return APIMovieSchema.safeParse(value).success;
}

export interface APIItem {
  id: number;
  data: APICreateItemRequest;
}



/**
 * Zod validation schema for APIItem
 */
export const APIItemSchema = z.object({
  id: z.number().int(),
  data: z.discriminatedUnion("type", [APIBookSchema, APIMovieSchema])
}).strict();

/**
 * Validate APIItem data with detailed error reporting
 */
export function validateAPIItem(data: unknown): { success: true; data: APIItem } | { success: false; errors: string[] } {
  const result = APIItemSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIItem data with exception on validation failure
 */
export function parseAPIItem(data: unknown): APIItem {
  return APIItemSchema.parse(data);
}
/**
 * Branded type for APIItem with compile-time guarantees
 */
export type BrandedAPIItem = APIItem & { __brand: 'APIItem' };

/**
 * Create a branded APIItem instance
 */
export function createBrandedAPIItem(data: APIItem): BrandedAPIItem {
  return data as BrandedAPIItem;
}
/**
 * Runtime type guard for APIItem
 */
export function isAPIItem(value: unknown): value is APIItem {
  return APIItemSchema.safeParse(value).success;
}