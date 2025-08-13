import { Page } from "@playwright/test";
import { WithULoansPage } from "./loan.component";

export class Components {

    readonly loanApplication: WithULoansPage;
    readonly page: Page;

    constructor(page: Page) {
        this.loanApplication = new WithULoansPage(page);
        this.page = page;
    }

    async waitForFlutterLoad() {
        // Wait for Flutter to initialize based on the load event in HTML
        await this.page.waitForFunction(() => {
            return (window as any)._flutter?.loader?.didCreateEngineInitializer === true;
        }, { timeout: 30000 });
        
        // Wait for semantic host as seen in HTML structure
        return await this.page.waitForSelector('flt-semantics-host', { state: 'attached' });
    }

    async waitForSemanticElements() {
        // Based on the HTML setTimeout that checks for semantic elements after 3 seconds
        await this.page.waitForTimeout(3000);
        return await this.page.waitForSelector('[data-semantics-role="text-field"]', { state: 'visible' });
    }

    get flutterView() {
        return this.page.locator('flutter-view[flt-view-id="0"]');
    }

    get semanticsHost() {
        return this.page.locator('flt-semantics-host');
    }
}