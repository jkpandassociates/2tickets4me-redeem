import { IRouteConfiguration, Request, IReply } from 'hapi';
import { controller, Controller, get, post, validate } from 'hapi-decorators';
import * as Joi from 'joi';

import { getDBContext, DbContext } from '../models';
import { Mailer } from '../infrastructure/mailer';

const notificationTemplates = {
    AirlineOrderConfirmation: '2tix-airline-order-confirmation',
    CruiseOrderConfirmation: '2tix-cruise-order-confirmation',
    InternalOrderConfirmation: '2tix-internal-confirmation',
    ErrorOccurred: '2tix-internal-error-occurred'
}

@controller('/api/accesscodes')
class AccessCodesController implements Controller {

    private _db: DbContext;
    private _mailer: Mailer;

    constructor(getDBContext) {
        this._db = getDBContext();
        this._mailer = new Mailer();
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

    @get('/validate')
    @validate({
        query: Joi.object({
            code: Joi.string().required()
        })
    })
    async validateAccessCode(request: Request, reply: IReply) {
        const { code } = request.query;
        try {
            let accessCode = await this._db.AccessCode.findOne({ where: { Code: code } });
            let today = new Date();
            let error: string;
            let valid = false;
            if (!accessCode || accessCode.get('Active') === false) {
                // Not an error... but invalid
            } else if (accessCode.get('StartDate') && accessCode.get('StartDate') > today) {
                error = `The access code start date is ${accessCode.get('StartDate')}. Today is ${today}. Use of this code has been denied.`;
            } else if (accessCode.get('ExpireDate') && accessCode.get('ExpireDate') < today) {
                error = `The access code expire date is ${accessCode.get('ExpireDate')}. Today is ${today}. Use of this code has been denied.`;
            } else if (accessCode.get('MaxQuantity') && accessCode.get('UsedQuantity') && accessCode.get('MaxQuantity') <= accessCode.get('UsedQuantity')) {
                error = 'The access code has been redeem the maximun number of times. Use of this code has been denied.';
            } else {
                valid = true;
            }

            if (error) {
                reply({ data: { valid } });
                // TODO: get client and send notification to `client_email`.

                // Send notification
                // this._mailer.send({ }).then(() => {
                //     reply({ data: { valid } });
                // });
            } else {
                reply({ data: { valid } });
            }
        } catch (error) {
            debugger;
        }
    }

    @post('/')
    @validate({
        payload: getDBContext().validations.AccessCode.options({ stripUnknown: true })
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
