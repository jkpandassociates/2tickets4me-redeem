import { Store } from 'confidence';

import * as config from './config';

const criteria = {
    env: process.env.NODE_ENV || 'development'
};

let store: Store,
    manifest: any;

manifest = {
    $meta: 'server setup',
    connections: [config.get('/server')],
    registrations: [
        // Third Party Plugins
        {
            plugin: {
                register: 'good',
                options: config.get('/good')
            }
        },
        {
            plugin: 'inert'
        },

        // App Routes
        {
            plugin: {
                register: './routes',
                options: config.get('/routes')
            }
        }
    ]
};

store = new Store(manifest);

export const get = (key) => {
    return store.get(key, criteria);
};

export const meta = (key) => {
    return store.meta(key, criteria);
};
