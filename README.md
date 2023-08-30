# Project specified requirements/conventions

Both new and current team members working on this project should apply the following suggestions as much as possible

> Code style consistency is no trivial to maintain and improve code base quality

## I. Awareness of project-wide changes

> All members must be made aware of any changes made or newly added

- Packages
  1. Prefer `yarn`
  2. To see if it is necessary, may there be better approach/work around for such issue

## II. Files/Directories

### a. Module

- Structure of module in a folder (! = mandatory , ? = optional, ?! = mandatory if have many file)

  ```ts
    a-mod
    |
    |__!index.ts // to export everything
    |            // module, constants, dto, services, controllers...
    |__!a-mod.module.ts
    |
    |__?!services
    |  |
    |  |__?one.service.ts
    |  |
    |  |__?two.service.ts
    |
    |__?!controllers
    |  |
    |  |__?alpha.controller.ts
    |  |
    |  |__?beta.controller.ts
    |
    |__?a-mod.interfaces.ts
    |
    |__?!dto
    |  |
    |  |__?hex.dto.ts
    |  |
    |  |__?bin.dto.ts
    |
    |__?a-mod.enum.ts
    |
    |__?a-mod.constants.ts
    |__...

  ```

### b. Structure

- Structure of folder (! = mandatory , ? = optional, ?! = mandatory if have many file)

  ```ts
    apps // Service Folder
    |
    |__gateway // Module Gateway
    |
    |__serviceB // Module Service A
    |
    |__serviceC // Module Service B
    |
    libs
    |
    |__common // Folder for common usage
    |  |
    |  |__constants
    |  |  |
    |  |  |__!database.constant.ts // Database config constants
    |  |
    |  |__enums
    |  |  |
    |  |  |__!database-config.enum.ts // Database config enums
    |  |
    |  |__interfaces
    |  |
    |  |__types
    |  |
    |  |__index.ts // Export everything in folder
    |
    |__config // Folder config/env
    |  |
    |  |__envs // Folder env
    |  |
    |  |__configuration.ts // Export config from env
    |  |
    |  |__index.ts // Export everything in folder
    |
    |__core // Folder integrate, service communication
    |  |
    |  |__database
    |     |
    |     |__postgres // SQL database
    |     |  |
    |     |  |__entities // entities folder
    |     |  |
    |     |  |__migrations // migrations folder
    |     |  |
    |     |  |__index.ts // export everything from folder
    |     |  |
    |     |  |__ormconfig.ts // Config file to specific DataSource for migrating database
    |     |
    |     |__mongo // NoSQL database
    |
    |  |__message-handler
    |  |
    |  |__index.ts // Export everything in folder
    |
    |__utils // Folder utilities, common module/middleware usage
    |  |
    |  |__helpers
    |  |
    |  |__middlewares
    |  |
    |  |__modules
    |  |
    |  |__index.ts // Export everything in folder
  ```

## III. Code style conventions

- Prefer:
  - variable: Camel Case
  - class: Pascal Case

### a. Naming

<details>
<summary>
  Constants
</summary>

```ts
// ⛔️ AVOID
const constants = {
  constantA: {
    constantA1: 'a1',
    constantsA2: 'a2',
  },
  constantB: 'b',
};

// ⛔️ AVOID
const constants = {
  constantA: {
    CONSTANT_A1: 'a1',
    CONSTANT_A1: 'a2',
  },
  CONSTANT_B: 'b',
};

// ✅ PREFERRED
const CONSTANTS = {
  CONSTANT_A: {
    CONSTANT_A1: 'a1',
    CONSTANT_A2: 'a2',
  },
  CONSTANT_B: 'b',
};
```

</details>

<details>
<summary>
  Enums
</summary>

```ts
// ⛔️ AVOID
const USER_RESPONSE = {
  No = 0,
  Yes = 1,
};

// ⛔️ AVOID
enum user_response {
  No = 0,
  Yes = 1,
}

// ⛔️ AVOID
enum user_response {
  No = 'No',
  Yes = 'Yes,
}

// ✅ PREFERRED
enum UserResponse {
  No = 0,
  Yes = 1,
}

// ✅ PREFERRED
enum UserResponse {
  No = 'NO',
  Yes = 'YES',
}
```

</details>

<details>
<summary>
  Interface
</summary>

```ts
// ⛔️ AVOID
interface InterfaceData {
  fieldA: string;
  fieldB: number;
}

// ✅ PREFERRED
interface IData {
  fieldA: string;
  fieldB: number;
}
```

</details>

<details>
<summary>
  DTO
</summary>

```ts
// ⛔️ AVOID
class DataValidate {
  fieldA: string;
  fieldB: number;
}

// ✅ PREFERRED
class DataDto implements IData {
  fieldA: string;
  fieldB: number;
}
```

</details>

<details>
<summary>
  Function
</summary>

```ts
// ⛔️ AVOID
function DataValidate {
  // do something
}

// ✅ PREFERRED
// Start with action name
function validateData {
  // do something
}
```

</details>

<details>
<summary>
  Message Pattern
</summary>

```ts
// ⛔️ AVOID
const cmd = 'get.user';

// ⛔️ AVOID
const cmd = 'get-user';

// ✅ PREFERRED
const cmd = 'user.<method name>';
```

</details>

### b. Spacing

```json
{
  "editor.tabSize": 2
}
```

### c. Type/Interface

- Prefer use interface
- Avoid using any type, use unknown instead

### d. Error handler

- Throw error at sub function which used in main function

```ts
function funcA<T>(arguments:unknown): T {
  try {
   // do something
  } catch (error) {
    throw new HttpException(
      error?.message || null,
      error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
```

- Return error object at main function

```ts
function funcA<T>(arguments:unknown): T {
  try {
   // do something
  } catch (error) {
    const errorObject = new GatewayError(error);
    return errorObject.getErrorInstance();
  }
}
```

## IV. Commitlint Rules

<details>
<summary>
  Commitlint Usage Guidelines
</summary>

- We use Commitlint to adhere to the commit message convention.
- A valid commit message must start with a commit type (e.g., `feat: [task-jira]`, `fix: [task-jira]`) followed by a colon and a space.
- Example: `feat: [AD-165] Add new feature`.
- We use common types like `feat`, `fix`, `docs`, `chore`, etc.
- Please refer to the Commitlint documentation for more details on the rules and how to configure them.

Documentation Link: [Commitlint Documentation](https://commitlint.js.org/#/)

</details>

## V. Setup

### a. Setup environment

- Create file `.env` as `.env.example`

**Note: Jwt expired must set by day value**

### b. Installation

- Ref:

```json
"engines": {
    "node": ">= ~16",
    "yarn": ">= 1",
  },
```

- Command:

```bash
$ yarn install
```

### c. Running the app

- Init database if not exists
  - Run docker-compose file to init database and dependencies

- Run migrations for init database table
  - Command
```bash
$ yarn run typeorm migration:run -- -d <path to file database ormconfig.ts>
```

- Run command generate migration if needed
```bash
$ yarn run typeorm migration:generate libs/core/databases/postgres/migrations/<name> -d libs/core/databases/<database>/ormconfig.ts
```

- Revert migration ( pop the latest migration )
```bash
$ yarn run typeorm migration:revert -- -d <path to file database ormconfig.ts>
```


```bash
# development
$ yarn run start <?service name>

# watch mode
$ yarn run start:dev <?service name>

# production mode
$ yarn run start:prod <?service name>
```

## VI. Prerequisites

### a. Add service

- Prefer: Use nestjs-cli command `nest generate app <app name>`

- Config services in file [nestjs-cli.json](./nest-cli.json)

### b. Add database

- Create folder `<database name>` in folder [Database](./libs/core/./databases/)

- Follow database structure which mention above [Structure](#b-structure)

- Add database config to env [Env folder](./libs/config/envs/)

- Add database config to database enums [Enums folder](./libs/common/enums/database-config.enum.ts)

```ts
export enum DbConfig {
  // Route to get config with ConfigService
  // Ref: https://docs.nestjs.com/techniques/configuration#configuration
  Postgres = 'db.postgres',
}

export enum DbName {
  // Database name
  // Prefer exactly the same as database type
  Postgres = 'postgres',
}
```

- Add database config to database constants [Constants folder](./libs/common/constants/database.constant.ts)

```ts
export const schemaDbConfig: IDatabaseConfig[] = [
  // Combine database config from env and enums for usage
  { dbName: DbName.Postgres, cf: DbConfig.Postgres },
];
```

## VIII. Deployment Guide

- Todo


## IX. Configurations

- Todo

## X. Testing

- Todo
