import { Server } from 'hapi';
import { join } from 'path';

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
        handler: function(_, reply) {
            reply.file(join(__dirname, '..', '..', 'wwwroot', 'index.html'));
        }
    });

    next();
}

register['attributes'] = {
    name: 'Routes',
    version: '1.0.0'
}