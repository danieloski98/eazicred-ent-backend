# EaziCred Loan App Platform - Backend API

A production-ready NestJS backend for a Loan App Platform with role-based access control, JWT authentication, and MongoDB integration.

## 🚀 Features

- **JWT Authentication** with Passport.js
- **Role-Based Access Control** (EMPLOYEE, HR, LOAN_COMPANY)
- **MongoDB** with Mongoose ODM
- **Swagger API Documentation**
- **Request Validation** with class-validator
- **Modular Architecture**
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

## 🛠️ Tech Stack

- NestJS v11
- TypeScript
- MongoDB + Mongoose
- Passport.js + JWT
- Bcrypt
- Swagger/OpenAPI
- Class Validator & Transformer

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/eazicred

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

## 🚀 Running the Application

```bash
# Development mode with watch
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at:
- **API**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api

## 📚 API Documentation

### User Roles

- **EMPLOYEE**: Can apply for loans and view their own loans
- **HR**: Can manage employees and approve/reject loan applications
- **LOAN_COMPANY**: Can fund approved loans and view analytics

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "EMPLOYEE|HR|LOAN_COMPANY"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Company Endpoints (HR Only)

#### Create Company
```http
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tech Corp Ltd"
}
```

#### Get All Companies (Admin Only)
```http
GET /api/companies
Authorization: Bearer <token>
```

#### Get Company Details
```http
GET /api/companies/:id
Authorization: Bearer <token>
```

#### Update Company
```http
PATCH /api/companies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Company Name"
}
```

### Employee Endpoints

#### Add Employee (HR Only)
```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "position": "Software Engineer"
}
```

#### Get All Employees (HR Only)
```http
GET /api/employees
Authorization: Bearer <token>
```

#### Get My Profile (Employee)
```http
GET /api/employees/me
Authorization: Bearer <token>
```

#### Update Employee
```http
PATCH /api/employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "position": "Senior Engineer"
}
```

### Loan Endpoints

#### Apply for Loan (Employee)
```http
POST /api/loans/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "purpose": "Home renovation"
}
```

#### Get My Loans (Employee)
```http
GET /api/loans/my-loans
Authorization: Bearer <token>
```

#### Get Company Loans (HR)
```http
GET /api/loans/company-loans
Authorization: Bearer <token>
```

#### Approve Loan (HR)
```http
PATCH /api/loans/:id/approve
Authorization: Bearer <token>
```

#### Reject Loan (HR)
```http
PATCH /api/loans/:id/reject
Authorization: Bearer <token>
```

#### Fund Loan (Loan Company)
```http
PATCH /api/loans/:id/fund
Authorization: Bearer <token>
```

#### Mark as Repaid (Loan Company)
```http
PATCH /api/loans/:id/repay
Authorization: Bearer <token>
```

### Admin Endpoints (Loan Company Only)

#### Get All Approved Loans
```http
GET /api/admin/loans
Authorization: Bearer <token>
```

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <token>
```

Response:
```json
{
  "totalLoans": 100,
  "pendingLoans": 20,
  "approvedLoans": 30,
  "fundedLoans": 40,
  "repaidLoans": 10,
  "rejectedLoans": 0,
  "totalAmount": 500000,
  "fundedAmount": 400000,
  "repaidAmount": 100000
}
```

## 🏗️ Project Structure

```
src/
├── modules/            # All feature modules
│   ├── admin/          # Admin module (loan company operations)
│   ├── auth/           # Authentication module
│   ├── companies/      # Company management
│   ├── employees/      # Employee management
│   ├── loans/          # Loan management
│   └── users/          # User management
├── common/             # Shared utilities
│   ├── decorators/     # Custom decorators
│   └── guards/         # Auth guards
├── config/             # Configuration
├── database/           # Database module
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Request validation
- CORS enabled
- Environment variable configuration

## 📝 Loan Application Flow

1. **Employee** applies for a loan
2. **HR** reviews and approves/rejects the loan
3. **Loan Company** views approved loans
4. **Loan Company** funds the approved loan
5. **Loan Company** marks loan as repaid when complete

## 🐳 Docker Support (Optional)

Create a `docker-compose.yml` for easy deployment:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
  
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/eazicred
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

## 📄 License

This project is licensed under the MIT License.
