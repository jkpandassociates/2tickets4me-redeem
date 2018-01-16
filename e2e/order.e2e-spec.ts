import { OrderPage } from './order.page';
import { StartOrderPage } from './start-order.page';
import { browser, element, by } from 'protractor';

describe('/order page', function () {
    let start: StartOrderPage;
    let page: OrderPage;
    let started = false;

    beforeEach(async function() {
        start = new StartOrderPage();
        if (!started) {
            started = true;
            await start.navigateTo();
            await start.enterAccessCode('2ticketsDemo');
            await start.click('button');
        } else {
            page.navigateTo();
        }
        page = new OrderPage();
    });

    it('should display a card heading', async function() {
        const cardHeading = await page.getCardHeading();
        return expect(cardHeading).toEqual('E-Ticket Registration Form');
    });

    it('should have validation errors', async function() {
        expect(await element.all(by.css('.alert')).count()).toEqual(0);
        page.click('button[type="submit"]');
        return expect(await element.all(by.css('.alert')).count()).toEqual(12);
    });

    it('should require terms are agreed to', async function() {
        await page.enterText({
            FirstName: 'John',
            LastName: 'Doe',
            Address: '111',
            City: 'Salem',
            ZipCode: '98001',
            Phone: '555-555-5555',
            Email: 'john@doe.com',
            Destination: 'Bermuda',
            Sponsor: 'JKP',
            RepresentativeName: 'John Priest'
        });

        page.click('button[type="submit"]');

        expect(await element.all(by.css('.alert')).count()).toEqual(2);

        await page.click('[formcontrolname="State"]');

        // wait a bit for options to be revealed
        await browser.sleep(1000);

        await page.click('[ng-reflect-value="OR"]');

        page.click('button[type="submit"]');

        return expect(await element.all(by.css('.alert')).count()).toEqual(1);
    });
});
