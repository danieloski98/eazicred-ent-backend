import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  HR = 'HR',
  LOAN_COMPANY = 'LOAN_COMPANY',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
