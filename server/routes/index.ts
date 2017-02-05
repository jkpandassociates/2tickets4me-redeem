import { Server } from 'hapi';
import { join } from 'path';
import { existsSync } from 'fs';

export function register(server: Server, _, next) {

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
        path: '/{param*}',
        handler: function(request, reply) {
            let pathParts = request.path.split('/');
            let requestedPath = join(__dirname, '..', '..', 'wwwroot', ...pathParts);
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
