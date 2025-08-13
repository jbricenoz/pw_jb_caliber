import { Page } from '@playwright/test';
import { LoanApplication } from '../models/core-models';
import { WithULoansPage } from '../components/loan.component';

export class LoanApplicationAutomator {
  private page: Page;
  private loanComponent: WithULoansPage;

  constructor(page: Page) {
    this.page = page;
    this.loanComponent = new WithULoansPage(page);
  }

  async processLoanApplication(application: LoanApplication): Promise<boolean> {
    try {
      await this.loanComponent.navigateToApplication();

      await this.loanComponent.waitForChatWidget();

      await this.loanComponent.fillCompleteApplication(application);

      await this.loanComponent.handleRecaptcha();

      await this.loanComponent.submitApplication();

      return await this.loanComponent.verifySubmissionSuccess();

    } catch (error) {
      console.error('Error processing loan application:', error);
      return false;
    }
  }

  async validateApplicationData(application: LoanApplication): Promise<boolean> {
    try {
      if (!application.personalInfo) return false;
      if (!application.personalInfo.firstName || application.personalInfo.firstName.trim() === '') return false;
      if (!application.personalInfo.lastName || application.personalInfo.lastName.trim() === '') return false;
      if (!application.personalInfo.email || !this.isValidEmail(application.personalInfo.email)) return false;
      if (!application.personalInfo.phone || !this.isValidPhone(application.personalInfo.phone)) return false;

      if (!application.financialInfo) return false;
      if (!application.financialInfo.annualIncome || application.financialInfo.annualIncome <= 0) return false;
      if (!application.financialInfo.employmentType || application.financialInfo.employmentType.trim() === '') return false;

      if (!application.loanAmount || application.loanAmount <= 0) return false;
      if (!application.loanPurpose || application.loanPurpose.trim() === '') return false;

      return true;
    } catch (error) {
      console.error('Error validating application data:', error);
      return false;
    }
  }

  async createTestApplication(overrides: Partial<LoanApplication> = {}): Promise<LoanApplication> {
    const defaultApplication: LoanApplication = {
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        phone: '555-123-4567'
      },
      financialInfo: {
        annualIncome: 75000,
        employmentType: 'Full-time',
        employer: 'Test Company'
      },
      loanAmount: 25000,
      loanPurpose: 'Debt Consolidation'
    };

    const isValid = await this.validateApplicationData(defaultApplication);
    if (!isValid) {
      throw new Error('Default application data failed validation');
    }

    return this.deepMerge(defaultApplication, overrides);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
} 