import { browser, element, by } from 'protractor';

export class TwotixredeemPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('tix-root h1')).getText();
  }
}
