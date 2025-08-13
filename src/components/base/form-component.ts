import { BaseComponent } from '../../core/base-component';
import { Page } from '@playwright/test';

export class FormComponent extends BaseComponent {

  constructor(page: Page, componentName: string) {
    super(page, componentName);
  }

  async isReady(): Promise<boolean> {
    return true;
  }

  async selectDropdownOption(dropdownSelector: string, optionText: string): Promise<boolean> {
    try {
      const dropdown = this.page.locator(dropdownSelector).first();
      await dropdown.waitFor({ state: 'visible', timeout: 5000 });
      
      if (await dropdown.getAttribute('role') === 'combobox' || await dropdown.getAttribute('aria-expanded') !== null) {
        await dropdown.click();
        await this.page.waitForTimeout(500);
        
        const option = this.page.locator(`[role="option"]:has-text("${optionText}")`).first();
        if (await option.isVisible({ timeout: 3000 })) {
          await option.click();
          return true;
        }
      } else {
        await dropdown.selectOption({ label: optionText });
        return true;
      }

      const customOption = this.page.locator(`[data-semantics-label*="${optionText}" i]`).first();
      if (await customOption.isVisible({ timeout: 3000 })) {
        await customOption.click();
        return true;
      }

      return false;
    } catch (error) {
      console.warn(`Failed to select dropdown option "${optionText}":`, error);
      return false;
    }
  }

  async fillFormField(fieldName: string, value: string): Promise<boolean> {
    const selectors = [
      `[name="${fieldName}"]`,
      `[data-testid="${fieldName}"]`,
      `[aria-label*="${fieldName}" i]`,
      `[placeholder*="${fieldName}" i]`,
      `[data-semantics-label*="${fieldName}" i]`,
      `input:near(:text("${fieldName}"))`
    ];

    return await this.interactWithElement(selectors, 'fill', value);
  }

  async fillFormFields(fields: Record<string, string>): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (value && value.trim() !== '') {
        results[fieldName] = await this.fillFormField(fieldName, value);
        
        if (results[fieldName]) {
          await this.page.waitForTimeout(200);
        }
      } else {
        results[fieldName] = true;
      }
    }
    
    return results;
  }

  async fillMultipleFields(fields: Array<{ selector: string; value: string }>): Promise<number> {
    let successCount = 0;
    
    for (const field of fields) {
      try {
        if (field.value && field.value.trim() !== '') {
          const success = await this.interactWithElement([field.selector], 'fill', field.value);
          if (success) {
            successCount++;
            await this.page.waitForTimeout(200);
          }
        }
      } catch (error) {
        console.warn(`Failed to fill field ${field.selector}:`, error);
      }
    }
    
    return successCount;
  }

  async getFieldValue(fieldSelector: string): Promise<string | null> {
    try {
      const field = this.page.locator(fieldSelector).first();
      await field.waitFor({ state: 'visible', timeout: 3000 });
      
      const tagName = await field.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'input' || tagName === 'textarea') {
        return await field.inputValue();
      } else if (tagName === 'select') {
        return await field.inputValue();
      } else {
        return await field.textContent();
      }
    } catch (error) {
      return null;
    }
  }

  async clearField(fieldSelector: string): Promise<boolean> {
    try {
      const field = this.page.locator(fieldSelector).first();
      await field.waitFor({ state: 'visible', timeout: 3000 });
      await field.clear();
      return true;
    } catch (error) {
      return false;
    }
  }

  async submitForm(submitSelectors?: string[]): Promise<boolean> {
    const defaultSelectors = [
      '[type="submit"]',
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Submit")',
      'button:has-text("Send")',
      'button:has-text("Apply")',
      '[data-semantics-role="button"]:has-text("Submit")'
    ];

    const selectors = submitSelectors || defaultSelectors;
    return await this.interactWithElement(selectors, 'click');
  }

  async validateField(fieldSelector: string, validationRule: (value: string) => boolean): Promise<boolean> {
    const value = await this.getFieldValue(fieldSelector);
    return value ? validationRule(value) : false;
  }

  async waitForFormValidation(): Promise<void> {
    try {
      await this.page.waitForFunction(() => {
        const loadingIndicators = document.querySelectorAll('[data-loading="true"], .loading, .spinner');
        return loadingIndicators.length === 0;
      }, { timeout: 5000 });
    } catch (error) {
      console.warn('Form validation timeout');
    }
    
    await this.page.waitForTimeout(500);
  }

  async hasValidationError(fieldSelector?: string): Promise<boolean> {
    try {
      if (fieldSelector) {
        const fieldError = this.page.locator(`${fieldSelector} ~ .error, ${fieldSelector} + .error`);
        return await fieldError.isVisible({ timeout: 1000 });
      } else {
        const generalError = this.page.locator('.error, .error-message, [role="alert"]');
        return await generalError.first().isVisible({ timeout: 1000 });
      }
    } catch (error) {
      return false;
    }
  }

  async getValidationErrors(): Promise<string[]> {
    try {
      const errorElements = this.page.locator('.error, .error-message, [role="alert"]');
      const errorTexts = await errorElements.allTextContents();
      return errorTexts.filter(text => text.trim() !== '');
    } catch (error) {
      return [];
    }
  }

  async isFormValid(): Promise<boolean> {
    const hasErrors = await this.hasValidationError();
    return !hasErrors;
  }

  async resetForm(): Promise<boolean> {
    try {
      const resetButton = this.page.locator('[type="reset"], button:has-text("Reset"), button:has-text("Clear")');
      
      if (await resetButton.first().isVisible({ timeout: 3000 })) {
        await resetButton.first().click();
        return true;
      }
      
      const formFields = this.page.locator('input:not([type="submit"]):not([type="button"]), textarea, select');
      const fieldCount = await formFields.count();
      
      for (let i = 0; i < fieldCount; i++) {
        const field = formFields.nth(i);
        await field.clear();
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to reset form:', error);
      return false;
    }
  }
} 