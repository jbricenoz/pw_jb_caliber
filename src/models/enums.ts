/**
 * Enumerations for Loan Application Domain
 * Contains all enum types for consistent value management
 */

/**
 * Application status enum
 */
export enum ApplicationStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_REVIEW = 'pending_review'
}

/**
 * Employment types enum for consistency
 */
export enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  SELF_EMPLOYED = 'Self-employed',
  CONTRACT = 'Contract',
  RETIRED = 'Retired',
  UNEMPLOYED = 'Unemployed',
  STUDENT = 'Student'
}

/**
 * Loan purpose options
 */
export enum LoanPurpose {
  DEBT_CONSOLIDATION = 'Debt Consolidation',
  HOME_IMPROVEMENT = 'Home Improvement',
  MEDICAL_EXPENSES = 'Medical Expenses',
  BUSINESS = 'Business',
  PERSONAL = 'Personal',
  EDUCATION = 'Education',
  VACATION = 'Vacation',
  AUTO = 'Auto'
} 