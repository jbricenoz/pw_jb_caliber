/**
 * Models Index
 * Central export point for all domain models and types
 */

// Core domain models
export * from './core-models';

// Enumerations
export * from './enums';

// Validation and result models
export * from './validation-models';

// Form configuration models
export * from './form-config';

// Re-export commonly used types for convenience
export type {
  PersonalInfo,
  FinancialInfo,
  LoanApplication
} from './core-models';

export type {
  ValidationResult,
  SubmissionResult
} from './validation-models';

export type {
  FormFieldConfig,
  ApplicationFormConfig
} from './form-config';

export {
  ApplicationStatus,
  EmploymentType,
  LoanPurpose
} from './enums';

/**
 * Models class for fixture integration
 * Provides organized access to all domain models and utilities
 */
export class Models {
  // Core model factories for quick access
  static createPersonalInfo(overrides?: Partial<PersonalInfo>): PersonalInfo {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ...overrides
    };
  }

  static createFinancialInfo(overrides?: Partial<FinancialInfo>): FinancialInfo {
    return {
      annualIncome: 0,
      employmentType: EmploymentType.FULL_TIME,
      ...overrides
    };
  }

  static createLoanApplication(overrides?: Partial<LoanApplication>): LoanApplication {
    return {
      personalInfo: this.createPersonalInfo(),
      financialInfo: this.createFinancialInfo(),
      loanAmount: 0,
      loanPurpose: LoanPurpose.PERSONAL,
      ...overrides
    };
  }

  // Validation utilities
  static validatePersonalInfo(info: PersonalInfo): ValidationResult {
    const errors: string[] = [];
    
    if (!info.firstName.trim()) errors.push('First name is required');
    if (!info.lastName.trim()) errors.push('Last name is required');
    if (!info.email.trim()) errors.push('Email is required');
    if (!info.phone.trim()) errors.push('Phone is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFinancialInfo(info: FinancialInfo): ValidationResult {
    const errors: string[] = [];
    
    if (info.annualIncome <= 0) errors.push('Annual income must be greater than 0');
    if (!info.employmentType.trim()) errors.push('Employment type is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLoanApplication(application: LoanApplication): ValidationResult {
    const errors: string[] = [];
    
    const personalValidation = this.validatePersonalInfo(application.personalInfo);
    const financialValidation = this.validateFinancialInfo(application.financialInfo);
    
    errors.push(...personalValidation.errors);
    errors.push(...financialValidation.errors);
    
    if (application.loanAmount <= 0) errors.push('Loan amount must be greater than 0');
    if (!application.loanPurpose.trim()) errors.push('Loan purpose is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Enum utilities
  static getEmploymentTypes(): string[] {
    return Object.values(EmploymentType);
  }

  static getLoanPurposes(): string[] {
    return Object.values(LoanPurpose);
  }

  static getApplicationStatuses(): string[] {
    return Object.values(ApplicationStatus);
  }
}

// Import types for the Models class methods
import type {
  PersonalInfo,
  FinancialInfo,
  LoanApplication
} from './core-models';

import type { ValidationResult } from './validation-models';

import { EmploymentType, LoanPurpose, ApplicationStatus } from './enums'; 