import { RouteConfiguration, Request, ReplyNoContinue } from 'hapi';
import { controller, Controller, get } from 'hapi-decorators';

const pkg = require('../../package.json');

@controller('/api/details')
class DetailController implements Controller {

    baseUrl: string;
    routes: () => RouteConfiguration[];

    @get('/')
    index(_: Request, reply: ReplyNoContinue) {
        reply({
            name: pkg.name,
            version: pkg.version,
            environment: process.env.NODE_ENV
        });
    }
}

export const detailRoutes = new DetailController().routes();
