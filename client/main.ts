import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

const appMetaData = `
/***********************************
 * Application: ${environment.name}
 * Version: ${environment.version}
 * Environment: ${environment.production ? 'Production' : 'Debug'}
 ***********************************/
`;

console.info(appMetaData);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
