import { IRouteConfiguration, Request, IReply } from 'hapi';
import { controller, Controller, get, post, validate } from 'hapi-decorators';

import { getDBContext, DbContext } from '../models';

@controller('/api/accesscodes')
class AccessCodesController implements Controller {

    private _db: DbContext;

    constructor(getDBContext) {
        this._db = getDBContext();
    }

    baseUrl: string;
    routes: () => IRouteConfiguration[];

    @get('/')
    getAccessCodes(request: Request, reply: IReply): void {
        const { code } = <{ [key: string]: string }>request.query;
        const where: any = {};

        if (code) {
            where.Code = { $eq: `${code}` }
        }

        this._db.AccessCode.findAll({ where }).then(accessCodes => {
            reply({ data: accessCodes });
        });
    }

    @post('/')
    @validate({
        payload: getDBContext().validations.AccessCode.options({ stripUnknown: true }),

    })
    create(request: Request, reply: IReply): void {
        const accessCodeValues = request.payload;
        this._db.AccessCode.create(accessCodeValues)
            .then(accessCode => {
                reply({ data: accessCode });
            }).catch((error: Error) => {
                const errors: ApiErrors = [];
                let detail = 'Something went wrong';
                let statusCode = 500;
                switch(error.message) {
                    case 'DUPLICATE':
                        detail = 'The access code you entered is already in use.';
                        statusCode = 422;
                        break;
                }
                errors.push({
                    source: '/api/accesscodes',
                    title: error.message,
                    detail: detail
                });
                reply({ errors }).code(statusCode);
            });
    }
}

export const accessCodeRoutes = new AccessCodesController(getDBContext).routes();
