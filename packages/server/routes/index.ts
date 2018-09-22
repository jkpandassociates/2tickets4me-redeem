import { Server } from 'hapi';
import { join } from 'path';
import { existsSync } from 'fs';

import { orderRoutes } from '../controllers/orders.controller';
import { accessCodeRoutes } from '../controllers/access-codes.controller';
import { detailRoutes } from '../controllers/details.controller';

export function register(server: Server, _, next) {

    server.route(orderRoutes);
    server.route(accessCodeRoutes);
    server.route(detailRoutes);

    server.route({
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: './assets',
                redirectToSlash: true,
                listing: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: 'index.html'
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: function(request, reply: any) {
            const pathParts = request.path.split('/');
            const requestedPath = join(__dirname, '..', '..', 'wwwroot', ...pathParts);
            let filePath = join(__dirname, '..', '..', 'wwwroot', 'index.html');

            if (existsSync(requestedPath)) {
                filePath = requestedPath;
            }

            reply.file(filePath);
        }
    });

    next();
}

register['attributes'] = {
    name: 'Routes',
    version: '1.0.0'
}
