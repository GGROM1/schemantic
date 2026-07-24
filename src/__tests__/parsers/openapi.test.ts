/**
 * Tests for the OpenAPI parser
 */

import { OpenAPIParser } from "../../parsers/openapi";
import { TypeSyncConfig } from "../../types/core";
import { OpenAPISchema, OpenAPIInfo } from "../../types/openapi";
import { isOpenAPISchemaObject } from "../../types/schema";
import { createTestConfig } from "../test-config";

describe("OpenAPIParser", () => {
  const createConfig = (): TypeSyncConfig =>
    createTestConfig({
      outputDir: "./test-output",
    });

  const validSchema: OpenAPISchema = {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
      description: "A test API",
    },
    paths: {
      "/users": {
        get: {
          operationId: "getUsers",
          responses: {
            "200": {
              description: "List of users",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
          },
          required: ["id", "email"],
        },
      },
    },
  };

  describe("constructor", () => {
    it("should create instance with config", () => {
      const config = createConfig();
      const parser = new OpenAPIParser(config);

      expect(parser).toBeInstanceOf(OpenAPIParser);
    });
  });

  describe("parse", () => {
    let parser: OpenAPIParser;

    beforeEach(() => {
      parser = new OpenAPIParser(createConfig());
    });

    it("should parse valid schema from data", async () => {
      const result = await parser.parse({ data: validSchema });

      expect(result).toEqual(validSchema);
    });

    it("should parse valid schema from string", async () => {
      const schemaString = JSON.stringify(validSchema);
      const result = await parser.parse({ string: schemaString });

      expect(result).toEqual(validSchema);
    });

    it("should throw error for invalid input", async () => {
      await expect(parser.parse({})).rejects.toThrow(
        "No valid input source provided"
      );
    });

    it("should throw error for invalid JSON", async () => {
      await expect(parser.parse({ string: "invalid json" })).rejects.toThrow();
    });

    it("should throw error for invalid schema structure", async () => {
      const invalidSchema = { invalid: "structure" };

      await expect(parser.parse({ data: invalidSchema })).rejects.toThrow();
    });
  });

  describe("validate", () => {
    let parser: OpenAPIParser;

    beforeEach(() => {
      parser = new OpenAPIParser(createConfig());
    });

    it("should validate valid schema", async () => {
      const result = await parser.validate(validSchema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate an OpenAPI 3.1 social API schema", async () => {
      const socialSchema: OpenAPISchema = {
        openapi: "3.1.0",
        info: {
          title: "Xquik Social API Fixture",
          version: "1.0.0",
        },
        servers: [{ url: "https://xquik.com" }],
        security: [{ apiKey: [] }],
        paths: {
          "/api/v1/x/tweets/search": {
            get: {
              operationId: "searchTweets",
              parameters: [
                {
                  name: "q",
                  in: "query",
                  required: true,
                  schema: { type: "string" },
                },
                {
                  name: "limit",
                  in: "query",
                  schema: {
                    type: "integer",
                    minimum: 1,
                    maximum: 100,
                    default: 20,
                  },
                },
                {
                  name: "X-API-Key",
                  in: "header",
                  required: true,
                  schema: { type: "string" },
                },
              ],
              responses: {
                "200": {
                  description: "Tweet search response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/SearchTweetsResponse",
                      },
                    },
                  },
                },
              },
            },
          },
          "/api/v1/x/tweets/{tweetId}/reply": {
            post: {
              operationId: "replyToTweet",
              parameters: [
                {
                  name: "tweetId",
                  in: "path",
                  required: true,
                  schema: { type: "string" },
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ReplyRequest" },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Created reply",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/Tweet" },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          securitySchemes: {
            apiKey: {
              type: "apiKey",
              in: "header",
              name: "X-API-Key",
            },
          },
          schemas: {
            SearchTweetsResponse: {
              type: "object",
              required: ["data"],
              properties: {
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Tweet" },
                },
                nextCursor: { type: "string" },
              },
            },
            Tweet: {
              type: "object",
              required: ["id", "text", "authorUsername"],
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                authorUsername: { type: "string" },
              },
            },
            ReplyRequest: {
              type: "object",
              required: ["text"],
              properties: {
                text: { type: "string", maxLength: 280 },
              },
            },
          },
        },
      };

      const result = await parser.validate(socialSchema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect unsupported OpenAPI version", async () => {
      const invalidSchema = {
        ...validSchema,
        openapi: "2.0.0", // Unsupported version
      };

      const result = await parser.validate(invalidSchema as OpenAPISchema);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "UNSUPPORTED_VERSION")
      ).toBe(true);
    });

    it("should detect missing required fields", async () => {
      const invalidSchema = {
        openapi: "3.0.0",
        // Missing info and paths
      } as OpenAPISchema;

      const result = await parser.validate(invalidSchema as OpenAPISchema);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "MISSING_REQUIRED_FIELD")
      ).toBe(true);
    });

    it("should detect missing info fields", async () => {
      const invalidSchema = {
        ...validSchema,
        info: {
          // Missing title and version
        } as OpenAPIInfo,
      };

      const result = await parser.validate(invalidSchema as OpenAPISchema);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "MISSING_REQUIRED_FIELD")
      ).toBe(true);
    });

    it("should detect invalid paths", async () => {
      const invalidSchema = {
        ...validSchema,
        paths: {
          "/invalid": null, // Invalid path item
        },
      };

      const result = await parser.validate(
        invalidSchema as unknown as OpenAPISchema
      );

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "INVALID_PATH_ITEM")
      ).toBe(true);
    });

    it("should detect missing operation responses", async () => {
      const invalidSchema = {
        ...validSchema,
        paths: {
          "/users": {
            get: {
              operationId: "getUsers",
              // Missing responses
            },
          },
        },
      };

      const result = await parser.validate(
        invalidSchema as unknown as OpenAPISchema
      );

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "MISSING_RESPONSES")
      ).toBe(true);
    });

    it("should detect invalid parameters", async () => {
      const invalidSchema = {
        ...validSchema,
        paths: {
          "/users": {
            get: {
              operationId: "getUsers",
              parameters: [
                {
                  // Missing required fields
                },
              ],
              responses: {
                "200": {
                  description: "OK",
                },
              },
            },
          },
        },
      };

      const result = await parser.validate(
        invalidSchema as unknown as OpenAPISchema
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid schemas", async () => {
      const invalidSchema = {
        ...validSchema,
        components: {
          schemas: {
            User: null, // Invalid schema
          },
        },
      };

      const result = await parser.validate(
        invalidSchema as unknown as OpenAPISchema
      );

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.code === "INVALID_SCHEMA")
      ).toBe(true);
    });
  });

  describe("createResolver", () => {
    let parser: OpenAPIParser;

    beforeEach(() => {
      parser = new OpenAPIParser(createConfig());
    });

    it("should create resolver for valid schema", () => {
      const resolver = parser.createResolver(validSchema);

      expect(typeof resolver).toBe("function");
    });

    it("should resolve schema references", () => {
      const resolver = parser.createResolver(validSchema);

      const userSchema = resolver("#/components/schemas/User");

      expect(userSchema).toBeDefined();
      if (userSchema && isOpenAPISchemaObject(userSchema)) {
        expect(userSchema.type).toBe("object");
        expect(userSchema.properties?.id).toBeDefined();
      }
    });

    it("should return undefined for invalid references", () => {
      const resolver = parser.createResolver(validSchema);

      const result = resolver("#/components/schemas/NonExistent");

      expect(result).toBeUndefined();
    });

    it("should return undefined for external references", () => {
      const resolver = parser.createResolver(validSchema);

      const result = resolver("http://external.com/schema#/definitions/User");

      expect(result).toBeUndefined();
    });
  });

  describe("getMetadata", () => {
    let parser: OpenAPIParser;

    beforeEach(() => {
      parser = new OpenAPIParser(createConfig());
    });

    it("should return metadata", () => {
      const metadata = parser.getMetadata();

      expect(metadata.name).toBe("OpenAPI Parser");
      expect(metadata.version).toBe("1.0.0");
      expect(metadata.supportedFormats).toContain("json");
      expect(metadata.supportedVersions).toContain("3.0.0");
      expect(metadata.description).toContain("OpenAPI");
    });
  });
});
