import config from '../../playwright.config';
import { LoanApplicationAutomator } from './loan.automator.service';
import { Page } from '@playwright/test';


export class Services {
  
    loanApplicationAutomator: LoanApplicationAutomator;

    constructor(page: Page) {
        this.loanApplicationAutomator = new LoanApplicationAutomator(page);
    }

    getBaseURL(): string {
        return `${config.use?.baseURL}`;
    }

}