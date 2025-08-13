# Simplified Playwright Test Architecture

## Overview

This project implements a clean, simplified Playwright automation testing architecture. The architecture follows minimalist principles with focus on maintainability, type safety, and straightforward test execution.

## Current Architecture

### 1. Core Layer (`src/core/`)

#### `BaseComponent` - Foundation for page objects
- **Purpose**: Provides common functionality for UI components
- **Features**:
  - Consistent element waiting and interaction patterns
  - Enhanced logging with component context
  - Screenshot capabilities for debugging
  - Abstract `isReady()` method for component state validation

```typescript
// Example usage
export class MyComponent extends BaseComponent {
    constructor(page: Page) {
        super(page, 'MyComponent');
    }

    async isReady(): Promise<boolean> {
        return await this.isElementVisible('.my-component', 5000);
    }
}
```

#### `ComponentRegistry` - Basic component management
- **Purpose**: Simple registry for component organization
- **Features**:
  - Component registration and retrieval
  - Health status monitoring
  - Basic lifecycle management

### 2. Models Layer (`src/models/`)

#### Domain Models - Business entity representations
- **Type Safety**: Strong typing for all data structures
- **Extensibility**: Enums and interfaces for consistent data handling
- **Clean Structure**: Well-organized domain models

```typescript
// Example: Domain models
export interface LoanApplication {
    personalInfo: PersonalInfo;
    financialInfo: FinancialInfo;
    loanAmount: number;
    loanPurpose: LoanPurpose;
}

export enum LoanPurpose {
    DEBT_CONSOLIDATION = 'Debt Consolidation',
    HOME_IMPROVEMENT = 'Home Improvement',
    BUSINESS = 'Business',
    PERSONAL = 'Personal'
}
```

### 3. Components Layer (`src/components/`)

#### Base Components (`src/components/base/`)

**`FormComponent` - Form interaction utilities**
- Extends `BaseComponent` with form-specific functionality
- Multiple selector strategies for robust element location
- Form validation and error handling

```typescript
// Example: Using FormComponent
export class PersonalInfoForm extends FormComponent {
    constructor(page: Page) {
        super(page, 'PersonalInfoForm');
    }

    async fillPersonalInfo(data: PersonalInfo): Promise<boolean> {
        const results = await this.fillFormFields({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
        });
        
        return Object.values(results).every(success => success);
    }
}
```

#### Main Components
**`WithULoansPage` - Main application component**
- Handles page interactions
- Integrates with standard HTML elements
- Manages form filling and validation

### 4. Data Layer (`src/data/`)

#### `TestDataProvider` - Test data management
- **Purpose**: Centralized test data creation
- **Features**:
  - Realistic test data generation
  - Multiple test scenarios
  - Data validation utilities

```typescript
// Example: Using test data
const testData = new TestDataProvider();
const defaultApp = testData.getDefaultLoanApplication();
```

### 5. Services Layer (`src/services/`)

#### `LoanApplicationAutomator` - Business logic
- **Purpose**: Orchestrates application workflows
- **Features**:
  - Data validation
  - Error handling
  - Test application creation

```typescript
// Example: Using automation service
const automator = new LoanApplicationAutomator(page);
const testApp = await automator.createTestApplication({
    loanAmount: 35000,
    personalInfo: { firstName: 'Alice', lastName: 'Johnson' }
});
```

### 6. Test Organization

#### Standard Playwright Tests with Tagging
- **Clean Test Structure**: Standard Playwright test patterns
- **Comprehensive Tagging**: Organized test execution
- **Chrome-Only Execution**: Simplified browser testing

```typescript
// Example: Basic test with tags
test.describe('Loan Application Tests', {
  tag: ['@loan', '@chrome'],
  annotation: {
    type: 'test-suite',
    description: 'Basic loan application tests for Chrome',
  }
}, () => {

  test('should navigate to application page', {
    tag: ['@smoke', '@navigation', '@fast'],
    annotation: {
      type: 'test-case',
      description: 'https://caliber.atlassian.net/browse/ua-2001',
    }
  }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('demo.playwright.dev');
  });
});
```

## Test Organization with Playwright Tags

### Test Tagging System
Comprehensive tagging system for test organization and selective execution:

#### Tag Categories:
- **Functional**: `@loan`, `@demo`, `@chrome`
- **Test Type**: `@smoke`, `@navigation`, `@interaction`
- **Performance**: `@fast`, `@basic`
- **Environment**: `@chrome` (Chrome-specific tests)

#### Selective Test Execution:
```bash
# Run smoke tests only
npx playwright test --grep "@smoke"

# Run fast tests
npx playwright test --grep "@fast"

# Run navigation tests
npx playwright test --grep "@navigation"

# Run Chrome-specific tests
npx playwright test --grep "@chrome"
```

## Current Architecture Benefits

### 1. **Simplicity**
- **Minimal Dependencies**: No complex fixture system
- **Standard Playwright**: Uses built-in Playwright features
- **Clean Code**: Removed inline comments for production-ready code
- **Type Safety**: Full TypeScript support

### 2. **Maintainability**
- **Single Responsibility**: Each component has a clear purpose
- **Consistent Patterns**: Follows standard Playwright patterns
- **Easy Debugging**: Straightforward test execution

### 3. **Performance**
- **Chrome-Only**: Optimized for single browser execution
- **No Global Setup**: Faster test startup
- **Minimal Overhead**: Lightweight architecture

### 4. **Extensibility**
- **Modular Components**: Easy to add new components
- **Test Tagging**: Flexible test organization
- **Standard Patterns**: Easy to understand and extend

## Configuration

### Playwright Configuration
- **Single Browser**: Chrome-only execution for performance
- **Standard Setup**: No global setup dependencies
- **Clean Configuration**: Minimal, focused settings

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Test Structure
```
tests/
  └── loan.spec.ts          # Main test file with tagging
src/
  ├── components/           # Page object components
  ├── core/                # Base classes and utilities
  ├── data/                # Test data providers
  ├── models/              # Domain models and types
  └── services/            # Business logic services
```

## Usage Patterns

### 1. Creating New Tests

```typescript
test('should handle specific functionality', {
  tag: ['@feature', '@fast'],
  annotation: {
    type: 'test-case',
    description: 'https://caliber.atlassian.net/browse/ticket-id',
  }
}, async ({ page }) => {
  await page.goto('/');
  // Test implementation
});
```

### 2. Using Components

```typescript
const loanPage = new WithULoansPage(page);
await loanPage.isReady();
// Use component methods
```

### 3. Test Data

```typescript
const testData = new TestDataProvider();
const application = testData.getDefaultLoanApplication();
```

## Best Practices

### 1. Test Design
- **Simple Structure**: Use standard Playwright patterns
- **Clear Naming**: Descriptive test and component names
- **Proper Tagging**: Use tags for organization and filtering

### 2. Component Design
- **Single Responsibility**: Each component handles one area
- **Error Handling**: Implement proper error handling
- **Type Safety**: Use TypeScript interfaces

### 3. Execution Strategy
- **Chrome-Only**: Optimized for single browser
- **Tag-Based**: Use tags for selective execution
- **Fast Feedback**: Focus on quick test execution

## Migration Notes

### Recent Simplifications
1. **Removed Global Setup**: No longer using global setup files
2. **Removed Custom Fixtures**: Using standard Playwright fixtures
3. **Simplified Tests**: Basic navigation and interaction tests
4. **Chrome-Only**: Focused on single browser execution
5. **Clean Architecture**: Removed complex dependencies

### Current Focus
- Standard Playwright test patterns
- Clean, maintainable code structure
- Comprehensive test tagging
- Type-safe implementations
- Fast, reliable test execution

This simplified architecture provides a solid foundation for scalable, maintainable Playwright automation with minimal complexity and maximum reliability. 