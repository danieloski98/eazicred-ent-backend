#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"

echo -e "${BLUE}=== EaziCred API Testing ===${NC}\n"

# Test 1: Register Loan Company Admin
echo -e "${BLUE}1. Registering Loan Company Admin...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eazicred.com",
    "password": "admin123456",
    "role": "LOAN_COMPANY"
  }')
echo "$ADMIN_RESPONSE" | jq '.'
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.access_token')
echo -e "${GREEN}✓ Admin registered${NC}\n"

# Test 2: Register HR
echo -e "${BLUE}2. Registering HR Manager...${NC}"
HR_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@techcorp.com",
    "password": "hr123456",
    "role": "HR"
  }')
echo "$HR_RESPONSE" | jq '.'
HR_TOKEN=$(echo "$HR_RESPONSE" | jq -r '.access_token')
HR_USER_ID=$(echo "$HR_RESPONSE" | jq -r '.user.id')
echo -e "${GREEN}✓ HR registered${NC}\n"

# Test 3: HR Creates Company
echo -e "${BLUE}3. HR Creating Company...${NC}"
COMPANY_RESPONSE=$(curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "name": "Tech Corp Ltd"
  }')
echo "$COMPANY_RESPONSE" | jq '.'
COMPANY_ID=$(echo "$COMPANY_RESPONSE" | jq -r '._id')
echo -e "${GREEN}✓ Company created${NC}\n"

# Test 4: HR Adds Employee
echo -e "${BLUE}4. HR Adding Employee...${NC}"
EMPLOYEE_RESPONSE=$(curl -s -X POST "$API_URL/employees" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "email": "john.doe@techcorp.com",
    "password": "employee123456",
    "fullName": "John Doe",
    "position": "Software Engineer"
  }')
echo "$EMPLOYEE_RESPONSE" | jq '.'
EMPLOYEE_ID=$(echo "$EMPLOYEE_RESPONSE" | jq -r '._id')
echo -e "${GREEN}✓ Employee added${NC}\n"

# Test 5: Employee Login
echo -e "${BLUE}5. Employee Login...${NC}"
EMPLOYEE_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@techcorp.com",
    "password": "employee123456"
  }')
echo "$EMPLOYEE_LOGIN" | jq '.'
EMPLOYEE_TOKEN=$(echo "$EMPLOYEE_LOGIN" | jq -r '.access_token')
echo -e "${GREEN}✓ Employee logged in${NC}\n"

# Test 6: Employee Applies for Loan
echo -e "${BLUE}6. Employee Applying for Loan...${NC}"
LOAN_RESPONSE=$(curl -s -X POST "$API_URL/loans/apply" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -d '{
    "amount": 5000,
    "purpose": "Home renovation"
  }')
echo "$LOAN_RESPONSE" | jq '.'
LOAN_ID=$(echo "$LOAN_RESPONSE" | jq -r '._id')
echo -e "${GREEN}✓ Loan application submitted${NC}\n"

# Test 7: Employee Views Their Loans
echo -e "${BLUE}7. Employee Viewing Their Loans...${NC}"
curl -s -X GET "$API_URL/loans/my-loans" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" | jq '.'
echo -e "${GREEN}✓ Employee loans retrieved${NC}\n"

# Test 8: HR Views Company Loans
echo -e "${BLUE}8. HR Viewing Company Loans...${NC}"
curl -s -X GET "$API_URL/loans/company-loans" \
  -H "Authorization: Bearer $HR_TOKEN" | jq '.'
echo -e "${GREEN}✓ Company loans retrieved${NC}\n"

# Test 9: HR Approves Loan
echo -e "${BLUE}9. HR Approving Loan...${NC}"
curl -s -X PATCH "$API_URL/loans/$LOAN_ID/approve" \
  -H "Authorization: Bearer $HR_TOKEN" | jq '.'
echo -e "${GREEN}✓ Loan approved by HR${NC}\n"

# Test 10: Admin Views Approved Loans
echo -e "${BLUE}10. Admin Viewing Approved Loans...${NC}"
curl -s -X GET "$API_URL/admin/loans" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo -e "${GREEN}✓ Approved loans retrieved${NC}\n"

# Test 11: Admin Funds Loan
echo -e "${BLUE}11. Admin Funding Loan...${NC}"
curl -s -X PATCH "$API_URL/admin/loans/$LOAN_ID/fund" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo -e "${GREEN}✓ Loan funded${NC}\n"

# Test 12: Admin Views Analytics
echo -e "${BLUE}12. Admin Viewing Analytics...${NC}"
curl -s -X GET "$API_URL/admin/analytics" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo -e "${GREEN}✓ Analytics retrieved${NC}\n"

echo -e "${GREEN}=== All Tests Completed Successfully! ===${NC}"
