/**
 * Main entry point for the type-sync package
 * Exports all public APIs and utilities
 */

// Core functionality
export * from './core';

// Type definitions
export * from './types';

// Parsers
export * from './parsers';

// Generators
export * from './generators';

// Plugins
export * from './plugins';

// CLI exports
export * from './cli';

// Re-export commonly used types and utilities
export { TypeSync } from './core/typesync';
export { TypeSyncConfig, DEFAULT_CONFIG } from './types/core';
export { OpenAPISchema } from './types/openapi';
export { TypeSyncPlugin } from './types/core';
