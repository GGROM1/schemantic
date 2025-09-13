/**
 * Primitive type generator for OpenAPI schema primitives
 * Handles generation of TypeScript types for basic OpenAPI schema types
 */

import { ResolvedSchema, isOpenAPISchemaObject } from "../types/schema";
import { GenerationContext, GeneratedType } from "../types/core";
import { BaseTypeGenerator, TypeGenerationOptions } from "./base";

/**
 * Primitive type generator implementation
 */
export class PrimitiveTypeGenerator extends BaseTypeGenerator {
  constructor(options: TypeGenerationOptions) {
    super(options);
  }

  generate(schema: ResolvedSchema, context: GenerationContext): GeneratedType {
    if (!isOpenAPISchemaObject(schema)) {
      throw new Error("Cannot generate primitive from reference schema");
    }

    const typeName = this.getTypeName(schema, context);
    const comment = this.generateComment(schema.description, schema.example);

    let content = "";

    if (comment) {
      content += comment + "\n";
    }

    // Generate type alias
    const typeAlias = this.generateTypeAlias(schema, typeName);
    content += typeAlias;

    return {
      name: typeName,
      content,
      dependencies: [],
      exports: [typeName],
      isInterface: false,
      isEnum: false,
      isUnion: false,
      sourceSchema: schema,
    };
  }

  canHandle(schema: ResolvedSchema): boolean {
    if (!isOpenAPISchemaObject(schema)) {
      return false;
    }

    // Handle primitive types
    if (
      schema.type &&
      typeof schema.type === "string" &&
      ["string", "number", "integer", "boolean"].includes(schema.type)
    ) {
      return true;
    }

    // Handle const values
    if (schema.const !== undefined) {
      return true;
    }

    // Handle arrays of primitives
    if (
      schema.type === "array" &&
      schema.items &&
      this.isPrimitiveSchema(schema.items)
    ) {
      return true;
    }

    return false;
  }

  getPriority(): number {
    return 50; // Lower priority than specialized generators
  }

  getMetadata() {
    return {
      name: "Primitive Type Generator",
      version: "1.0.0",
      description: "Generates TypeScript types for OpenAPI primitive types",
      supportedTypes: ["string", "number", "integer", "boolean", "array"],
      supportedFormats: ["json"],
    };
  }

  /**
   * Generate type alias
   */
  private generateTypeAlias(schema: ResolvedSchema, typeName: string): string {
    const type = this.generateType(schema);
    return `export type ${typeName} = ${type};\n`;
  }

  /**
   * Generate TypeScript type from schema
   */
  private generateType(schema: ResolvedSchema): string {
    if (!isOpenAPISchemaObject(schema)) {
      return "unknown";
    }

    // Handle const values
    if (schema.const !== undefined) {
      return JSON.stringify(schema.const);
    }

    // Handle arrays
    if (schema.type === "array") {
      const itemType = schema.items
        ? this.generateType(schema.items)
        : "unknown";
      return `${itemType}[]`;
    }

    // Handle basic types
    if (schema.type) {
      return this.mapSchemaTypeToTypeScript(schema.type, schema.format);
    }

    return "unknown";
  }

  /**
   * Check if schema is a primitive type
   */
  private isPrimitiveSchema(schema: ResolvedSchema): boolean {
    if (!isOpenAPISchemaObject(schema)) {
      return false;
    }

    if (
      schema.type &&
      typeof schema.type === "string" &&
      ["string", "number", "integer", "boolean"].includes(schema.type)
    ) {
      return true;
    }

    if (schema.const !== undefined) {
      return true;
    }

    return false;
  }

  /**
   * Get type name from schema
   */
  private getTypeName(
    schema: ResolvedSchema,
    context: GenerationContext
  ): string {
    // Check if type name is already set
    if ("_generatedTypeName" in schema && schema._generatedTypeName) {
      return this.formatTypeName(schema._generatedTypeName as string);
    }

    // Try to extract from title
    if (isOpenAPISchemaObject(schema) && schema.title) {
      return this.formatTypeName(schema.title);
    }

    // Generate from context if available
    if (context && context.typeRegistry) {
      const existingTypes = context.typeRegistry.getAllTypes();
      let counter = 1;
      let baseName = "GeneratedPrimitive";

      while (
        existingTypes.some(
          (t) => t.name === baseName + (counter > 1 ? counter : "")
        )
      ) {
        counter++;
      }

      return baseName + (counter > 1 ? counter : "");
    }

    // Fallback
    return "GeneratedPrimitive";
  }
}
