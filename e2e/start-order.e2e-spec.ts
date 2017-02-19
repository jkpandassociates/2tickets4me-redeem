import { StartOrderPage } from './start-order.page';
import { browser, element, ExpectedConditions, by } from 'protractor';

describe('/start-order page', function () {
    let page: StartOrderPage;

    beforeEach(() => {
        page = new StartOrderPage();
    });

    it('should display a card heading', async function () {
        await page.navigateTo();
        let cardHeading = await page.getCardHeading();
        return expect(cardHeading).toEqual('Congratulations!');
    });
});
