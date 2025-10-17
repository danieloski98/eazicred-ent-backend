# API Testing Guide

## Quick Test Flow

### 1. Register and Login as HR

```bash
# Register HR
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@company.com",
    "password": "password123",
    "role": "HR"
  }'

# Login as HR (after creating company, to get updated token with companyId)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@company.com",
    "password": "password123"
  }'
```

Save the `access_token` from the response.

### 2. Create Company (HR)

```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_HR_TOKEN" \
  -d '{
    "name": "My Company"
  }'
```

**IMPORTANT**: After creating the company, login again to get a new token with the companyId!

### 3. Login Again as HR

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@company.com",
    "password": "password123"
  }'
```

### 4. Add Employee (HR)

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_NEW_HR_TOKEN" \
  -d '{
    "email": "employee@company.com",
    "password": "password123",
    "fullName": "John Doe",
    "position": "Engineer"
  }'
```

### 5. Login as Employee

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123"
  }'
```

### 6. Apply for Loan (Employee)

```bash
curl -X POST http://localhost:3000/api/loans/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "amount": 5000,
    "purpose": "Home renovation"
  }'
```

Save the loan `_id` from the response.

### 7. Approve Loan (HR)

```bash
curl -X PATCH http://localhost:3000/api/loans/LOAN_ID/approve \
  -H "Authorization: Bearer HR_TOKEN"
```

### 8. Register Loan Company Admin

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loancompany.com",
    "password": "password123",
    "role": "LOAN_COMPANY"
  }'
```

### 9. View Approved Loans (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/loans \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 10. Fund Loan (Admin)

```bash
curl -X PATCH http://localhost:3000/api/admin/loans/LOAN_ID/fund \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 11. View Analytics (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Notes

- **Important**: HR must login again after creating a company to get a token with the companyId
- All passwords must be at least 6 characters
- Tokens expire after 24 hours
- Use Swagger UI at http://localhost:3000/api for interactive testing
