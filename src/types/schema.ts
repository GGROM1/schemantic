/**
 * OpenAPI Schema Object definitions
 * These types represent the JSON Schema structure used within OpenAPI specifications
 */

import { OpenAPISchemaObject, OpenAPIRef } from './openapi';

export type OpenAPISchemaType = 
  | 'string' 
  | 'number' 
  | 'integer' 
  | 'boolean' 
  | 'array' 
  | 'object' 
  | 'null';

export interface OpenAPIDiscriminator {
  propertyName: string;
  mapping?: Record<string, string>;
}

export interface OpenAPIXML {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

// OpenAPIRef and OpenAPIExternalDocumentation are now defined in openapi.ts

/**
 * Extended schema types for type generation
 */
export interface ExtendedSchemaObject extends OpenAPISchemaObject {
  // Custom properties for type generation
  _generatedTypeName?: string;
  _isGenerated?: boolean;
  _isArray?: boolean;
  _isOptional?: boolean;
  _isNullable?: boolean;
  _isUnion?: boolean;
  _isIntersection?: boolean;
  _isStrictType?: boolean;
  _baseType?: string;
  _genericTypes?: string[];
  _validationMetadata?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    format?: string;
  };
}

/**
 * Schema reference resolution utilities
 */
export type SchemaReference = string;
export type ResolvedSchema = OpenAPISchemaObject | OpenAPIRef | ExtendedSchemaObject;
export type SchemaResolver = (ref: SchemaReference) => ResolvedSchema | undefined;

/**
 * Type guards for schema objects
 */
export function isOpenAPIRef(schema: ResolvedSchema): schema is OpenAPIRef {
  return typeof schema === 'object' && schema !== null && '$ref' in schema;
}

export function isExtendedSchemaObject(schema: ResolvedSchema): schema is ExtendedSchemaObject {
  return typeof schema === 'object' && schema !== null && !('$ref' in schema);
}

export function isOpenAPISchemaObject(schema: ResolvedSchema): schema is OpenAPISchemaObject {
  return typeof schema === 'object' && schema !== null && !('$ref' in schema);
}

/**
 * Common schema patterns for FastAPI
 */
export interface FastAPISchemaPatterns {
  datetime: string;
  uuid: string;
  email: string;
  url: string;
  date: string;
  time: string;
  password: string;
  binary: string;
  file: string;
}
