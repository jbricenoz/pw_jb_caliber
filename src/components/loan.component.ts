import { Page } from '@playwright/test';
import { FormComponent } from './base/form-component';
import { PersonalInfo, FinancialInfo, LoanApplication } from '../models';
import config from '../../playwright.config';

/**
 * WithU Loans Page Component
 * Handles loan application form interactions using Flutter semantic elements
 * Extends FormComponent for robust form handling capabilities
 */
export class WithULoansPage extends FormComponent {

  constructor(page: Page) {
    super(page, 'WithULoansPage');
  }

  /**
   * Check if the loan application page is ready
   */
  async isReady(): Promise<boolean> {
    await this.page.waitForSelector('flutter-view', { timeout: 10000 });
    await this.page.waitForSelector('flt-semantics-host', { timeout: 10000 });
    
    return true;
  }

  /**
   * Navigate to the loan application page
   */
  async navigateToApplication(): Promise<void> {
    const currentUrl = this.page.url();
    const targetUrl = config.use?.baseURL || 'https://myaccount.withuloans.com/login';

    if (!currentUrl.includes('myaccount.withuloans.com')) {
      await this.page.goto(targetUrl);
    }

    await this.page.waitForLoadState('networkidle');

    await this.waitForFlutterSemantics();

    if (!(await this.isReady())) {
      throw new Error('Loan application page failed to load properly');
    }
  }

  /**
   * Fill personal information fields
   * @param personalInfo Personal information object
   */
  async fillPersonalInfo(personalInfo: PersonalInfo): Promise<void> {
    const fields = [
      { selector: '[data-semantics-label*="first name" i]', value: personalInfo.firstName },
      { selector: '[data-semantics-label*="last name" i]', value: personalInfo.lastName },
      { selector: '[data-semantics-label*="email" i]', value: personalInfo.email },
      { selector: '[data-semantics-label*="phone" i]', value: personalInfo.phone }
    ];

    if (personalInfo.dateOfBirth) {
      fields.push({ selector: '[data-semantics-label*="date of birth" i]', value: personalInfo.dateOfBirth });
    }
    if (personalInfo.ssn) {
      fields.push({ selector: '[data-semantics-label*="ssn" i]', value: personalInfo.ssn });
    }

    for (const field of fields) {
      await this.interactWithElement([field.selector], 'fill', field.value);
    }
  }

  /**
   * Fill financial information fields
   * @param financialInfo Financial information object
   */
  async fillFinancialInfo(financialInfo: FinancialInfo): Promise<void> {
    const textFields = [
      { selector: '[data-semantics-label*="annual income" i]', value: financialInfo.annualIncome?.toString() },
      { selector: '[data-semantics-label*="employer" i]', value: financialInfo.employer }
    ];

    for (const field of textFields.filter(field => field.value)) {
      await this.interactWithElement([field.selector], 'fill', field.value);
    }

    if (financialInfo.employmentType) {
      await this.selectDropdownOption(
        '[data-semantics-label*="employment" i]',
        financialInfo.employmentType
      );
    }

    if (financialInfo.monthlyExpenses) {
      await this.interactWithElement(
        ['[data-semantics-label*="monthly expenses" i]'], 
        'fill', 
        financialInfo.monthlyExpenses.toString()
      );
    }
  }

  /**
   * Set loan amount and purpose
   * @param amount Loan amount
   * @param purpose Loan purpose
   */
  async setLoanDetails(amount: number, purpose: string): Promise<void> {
    await this.interactWithElement(
      ['[data-semantics-label*="loan amount" i]'], 
      'fill', 
      amount.toString()
    );

    await this.selectDropdownOption(
      '[data-semantics-label*="purpose" i]',
      purpose
    );
  }

  /**
   * Submit the loan application
   */
  async submitApplication(): Promise<void> {
    const submitSelectors = [
      '[data-semantics-label*="submit" i]',
      '[data-semantics-label*="apply" i]',
      'button:has-text("Submit")',
      'button:has-text("Apply")',
      '[type="submit"]'
    ];

    await this.interactWithElement(submitSelectors, 'click');

    await this.waitForStableState();
  }

  /**
   * Handle reCAPTCHA verification
   */
  async handleRecaptcha(): Promise<void> {
    try {
      await this.page.waitForSelector('.g-recaptcha', { timeout: 5000 });

      const token = await this.page.evaluate(() => {
        if ((window as any).grecaptcha && (window as any).grecaptcha.execute) {
          return (window as any).grecaptcha.execute('test-site-key', { action: 'submit' });
        }
        return null;
      });

      if (token) {
        await this.page.evaluate((token) => {
          if ((window as any).handleRecaptchaResponse) {
            (window as any).handleRecaptchaResponse(token);
          }
        }, token);
      }
    } catch (error) {
      console.warn('No reCAPTCHA found or already handled:', error);
    }
  }

  /**
   * Fill complete application with all provided data
   */
  async fillCompleteApplication(application: LoanApplication): Promise<void> {
    await this.fillPersonalInfo(application.personalInfo);

    if (application.financialInfo) {
      await this.fillFinancialInfo(application.financialInfo);
    }

    await this.setLoanDetails(application.loanAmount, application.loanPurpose);
  }

  /**
   * Wait for chat widget to appear and dismiss if needed
   */
  async waitForChatWidget(): Promise<void> {
    try {
      const chatSelectors = [
        '#zendesk-chat',
        '.zopim-chat-widget',
        '[data-testid="chat-widget"]',
        '.chat-widget'
      ];

      for (const selector of chatSelectors) {
        const chatElement = await this.page.locator(selector).first();
        if (await chatElement.isVisible({ timeout: 2000 })) {
          await chatElement.click();
          break;
        }
      }
    } catch (error) {
      console.warn('No chat widget found or failed to interact:', error);
    }
  }

  /**
   * Verify if application submission was successful
   */
  async verifySubmissionSuccess(): Promise<boolean> {
    try {
      const successSelectors = [
        '[data-semantics-label*="success" i]',
        '[data-semantics-label*="submitted" i]',
        '.success-message',
        '.confirmation-message'
      ];

      for (const selector of successSelectors) {
        const element = await this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 5000 })) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error verifying submission success:', error);
      return false;
    }
  }

  get flutterView() {
    return this.page.locator('flutter-view');
  }

  get semanticsHost() {
    return this.page.locator('flt-semantics-host');
  }

  get textFields() {
    return this.page.locator('[data-semantics-role="text-field"]');
  }

  get buttons() {
    return this.page.locator('[data-semantics-role="button"]');
  }

  get dropdowns() {
    return this.page.locator('[data-semantics-role="popup"]');
  }
} 