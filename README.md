# Type-Sync

A fully typed, extensible, modular TypeScript type generator for OpenAPI schemas (great with FastAPI). Generate TypeScript types, API clients, and optional hooks with sensible defaults.

## Features

- 🔧 **Zero Configuration** - Works out of the box with FastAPI applications
- 🎯 **Fully Typed** - Generates comprehensive TypeScript types with no `any` types
- 🧩 **Modular Architecture** - Extensible plugin system for custom generators
- 🚀 **Fast & Efficient** - Optimized for large schemas and complex APIs
- 📦 **Multiple Outputs** - Types, API clients, React hooks, and more
- 🔍 **Schema Validation** - Built-in OpenAPI schema validation
- 🎨 **Customizable** - Flexible naming conventions and type mappings
- 📚 **Well Documented** - Comprehensive documentation and examples

## Installation

```bash
npm install type-sync
```

## Quick Start

### CLI Usage

Generate types and API client from your OpenAPI schema:

```bash
# From URL (recommended)
npx type-sync generate --url http://localhost:8000/openapi.json --output ./src/generated

# From file (local snapshot)
npx type-sync generate --file ./schema.json --output ./src/generated

# With custom options
npx type-sync generate \
  --url http://localhost:8000/openapi.json \
  --output ./src/generated \
  --naming camelCase \
  --prefix API \
  --suffix Type
```

### Programmatic Usage

```typescript
import { TypeSync, TypeSyncConfig } from "type-sync";

const config: TypeSyncConfig = {
  schemaUrl: "http://localhost:8000/openapi.json",
  outputDir: "./src/generated",
  generateTypes: true,
  generateApiClient: true,
  useStrictTypes: true,
  namingConvention: "camelCase",
};

const typeSync = new TypeSync(config);
const result = await typeSync.generate();

if (result.success) {
  console.log(`Generated ${result.generatedFiles.length} files`);
  console.log(`Types: ${result.statistics.totalTypes}`);
  console.log(`Endpoints: ${result.statistics.totalEndpoints}`);
}
```

## Configuration

### Basic Configuration

```typescript
const config: TypeSyncConfig = {
  // Input sources (choose one)
  schemaUrl: "http://localhost:8000/openapi.json",
  schemaFile: "./schema.json",
  schemaData: {
    /* OpenAPI schema object */
  },

  // Output configuration
  outputDir: "./src/generated",
  outputFileName: "api-client.ts",

  // Generation options
  generateTypes: true,
  generateApiClient: true,
  generateHooks: false,

  // TypeScript configuration
  useStrictTypes: true,
  useOptionalChaining: true,
  useNullishCoalescing: true,

  // Naming conventions
  namingConvention: "camelCase", // 'camelCase' | 'snake_case' | 'PascalCase'
  // By default, TypeSync prefixes type names with "API". Customize if desired:
  typePrefix: "API",
  typeSuffix: "Type",

  // Customization
  customTypeMappings: {
    uuid: "string",
    datetime: "Date",
  },

  // Filtering
  excludePaths: ["/health", "/docs"],
  includePaths: ["/api/v1/*"],
  excludeSchemas: ["Error"],
  includeSchemas: ["User", "Product"],

  // Plugin configuration
  plugins: [
    { name: "jsdoc", enabled: true },
    { name: "validation", enabled: true },
  ],
};
```

### CLI Options

```bash
# Input options
--url, -u <url>              OpenAPI schema URL
--file, -f <file>            OpenAPI schema file path

# Output options
--output, -o <dir>           Output directory (default: generated)

# Generation options
--types                      Generate types only
--client                     Generate API client only
--hooks                      Generate React hooks

# TypeScript options
--strict                     Use strict TypeScript types (default: true)
--naming <convention>        Naming convention (camelCase|snake_case|PascalCase)

# Customization
--prefix <prefix>            Type name prefix
--suffix <suffix>            Type name suffix
--exclude-paths <paths>      Exclude paths (comma-separated)
--include-paths <paths>      Include paths (comma-separated)
--exclude-schemas <schemas>  Exclude schemas (comma-separated)
--include-schemas <schemas>  Include schemas (comma-separated)

# Plugin options
--plugins <plugins>          Enable plugins (comma-separated)
--config <file>              Configuration file path

# Global options
--verbose, -v                Verbose output
--quiet, -q                  Quiet output
--no-color                   Disable colored output
```

## Generated Output

### Types

```typescript
// Generated from OpenAPI schema
export interface APIUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface APICreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface APIUpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export enum APIUserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}
```

### API Client

```typescript
// Actual name is derived from your API title; example below shows a generic name.
export class MyApiApiClient {
  private baseUrl: string;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  async getUsers(): Promise<APIUser[]> {
    const url = new URL(`${this.baseUrl}/users`);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...this.config.headers,
      },
    });

    if (!response.ok) {
      throw new ApiClientError(
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    return response.json();
  }

  async createUser(body: APICreateUserRequest): Promise<APIUser> {
    const url = new URL(`${this.baseUrl}/users`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        ...this.config.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ApiClientError(
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    return response.json();
  }
}
```

## Plugin System

Type-Sync includes a powerful plugin system for extending functionality:

### Built-in Plugins

- **jsdoc** - Adds JSDoc comments to generated types
- **validation** - Adds validation decorators for class-validator
- **react-hooks** - Generates React hooks for API endpoints
- **strict-mode** - Adds TypeScript strict mode enhancements

### Using Plugins

```typescript
// Enable plugins via configuration
const config: TypeSyncConfig = {
  // ... other config
  plugins: [
    { name: 'jsdoc', enabled: true },
    { name: 'validation', enabled: true },
    { name: 'react-hooks', enabled: true },
  ],
};

// Or via CLI
npx type-sync generate --plugins jsdoc,validation,react-hooks
```

### Creating Custom Plugins

```typescript
import { TypeSyncPlugin, GenerationContext, GeneratedType } from "type-sync";

const customPlugin: TypeSyncPlugin = {
  name: "custom-plugin",
  version: "1.0.0",
  description: "Custom plugin for special transformations",

  beforeTypeGeneration: async (
    typeName: string,
    schema: any,
    context: GenerationContext
  ) => {
    // Transform schema before generation
    console.log(`Generating type: ${typeName}`);
  },

  afterTypeGeneration: async (
    typeName: string,
    generatedType: GeneratedType,
    context: GenerationContext
  ) => {
    // Modify generated type
    generatedType.content = `// Custom comment\n${generatedType.content}`;
  },

  transformSchema: (schema: any, context: GenerationContext) => {
    // Transform schema
    return schema;
  },

  customTypeGenerators: {
    "custom-type": (schema: any, context: GenerationContext) => {
      // Custom type generator
      return {
        name: "CustomType",
        content: "export type CustomType = string;",
        dependencies: [],
        exports: ["CustomType"],
        isInterface: false,
        isEnum: false,
        isUnion: false,
        sourceSchema: schema,
      };
    },
  },
};
```

## FastAPI Integration

### Basic FastAPI Setup

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="My API",
    description="API description",
    version="1.0.0",
)

class User(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    created_at: str
    updated_at: str

class CreateUserRequest(BaseModel):
    email: str
    first_name: str
    last_name: str

@app.get("/users", response_model=List[User])
async def get_users():
    # Your implementation
    pass

@app.post("/users", response_model=User)
async def create_user(user: CreateUserRequest):
    # Your implementation
    pass
```

### Generate Types

```bash
# Start your FastAPI server
uvicorn main:app --reload

# Generate types
npx type-sync generate --url http://localhost:8000/openapi.json --output ./src/generated
```

## Advanced Usage

### Custom Type Mappings

```typescript
const config: TypeSyncConfig = {
  // ... other config
  customTypeMappings: {
    uuid: "string",
    datetime: "Date",
    decimal: "number",
    email: "string",
  },
};
```

### Path and Schema Filtering

```typescript
const config: TypeSyncConfig = {
  // ... other config
  excludePaths: ["/health", "/docs", "/redoc"],
  includePaths: ["/api/v1/*"],
  excludeSchemas: ["Error", "ValidationError"],
  includeSchemas: ["User", "Product", "Order"],
};
```

### Configuration Files

Create a `type-sync.config.json` file:

```json
{
  "schemaUrl": "http://localhost:8000/openapi.json",
  "outputDir": "./generated",
  "generateTypes": true,
  "generateApiClient": true,
  "useStrictTypes": true,
  "namingConvention": "camelCase",
  "plugins": [
    { "name": "jsdoc", "enabled": true },
    { "name": "validation", "enabled": true }
  ]
}
```

Use with CLI:

```bash
npx type-sync generate --config type-sync.config.json
```

## Validation

Validate your OpenAPI schema before generation:

```bash
# Validate schema
npx type-sync validate --url http://localhost:8000/openapi.json

# Validate with verbose output
npx type-sync validate --file schema.json --verbose
```

## Examples

### React Application

```typescript
// Import from the generated index barrel
import { MyApiApiClient } from "./generated";
import type { APIUser } from "./generated";

const apiClient = new MyApiApiClient({
  baseUrl: "http://localhost:8000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Use in React component
const UsersPage = () => {
  const [users, setUsers] = useState<APIUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await apiClient.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.firstName} {user.lastName} - {user.email}
        </div>
      ))}
    </div>
  );
};
```

### Node.js Application

```typescript
import { MyApiApiClient } from "./generated";

const apiClient = new MyApiApiClient({
  baseUrl: "http://localhost:8000",
});

// Use in Node.js application
const main = async () => {
  try {
    const users = await apiClient.getUsers();
    console.log("Users:", users);

    const newUser = await apiClient.createUser({
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    });
    console.log("Created user:", newUser);
  } catch (error) {
    console.error("API error:", error);
  }
};

main();
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/type-sync.git
cd type-sync

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-org/type-sync/wiki)
- 🐛 [Issue Tracker](https://github.com/your-org/type-sync/issues)
- 💬 [Discussions](https://github.com/your-org/type-sync/discussions)
- 📧 [Email Support](mailto:support@example.com)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.
