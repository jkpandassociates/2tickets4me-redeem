import { browser, element, by } from 'protractor';

export class StartOrderPage {
    async navigateTo() {
        return await browser.get('/start-order');
    }

    async getCardHeading() {
        return await element(by.css('md-card-title')).getText();
    }
}
