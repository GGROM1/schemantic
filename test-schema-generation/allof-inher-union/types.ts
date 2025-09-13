import { z } from 'zod';

export interface APIBasePet {
  id: number;
  name: string;
  age?: number | undefined;
}



/**
 * Zod validation schema for APIBasePet
 */
export const APIBasePetSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  age: z.number().int().optional()
}).strict();

/**
 * Validate APIBasePet data with detailed error reporting
 */
export function validateAPIBasePet(data: unknown): { success: true; data: APIBasePet } | { success: false; errors: string[] } {
  const result = APIBasePetSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIBasePet data with exception on validation failure
 */
export function parseAPIBasePet(data: unknown): APIBasePet {
  return APIBasePetSchema.parse(data);
}
/**
 * Branded type for APIBasePet with compile-time guarantees
 */
export type BrandedAPIBasePet = APIBasePet & { __brand: 'APIBasePet' };

/**
 * Create a branded APIBasePet instance
 */
export function createBrandedAPIBasePet(data: APIBasePet): BrandedAPIBasePet {
  return data as BrandedAPIBasePet;
}
/**
 * Runtime type guard for APIBasePet
 */
export function isAPIBasePet(value: unknown): value is APIBasePet {
  return APIBasePetSchema.safeParse(value).success;
}