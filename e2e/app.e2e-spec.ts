import { TmpCliAppPage } from './app.po';

describe('tmp-cli-app App', function() {
  let page: TmpCliAppPage;

  beforeEach(() => {
    page = new TmpCliAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
