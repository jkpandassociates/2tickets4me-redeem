import { Store } from 'confidence';

import * as config from './config';

const criteria = {
  env: process.env.NODE_ENV || 'development'
};

let store: Store;
let manifest: any;

manifest = {
  $meta: 'server setup',
  server: config.get('/server'),
  register: {
    plugins: [
      // Third Party Plugins
      {
        plugin: 'good',
        options: config.get('/good')
      },
      {
        plugin: 'inert'
      },

      // App Routes
      {
        plugin: './routes',
        options: config.get('/routes')
      }
    ]
  }
};

store = new Store(manifest);

export const get = (key) => {
  return store.get(key, criteria);
};

export const meta = (key) => {
  return store.meta(key, criteria);
};
