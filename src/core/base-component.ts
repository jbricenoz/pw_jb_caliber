import { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  protected page: Page;
  protected componentName: string;

  constructor(page: Page, componentName: string) {
    this.page = page;
    this.componentName = componentName;
  }

  abstract isReady(): Promise<boolean>;

  protected async waitForElement(
    selector: string, 
    options: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' } = {}
  ): Promise<Locator> {
    const { timeout = 10000, state = 'visible' } = options;
    
    const locator = this.page.locator(selector);
    await locator.waitFor({ state, timeout });
    
    return locator;
  }

  protected async interactWithElement(
    selectors: string[], 
    action: 'click' | 'fill' | 'hover' | 'focus' = 'click',
    value?: string,
    options: { timeout?: number; force?: boolean } = {}
  ): Promise<boolean> {
    const { timeout = 10000, force = false } = options;

    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        
        await element.waitFor({ state: 'visible', timeout: 3000 });
        
        if (await element.isVisible({ timeout: 1000 })) {
          switch (action) {
            case 'click':
              await element.click({ force, timeout });
              break;
            case 'fill':
              if (value !== undefined) {
                await element.fill(value, { timeout, force });
              }
              break;
            case 'hover':
              await element.hover({ timeout, force });
              break;
            case 'focus':
              await element.focus({ timeout });
              break;
          }
          return true;
        }
      } catch (error) {
        continue;
      }
    }
    
    return false;
  }

  protected async getElementText(selector: string): Promise<string | null> {
    try {
      const element = await this.waitForElement(selector, { timeout: 5000 });
      return await element.textContent();
    } catch (error) {
      return null;
    }
  }

  protected async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  protected async waitForStableState(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
    await this.page.waitForTimeout(1000);
  }

  protected async takeScreenshot(name: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${this.componentName}-${name}-${timestamp}.png`;
      
      await this.page.screenshot({
        path: `test-results/screenshots/${filename}`,
        fullPage: true
      });
    } catch (error) {
      console.warn(`Could not take screenshot: ${error}`);
    }
  }

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${this.componentName}: ${message}`);
  }

  protected async waitForFlutterSemantics(timeout: number = 15000): Promise<void> {
    await this.page.waitForSelector('flt-semantics-host', { 
      state: 'attached', 
      timeout 
    });
    
    await this.page.waitForFunction(() => {
      const semanticsHost = document.querySelector('flt-semantics-host');
      return semanticsHost && semanticsHost.children.length > 0;
    }, { timeout });
  }
} 