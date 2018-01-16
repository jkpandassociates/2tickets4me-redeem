import { browser, element, by, protractor, ElementFinder, promise } from 'protractor';

interface Entries { [field: string]: string; };

export class OrderPage {
    navigateTo() {
        return browser.get('/order');
    }

    async navigatedTo(url: string) {
        const currentUrl = await browser.getCurrentUrl();
        return currentUrl.endsWith(url);
    }

    getCardHeading() {
        return element(by.css('md-card-title')).getText();
    }

    click(eleTarget: string) {
        return element(by.css(eleTarget)).click();
    }

    async enterText(entries: Entries): Promise<void> {
        for (const entry in entries) {
            const value = entries[entry];
            await element(by.css(`[formcontrolname="${entry}"]`)).sendKeys(value);
        }
    }

    async getText(field: string) {
        return await element(by.css(`[formcontrolname="${field}"]`)).getText();
    }

    getValue(field: string) {
        return element(by.css(`[formcontrolname="${field}"]`)).getAttribute('value');
    }

    async hasErrorDialog() {
        const count = await element.all(by.css('tix-error-dialog')).count();
        return !!(count);
    }
}
