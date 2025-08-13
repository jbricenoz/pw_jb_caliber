/**
 * Form Configuration Models
 * Contains interfaces for dynamic form generation and configuration
 */

/**
 * Form field configuration for dynamic form generation
 */
export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'date';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

/**
 * Application form configuration
 */
export interface ApplicationFormConfig {
  personalInfo: FormFieldConfig[];
  financialInfo: FormFieldConfig[];
  loanDetails: FormFieldConfig[];
} 