/**
 * Core Domain Models for Loan Application
 * Contains the primary business entities
 */

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  ssn?: string;
}

export interface FinancialInfo {
  annualIncome: number;
  employmentType: string;
  employer?: string;
  monthlyExpenses?: number;
}

export interface LoanApplication {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanAmount: number;
  loanPurpose: string;
} 