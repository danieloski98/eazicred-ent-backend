# Project Structure

## Overview

All feature modules have been organized under the `/src/modules` directory for better code organization and maintainability.

## Directory Structure

```
src/
├── modules/                        # All feature modules
│   ├── admin/                      # Admin/Loan Company module
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   │
│   ├── auth/                       # Authentication module
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── companies/                  # Company management module
│   │   ├── dto/
│   │   │   ├── create-company.dto.ts
│   │   │   └── update-company.dto.ts
│   │   ├── schemas/
│   │   │   └── company.schema.ts
│   │   ├── companies.controller.ts
│   │   ├── companies.service.ts
│   │   └── companies.module.ts
│   │
│   ├── employees/                  # Employee management module
│   │   ├── dto/
│   │   │   ├── create-employee.dto.ts
│   │   │   └── update-employee.dto.ts
│   │   ├── schemas/
│   │   │   └── employee.schema.ts
│   │   ├── employees.controller.ts
│   │   ├── employees.service.ts
│   │   └── employees.module.ts
│   │
│   ├── loans/                      # Loan management module
│   │   ├── dto/
│   │   │   └── create-loan.dto.ts
│   │   ├── schemas/
│   │   │   └── loan.schema.ts
│   │   ├── loans.controller.ts
│   │   ├── loans.service.ts
│   │   └── loans.module.ts
│   │
│   └── users/                      # User management module
│       ├── schemas/
│       │   └── user.schema.ts
│       ├── users.service.ts
│       └── users.module.ts
│
├── common/                         # Shared utilities
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
│
├── config/                         # Configuration
│   └── configuration.ts
│
├── database/                       # Database module
│   └── database.module.ts
│
├── app.controller.ts               # Root controller
├── app.service.ts                  # Root service
├── app.module.ts                   # Root module
└── main.ts                         # Application entry point
```

## Module Organization

### Feature Modules (`/src/modules`)

All business logic modules are organized under the `modules` directory:

- **admin**: Loan company operations (view approved loans, fund loans, analytics)
- **auth**: Authentication and authorization (register, login, JWT)
- **companies**: Company CRUD operations (HR management)
- **employees**: Employee management (HR adds/manages employees)
- **loans**: Loan application and approval workflow
- **users**: User management service (used by other modules)

### Shared Resources

- **common**: Shared decorators, guards, and utilities used across modules
- **config**: Application configuration (database, JWT, Swagger)
- **database**: Database connection module

## Import Paths

After restructuring, import paths follow this pattern:

### From a module to another module:
```typescript
import { UsersService } from '../../modules/users/users.service';
```

### From a module to common:
```typescript
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../common/decorators/roles.decorator';
```

### From a DTO/Schema to common:
```typescript
import { UserRole } from '../../../common/decorators/roles.decorator';
```

### From app.module.ts to modules:
```typescript
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
```

## Benefits of This Structure

1. **Clear Separation**: All feature modules are grouped together
2. **Scalability**: Easy to add new modules without cluttering the root
3. **Maintainability**: Related code is co-located
4. **Standard Pattern**: Follows NestJS best practices for larger applications
5. **Easy Navigation**: Developers can quickly find module-specific code

## Module Dependencies

```
app.module
├── auth.module
│   └── users.module
├── companies.module
│   └── users.module
├── employees.module
│   ├── users.module
│   └── companies.module
├── loans.module
│   └── employees.module
└── admin.module
    └── loans.module (schema only)
```

## Testing

All modules maintain their original functionality. The restructuring only changes file locations, not behavior.

To verify:
```bash
# Build the project
npm run build

# Run the application
npm run start:dev

# Access Swagger documentation
open http://localhost:3000/api
```
