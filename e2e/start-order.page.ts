import { browser, element, by } from 'protractor';

export class StartOrderPage {
    navigateTo() {
        return browser.get('/start-order');
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

    enterAccessCode(code: string) {
        return element(by.css('input')).sendKeys(code);
    }

    async hasErrorDialog() {
        const count = await element.all(by.css('tix-error-dialog')).count();
        return !!(count);
    }
}
