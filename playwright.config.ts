import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: 'html',

  
  use: {
    baseURL: 'https://myaccount.withuloans.com/login',
    
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Playwright-WithU-Loans-Tests',
    
    trace: 'on-first-retry',
    
    screenshot: 'only-on-failure',
    
    video: 'retain-on-failure',
    
    actionTimeout: 30000,
    navigationTimeout: 45000,
    
    testIdAttribute: 'data-semantics-role',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

});
