/**
 * Validation and Result Models
 * Contains interfaces for validation results and submission outcomes
 */

import { ApplicationStatus } from './enums';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Application submission result
 */
export interface SubmissionResult {
  success: boolean;
  applicationId?: string;
  status: ApplicationStatus;
  message?: string;
  timestamp: Date;
} 