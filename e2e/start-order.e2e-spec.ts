import { StartOrderPage } from './start-order.page';
import { browser, element, ExpectedConditions, by } from 'protractor';

describe('/start-order page', function () {
    let page: StartOrderPage;

    beforeEach(async function() {
        page = new StartOrderPage();
        await page.navigateTo();
    });

    afterEach(() => {
        browser.executeScript(`
            localStorage.clear();
        `);
    });

    it('should display a card heading', async function() {
        const cardHeading = await page.getCardHeading();
        return expect(cardHeading).toEqual('Congratulations!');
    });

    it('should not show error dialog', async function() {
        await page.click('button');
        return expect(await page.hasErrorDialog()).toBeFalsy();
    });

    it('should show error dialog', async function() {
        await page.enterAccessCode('foo'); // Invalid code
        await page.click('button');
        return expect(await page.hasErrorDialog()).toBeTruthy();
    });

    it('should navigate to /order', async function() {
        await page.enterAccessCode('2ticketsDemo'); // Valid code
        await page.click('button');
        return expect(await page.navigatedTo('/order')).toBeTruthy();
    });
});
