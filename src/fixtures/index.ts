import { test as base, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { ComponentRegistry } from '../core/component-registry';
import { WithULoansPage } from '../components/loan.component';
import { TestDataProvider } from '../data/data.provider';
import { LoanApplicationAutomator } from '../services/loan.automator.service';
import * as Models from '../models';

type TestFixtures = {
  components: {
    flutterView: any;
    semanticsHost: any;
    page: Page;
    loanApplication: WithULoansPage;
    waitForFlutterLoad: () => Promise<void>;
    waitForSemanticElements: () => Promise<void>;
  };
  services: {
    loanApplicationAutomator: LoanApplicationAutomator;
  };
  testData: TestDataProvider;
  registry: ComponentRegistry;
  models: typeof Models;
};

export const test = base.extend<TestFixtures>({
  page: async ({ page }, use) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (
        url.includes('google-analytics.com') ||
        url.includes('googletagmanager.com') ||
        url.includes('facebook.com') ||
        url.includes('twitter.com') ||
        url.includes('linkedin.com') ||
        url.includes('doubleclick.net') ||
        url.includes('google.com/ads') ||
        url.includes('googlesyndication.com') ||
        url.includes('amazon-adsystem.com') ||
        url.includes('adsystem.amazon.com')
      ) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.addInitScript(() => {
      Object.defineProperty(window, 'PLAYWRIGHT_TEST', {
        value: true,
        writable: false
      });

      (window as any).grecaptcha = {
        execute: () => Promise.resolve('test-recaptcha-token'),
        render: () => 'test-widget-id'
      };

      (window as any).getToken = () => 'test-recaptcha-token';
    });

    await page.goto('https://myaccount.withuloans.com/login');

    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      return (window as any)._flutter && (window as any)._flutter.loader;
    });

    await use(page);
  },

  components: async ({ page }, use) => {
    const registry = new ComponentRegistry(page);
    
    const loanApplication = new WithULoansPage(page);
    registry.register('loanApplication', loanApplication);

    const components = {
      flutterView: page.locator('flutter-view'),
      semanticsHost: page.locator('flt-semantics-host'),
      page: page,
      loanApplication: loanApplication,
      waitForFlutterLoad: async () => {
        await page.waitForFunction(() => {
          return (window as any)._flutter && (window as any)._flutter.loader && (window as any)._flutter.loader.didCreateEngineInitializer;
        });
      },
      waitForSemanticElements: async () => {
        await page.waitForSelector('flt-semantics-host', { timeout: 10000 });
        await page.waitForTimeout(3000);
      }
    };

    await use(components);
  },

  services: async ({ page }, use) => {
    const loanApplicationAutomator = new LoanApplicationAutomator(page);
    
    const services = {
      loanApplicationAutomator
    };

    await use(services);
  },

  testData: async ({}, use) => {
    const testDataProvider = new TestDataProvider();
    await use(testDataProvider);
  },

  registry: async ({ page }, use) => {
    const registry = new ComponentRegistry(page);
    await use(registry);
  },

  models: async ({}, use) => {
    await use(Models);
  }
});

export { expect };