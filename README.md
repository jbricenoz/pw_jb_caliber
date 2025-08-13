# Caliber Playwright Test Automation Framework


## Features

- **Simplified Architecture**: Clean, standard Playwright patterns
- **Chrome-Optimized**: Single browser execution for performance
- **Comprehensive Tagging**: Organized test execution with `@tags`
- **Type Safety**: Full TypeScript support
- **Clean Code**: Production-ready, comment-free codebase
- **Modular Components**: Reusable page object components

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pw_jb_caliber
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   # or directly: npx playwright install chromium
   ```

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test
# or: npx playwright test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Generate and open test report
npm run test:report

# Type checking
npm run type-check
```

### Tagged Test Execution

The framework uses a comprehensive tagging system for selective test execution:

```bash
# Run smoke tests only
npm run test:smoke

# Run fast tests
npm run test:fast

# Run Chrome-specific tests
npm run test:chrome

# Run loan application tests
npm run test:loan

# Run navigation tests (using npx directly)
npx playwright test --grep "@navigation"

# Run interaction tests (using npx directly)
npx playwright test --grep "@interaction"

# Combine multiple tags
npx playwright test --grep "@smoke.*@fast"
```

### Available Test Tags

| Tag | Description | Use Case |
|-----|-------------|----------|
| `@smoke` | Critical functionality tests | Quick validation |
| `@fast` | Quick-running tests | Rapid feedback |
| `@navigation` | Page navigation tests | Routing validation |
| `@interaction` | UI interaction tests | User workflow testing |
| `@chrome` | Chrome-specific tests | Browser compatibility |
| `@loan` | Loan application tests | Feature-specific testing |
| `@basic` | Basic functionality tests | Core feature validation |

## Project Structure

```
pw_jb_caliber/
├── tests/
│   └── loan.spec.ts          # Main test file with comprehensive tagging
├── src/
│   ├── components/           # Page object components
│   │   ├── base/            # Base component classes
│   │   ├── index.ts         # Component exports
│   │   └── loan.component.ts # Main application component
│   ├── core/                # Core architecture
│   │   ├── base-component.ts # Base component class
│   │   └── component-registry.ts # Component management
│   ├── data/                # Test data providers
│   │   └── data.provider.ts # Test data generation
│   ├── models/              # Domain models and types
│   │   ├── core-models.ts   # Core data models
│   │   ├── enums.ts         # Enumerations
│   │   └── index.ts         # Model exports
│   └── services/            # Business logic services
│       ├── index.ts         # Service exports
│       └── loan.automator.service.ts # Application automation
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── CODEOWNERS              # Code ownership definitions
├── ARCHITECTURE.md         # Architecture documentation
└── README.md               # This file
```

## Test Development

### Writing New Tests

1. **Create a new test with tags**:
   ```typescript
   test('should handle specific functionality', {
     tag: ['@feature', '@fast'],
     annotation: {
       type: 'test-case',
       description: 'https://caliber.atlassian.net/browse/TICKET-ID',
     }
   }, async ({ page }) => {
     await page.goto('/');
     // Test implementation
   });
   ```

2. **Use descriptive test names**:
   ```typescript
   test('should navigate to application page successfully')
   test('should validate form inputs with error messages')
   test('should complete loan application workflow')
   ```

3. **Follow tagging conventions**:
   - Use `@smoke` for critical path tests
   - Use `@fast` for quick tests (< 30 seconds)
   - Use `@slow` for longer tests (> 30 seconds)
   - Use feature-specific tags like `@loan`, `@navigation`

### Using Components

```typescript
// Import and use page components
import { WithULoansPage } from '../src/components/loan.component';

test('example test', async ({ page }) => {
  const loanPage = new WithULoansPage(page);
  await loanPage.isReady();
  // Use component methods
});
```

### Test Data

```typescript
// Use test data providers
import { TestDataProvider } from '../src/data/data.provider';

const testData = new TestDataProvider();
const application = testData.getDefaultLoanApplication();
```

## 🔧 Configuration

### Playwright Configuration

The project is configured for:
- **Chrome-only execution** for performance
- **HTML reporter** for test results
- **Screenshots on failure** for debugging
- **Video recording on failure** for complex issues

### TypeScript Configuration

- Strict type checking enabled
- Full ES2020+ support
- Path mapping for clean imports

## Test Reports

After running tests, view the results:

```bash
# Open HTML report
npx playwright show-report

# View test results in terminal
npx playwright test --reporter=list

# Generate JSON report
npx playwright test --reporter=json
```

## Debugging

### Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/loan.spec.ts --debug

# Run with trace viewer
npx playwright test --trace on
```

### Screenshots and Videos

- Screenshots are automatically captured on test failures
- Videos are recorded for failed tests
- Files are saved in `test-results/` directory

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install chromium
      - run: npx playwright test --grep "@smoke"
      - run: npx playwright test --grep "@fast"
```

## Contributing

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Add tests with appropriate tags
   - Update documentation if needed
   - Ensure TypeScript compilation passes

3. **Run tests**:
   ```bash
   npm run test
   npx tsc --noEmit  # Type checking
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add new test functionality"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

### Code Standards

- Use TypeScript for all code
- Follow existing naming conventions
- Add appropriate test tags
- Include Jira ticket references in annotations
- Maintain clean, comment-free production code

## Documentation

- **[Architecture Guide](./ARCHITECTURE.md)** - Detailed architecture documentation
- **[Playwright Docs](https://playwright.dev/)** - Official Playwright documentation
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference

## Troubleshooting

### Common Issues

1. **Browser not found**:
   ```bash
   npx playwright install chromium
   ```

2. **TypeScript errors**:
   ```bash
   npx tsc --noEmit
   ```

3. **Test failures**:
   - Check `test-results/` for screenshots and videos
   - Use `--debug` flag for interactive debugging
   - Verify page URLs and element selectors

### Getting Help

- Check existing issues in the repository
- Review test execution logs
- Use Playwright's trace viewer for detailed debugging

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Review mates! 🎭** 