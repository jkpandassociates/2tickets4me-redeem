import { compose } from 'glue';
import { join } from 'path';
import { existsSync } from 'fs';

if (existsSync(join(__dirname, '..', '.env'))) {
    require('dotenv').config(); // Load environment variables
}

import { get } from './manifest';

compose(get('/'), { relativeTo: __dirname }, (_, server) => {
    const web: typeof server = <any>server.select('web');
    server.start(() =>
        server.log('info', 'Server running at: ' + web.info.uri)
    );
});
