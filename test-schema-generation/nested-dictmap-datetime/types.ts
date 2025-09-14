import { z } from 'zod';

export interface APIReport {
  id: string;
  createdAt: string;
  metadata?: Record<string, string> | undefined;
  entries: APIEntry[];
}



/**
 * Zod validation schema for APIReport
 */
export const APIReportSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  metadata: z.object({}).optional(),
  entries: z.array(APIEntrySchema)
}).strict().transform((val) => ({
  id: val["id"],
  createdAt: val["created_at"],
  metadata: val["metadata"],
  entries: val["entries"]
}));

/**
 * Validate APIReport data with detailed error reporting
 */
export function validateAPIReport(data: unknown): { success: true; data: APIReport } | { success: false; errors: string[] } {
  const result = APIReportSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIReport data with exception on validation failure
 */
export function parseAPIReport(data: unknown): APIReport {
  return APIReportSchema.parse(data);
}
/**
 * Branded type for APIReport with compile-time guarantees
 */
export type BrandedAPIReport = APIReport & { __brand: 'APIReport' };

/**
 * Create a branded APIReport instance
 */
export function createBrandedAPIReport(data: APIReport): BrandedAPIReport {
  return data as BrandedAPIReport;
}
/**
 * Runtime type guard for APIReport
 */
export function isAPIReport(value: unknown): value is APIReport {
  return APIReportSchema.safeParse(value).success;
}

export interface APIEntry {
  value?: number | undefined;
  tags?: string[] | undefined;
  subentries?: APISubEntry[] | undefined;
}



/**
 * Zod validation schema for APIEntry
 */
export const APIEntrySchema = z.object({
  value: z.number().optional(),
  tags: z.array(z.string()).optional(),
  subentries: z.array(APISubEntrySchema).optional()
}).strict().transform((val) => ({
  value: val["value"],
  tags: val["tags"],
  subentries: val["subentries"]
}));

/**
 * Validate APIEntry data with detailed error reporting
 */
export function validateAPIEntry(data: unknown): { success: true; data: APIEntry } | { success: false; errors: string[] } {
  const result = APIEntrySchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APIEntry data with exception on validation failure
 */
export function parseAPIEntry(data: unknown): APIEntry {
  return APIEntrySchema.parse(data);
}
/**
 * Branded type for APIEntry with compile-time guarantees
 */
export type BrandedAPIEntry = APIEntry & { __brand: 'APIEntry' };

/**
 * Create a branded APIEntry instance
 */
export function createBrandedAPIEntry(data: APIEntry): BrandedAPIEntry {
  return data as BrandedAPIEntry;
}
/**
 * Runtime type guard for APIEntry
 */
export function isAPIEntry(value: unknown): value is APIEntry {
  return APIEntrySchema.safeParse(value).success;
}

export interface APISubEntry {
  label?: string | undefined;
  dataPoints?: {
  timestamp: string;
  value: number;
}[] | undefined;
}



/**
 * Zod validation schema for APISubEntry
 */
export const APISubEntrySchema = z.object({
  label: z.string().optional(),
  data_points: z.array(z.object({
  timestamp: z.string().datetime(),
  value: z.number()
}).strict().transform((val) => ({
  timestamp: val["timestamp"],
  value: val["value"]
}))).optional()
}).strict().transform((val) => ({
  label: val["label"],
  dataPoints: val["data_points"]
}));

/**
 * Validate APISubEntry data with detailed error reporting
 */
export function validateAPISubEntry(data: unknown): { success: true; data: APISubEntry } | { success: false; errors: string[] } {
  const result = APISubEntrySchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Parse APISubEntry data with exception on validation failure
 */
export function parseAPISubEntry(data: unknown): APISubEntry {
  return APISubEntrySchema.parse(data);
}
/**
 * Branded type for APISubEntry with compile-time guarantees
 */
export type BrandedAPISubEntry = APISubEntry & { __brand: 'APISubEntry' };

/**
 * Create a branded APISubEntry instance
 */
export function createBrandedAPISubEntry(data: APISubEntry): BrandedAPISubEntry {
  return data as BrandedAPISubEntry;
}
/**
 * Runtime type guard for APISubEntry
 */
export function isAPISubEntry(value: unknown): value is APISubEntry {
  return APISubEntrySchema.safeParse(value).success;
}