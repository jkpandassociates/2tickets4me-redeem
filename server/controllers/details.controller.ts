import { IRouteConfiguration, Request, IReply } from 'hapi';
import { controller, Controller, get } from 'hapi-decorators';

const pkg = require('../../package.json');

@controller('/api/details')
class DetailController implements Controller {

    baseUrl: string;
    routes: () => IRouteConfiguration[];

    @get('/')
    index(_: Request, reply: IReply) {
        reply({
            name: pkg.name,
            version: pkg.version,
            environment: process.env.NODE_ENV
        });
    }
}

export const detailRoutes = new DetailController().routes();
