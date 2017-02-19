import { TwotixredeemPage } from './app.po';

xdescribe('twotixredeem App', function() {
  let page: TwotixredeemPage;

  beforeEach(() => {
    page = new TwotixredeemPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tix works!');
  });
});
