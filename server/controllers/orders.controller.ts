import { IRouteConfiguration, Request, IReply } from 'hapi';
import { controller, Controller, get, post, validate } from 'hapi-decorators';
import * as Req from 'request';
import * as moment from 'moment';

import { getDBContext, DbContext } from '../models';

@controller('/api/orders')
class OrdersController implements Controller {

    private _db: DbContext;

    constructor(getDBContext) {
        this._db = getDBContext();
    }

    baseUrl: string;
    routes: () => IRouteConfiguration[];

    @get('/')
    getOrders(request: Request, reply: IReply) {
        const {firstName, lastName, codeName, sponsor} = request.query;

        const where: any = {};

        if (firstName) {
            where.FirstName = { $like: `${firstName}%` };
        }
        if (lastName) {
            where.LastName = { $like: `${lastName}%` };
        }
        if (codeName) {
            where.CodeName = { $like: `${codeName}%` };
        }
        if (sponsor) {
            where.Sponsor = { $like: `${sponsor}%` };
        }

        this._db.Order.findAll({
            where
        }).then(orders => {
            reply({ data: orders });
        });
    }

    @get('/{serial}/regcard.png')
    orderImage(request: Request, reply: IReply) {
        const serialNumber = request.params['serial'];
        this._db.Order.findOne({ where: { SerialNumber: serialNumber } })
            .then(o => {
                if (!o) {
                    reply(new Error('Invalid Serial Number'));
                    return;
                }
                const order = o.toJSON();
                const issueDate = moment(order.Date).format('L');
                let imageUrl = 'http://2tickets4me.com/2tickets4me/images/regcard.php';
                imageUrl += `?name=${order.FirstName} ${order.LastName}`;
                imageUrl += `&email=${order.Email}`;
                imageUrl += `&add1=${order.Address}`;
                imageUrl += `&add2=${order.City}, ${order.State} ${order.ZipCode}`;
                imageUrl += `&work=${order.WorkPhone}`;
                imageUrl += `&home=${order.Phone}`;
                imageUrl += `&sponsor=${order.Sponsor}`;
                imageUrl += `&auth=${order.RepresentativeName}`;
                imageUrl += `&c=${order.CodeName}`;
                imageUrl += `&serial=${order.SerialNumber}`;
                imageUrl += `&date=${issueDate}`;
                Req(imageUrl).on('response', (response) => {
                    reply(response).header('Content-Type', 'image/png');
                });
            });
    }

    @post('/')
    @validate({
        payload: getDBContext().validations.Order.options({ stripUnknown: true }),

    })
    create(request: Request, reply: IReply) {
        const orderValues = request.payload;

        orderValues.IPAddress = request.headers['x-forwarded-for'] || request.info.remoteAddress;

        this._db.Order.create(orderValues)
            .then(order => {
                reply({ data: order });
            }).catch((error: Error) => {
                const errors: ApiErrors = [];
                let detail = 'Something went wrong';
                let statusCode = 500;
                switch(error.message) {
                    case 'DUPLICATE':
                        detail = 'You are attempting to register multiple times.<br /><br />Please contact <a href="mailto:techsupport@2tickets4me.com">techsupport@2tickets4me.com</a> if you have a concern regarding your registration.';
                        statusCode = 422;
                        break;
                }
                errors.push({
                    source: '/api/orders',
                    title: error.message,
                    detail: detail
                });
                reply({ errors }).code(statusCode);
            });
    }
}

export const orderRoutes = new OrdersController(getDBContext).routes();
