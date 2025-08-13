import { 
    PersonalInfo, 
    FinancialInfo, 
    LoanApplication, 
    EmploymentType, 
    LoanPurpose 
} from '../models';

/**
 * Test Data Provider
 * Centralized data management for data-driven testing
 */
export class TestDataProvider {
    
    /**
     * Get default personal information data
     */
    getDefaultPersonalInfo(): PersonalInfo {
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '555-123-4567',
            dateOfBirth: '01/01/1990',
            ssn: '123-45-6789'
        };
    }

    /**
     * Get default financial information data
     */
    getDefaultFinancialInfo(): FinancialInfo {
        return {
            annualIncome: 75000,
            employmentType: EmploymentType.FULL_TIME,
            employer: 'Tech Corp Inc',
            monthlyExpenses: 3000
        };
    }

    /**
     * Get default loan application data
     */
    getDefaultLoanApplication(): LoanApplication {
        return {
            personalInfo: this.getDefaultPersonalInfo(),
            financialInfo: this.getDefaultFinancialInfo(),
            loanAmount: 25000,
            loanPurpose: LoanPurpose.DEBT_CONSOLIDATION
        };
    }

    /**
     * Generate random personal info with realistic data
     */
    generateRandomPersonalInfo(overrides?: Partial<PersonalInfo>): PersonalInfo {
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Christopher', 'Jessica'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        const domains = ['example.com', 'test.com', 'sample.org', 'demo.net'];
        
        const firstName = this.randomChoice(firstNames);
        const lastName = this.randomChoice(lastNames);
        const domain = this.randomChoice(domains);
        
        const baseData: PersonalInfo = {
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
            phone: this.generatePhoneNumber(),
            dateOfBirth: this.generateDateOfBirth(),
            ssn: this.generateSSN()
        };

        return { ...baseData, ...overrides };
    }

    /**
     * Generate random financial info
     */
    generateRandomFinancialInfo(overrides?: Partial<FinancialInfo>): FinancialInfo {
        const employmentTypes = Object.values(EmploymentType);
        const employers = [
            'Tech Solutions Inc', 'Global Corp', 'Innovation Labs', 'Digital Dynamics',
            'Enterprise Systems', 'Creative Agency', 'Data Analytics Co', 'Software Solutions'
        ];

        const annualIncome = this.randomBetween(30000, 150000);
        
        const baseData: FinancialInfo = {
            annualIncome,
            employmentType: this.randomChoice(employmentTypes),
            employer: this.randomChoice(employers),
            monthlyExpenses: Math.floor(annualIncome * 0.3 / 12) // ~30% of income
        };

        return { ...baseData, ...overrides };
    }

    /**
     * Generate complete random loan application
     */
    generateRandomLoanApplication(overrides?: Partial<LoanApplication>): LoanApplication {
        const loanPurposes = Object.values(LoanPurpose);
        
        const baseData: LoanApplication = {
            personalInfo: this.generateRandomPersonalInfo(overrides?.personalInfo),
            financialInfo: this.generateRandomFinancialInfo(overrides?.financialInfo),
            loanAmount: this.randomBetween(5000, 75000),
            loanPurpose: this.randomChoice(loanPurposes)
        };

        return { ...baseData, ...overrides };
    }

    /**
     * Get test data sets for different scenarios
     */
    getTestDataSets(): { [scenario: string]: LoanApplication } {
        return {
            valid_application: this.getDefaultLoanApplication(),
            
            high_income_application: this.generateRandomLoanApplication({
                financialInfo: {
                    annualIncome: 120000,
                    employmentType: EmploymentType.FULL_TIME,
                    employer: 'Senior Executive Corp'
                },
                loanAmount: 50000
            }),

            self_employed_application: this.generateRandomLoanApplication({
                financialInfo: {
                    annualIncome: 85000,
                    employmentType: EmploymentType.SELF_EMPLOYED,
                    employer: 'Self'
                },
                loanAmount: 30000
            }),

            student_application: this.generateRandomLoanApplication({
                personalInfo: {
                    firstName: 'Alex',
                    lastName: 'Student',
                    email: 'alex.student@university.edu',
                    phone: '555-999-8888'
                },
                financialInfo: {
                    annualIncome: 25000,
                    employmentType: EmploymentType.STUDENT,
                    employer: 'Part-time Work'
                },
                loanAmount: 10000,
                loanPurpose: LoanPurpose.EDUCATION
            }),

            business_loan_application: this.generateRandomLoanApplication({
                financialInfo: {
                    annualIncome: 95000,
                    employmentType: EmploymentType.SELF_EMPLOYED,
                    employer: 'Business Owner'
                },
                loanAmount: 60000,
                loanPurpose: LoanPurpose.BUSINESS
            }),

            minimal_valid_application: {
                personalInfo: {
                    firstName: 'Min',
                    lastName: 'Valid',
                    email: 'min.valid@test.com',
                    phone: '555-000-0001'
                },
                financialInfo: {
                    annualIncome: 35000,
                    employmentType: EmploymentType.FULL_TIME
                },
                loanAmount: 5000,
                loanPurpose: LoanPurpose.PERSONAL
            }
        };
    }

    /**
     * Get invalid test data for negative testing
     */
    getInvalidTestData(): { [scenario: string]: Partial<LoanApplication> } {
        return {
            empty_personal_info: {
                personalInfo: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: ''
                }
            },

            invalid_email: {
                personalInfo: {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'invalid-email',
                    phone: '555-123-4567'
                }
            },

            invalid_phone: {
                personalInfo: {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    phone: '123'
                }
            },

            zero_income: {
                financialInfo: {
                    annualIncome: 0,
                    employmentType: EmploymentType.UNEMPLOYED
                }
            },

            negative_loan_amount: {
                loanAmount: -1000
            },

            excessive_loan_amount: {
                loanAmount: 1000000
            }
        };
    }

    /**
     * Get boundary value test data
     */
    getBoundaryTestData(): { [scenario: string]: LoanApplication } {
        return {
            minimum_loan: this.generateRandomLoanApplication({
                loanAmount: 1000, // Minimum loan amount
                financialInfo: {
                    annualIncome: 20000, // Minimum income
                    employmentType: EmploymentType.FULL_TIME
                }
            }),

            maximum_loan: this.generateRandomLoanApplication({
                loanAmount: 100000, // Maximum loan amount
                financialInfo: {
                    annualIncome: 200000, // High income
                    employmentType: EmploymentType.FULL_TIME
                }
            }),

            edge_case_income: this.generateRandomLoanApplication({
                financialInfo: {
                    annualIncome: 50000.99, // Edge case with decimals
                    employmentType: EmploymentType.FULL_TIME
                }
            })
        };
    }

    /**
     * Create loan application with specific overrides
     */
    createLoanApplication(overrides: Partial<LoanApplication>): LoanApplication {
        const defaultApp = this.getDefaultLoanApplication();
        
        return {
            ...defaultApp,
            ...overrides,
            personalInfo: {
                ...defaultApp.personalInfo,
                ...(overrides.personalInfo || {})
            },
            financialInfo: {
                ...defaultApp.financialInfo,
                ...(overrides.financialInfo || {})
            }
        };
    }



    private randomChoice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private generatePhoneNumber(): string {
        const areaCode = this.randomBetween(200, 999);
        const exchange = this.randomBetween(200, 999);
        const number = this.randomBetween(1000, 9999);
        return `${areaCode}-${exchange}-${number}`;
    }

    private generateDateOfBirth(): string {
        const year = this.randomBetween(1960, 2000);
        const month = this.randomBetween(1, 12).toString().padStart(2, '0');
        const day = this.randomBetween(1, 28).toString().padStart(2, '0');
        return `${month}/${day}/${year}`;
    }

    private generateSSN(): string {
        const area = this.randomBetween(100, 999);
        const group = this.randomBetween(10, 99);
        const serial = this.randomBetween(1000, 9999);
        return `${area}-${group}-${serial}`;
    }

    /**
     * Get test data for specific test types
     */
    getDataForTestType(testType: 'smoke' | 'regression' | 'load' | 'negative'): LoanApplication[] {
        switch (testType) {
            case 'smoke':
                return [this.getDefaultLoanApplication()];
                
            case 'regression':
                return Object.values(this.getTestDataSets());
                
            case 'load':
                return Array.from({ length: 10 }, () => this.generateRandomLoanApplication());
                
            case 'negative':
            
                return Object.values(this.getInvalidTestData()).map(invalidData => {
                    const baseApp = this.getDefaultLoanApplication();
                    return { ...baseApp, ...invalidData } as LoanApplication;
                });
                
            default:
                return [this.getDefaultLoanApplication()];
        }
    }
} 