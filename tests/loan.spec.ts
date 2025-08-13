import { test, expect } from '@playwright/test';

test.describe('Loan Application Tests', {
  tag: ['@loan', '@chrome'],
  annotation: {
    type: 'test-suite',
    description: 'Basic loan application tests for Chrome',
  }
}, () => {

  test('should navigate to demo application page', {
    tag: ['@smoke', '@navigation', '@fast'],
    annotation: {
      type: 'test-case',
      description: 'https://caliber.atlassian.net/browse/ua-2001',
    }
  }, async ({ page }) => {
    await page.goto('/login');
    
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('https://myaccount.withuloans.com/login');
    
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Chrome');
  });

    test('should check page basic elements', {
    tag: ['@smoke', '@elements', '@fast'],
    annotation: {
      type: 'test-case',
      description: 'https://caliber.atlassian.net/browse/ua-2002',
    }
  }, async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    
    await page.screenshot({ 
      path: 'test-results/screenshots/demo-page.png',
      fullPage: true 
    });
  });

  test('should handle page interactions', {
    tag: ['@interaction', '@basic', '@fast'],
    annotation: {
      type: 'test-case',
      description: 'https://caliber.atlassian.net/browse/ua-2003',
    }
  }, async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    const hasInputs = await page.locator('input').count() > 0;
    const hasButtons = await page.locator('button').count() > 0;
    
    expect(hasInputs || hasButtons).toBeTruthy();
  });

}); 