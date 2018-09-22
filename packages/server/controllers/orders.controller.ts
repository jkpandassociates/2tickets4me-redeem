import { RouteConfiguration, Request, ReplyNoContinue } from 'hapi';
import { controller, Controller, get, post, validate } from 'hapi-decorators';
import * as Req from 'request';
import * as moment from 'moment';

import { getDBContext, DbContext } from '../models';
import { Mailer } from '../infrastructure/mailer';
import { logger } from '../infrastructure/logger';

const notificationTemplates = {
    AirlineOrderConfirmation: '2tix-airline-order-confirmation',
    CruiseOrderConfirmation: '2tix-cruise-order-confirmation',
    InternalOrderConfirmation: '2tix-internal-confirmation',
    ErrorOccurred: '2tix-internal-error-occurred'
}

@controller('/api/orders')
class OrdersController implements Controller {

    private _db: DbContext;
    private _mailer: Mailer;

    baseUrl: string;
    routes: () => RouteConfiguration[];

    @get('/')
    getOrders(request: Request, reply: ReplyNoContinue) {
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

    @get('/{serial}')
    getOrder(request: Request, reply: ReplyNoContinue) {
        const serialNumber = request.params['serial'];
        this._db.Order.findOne({ where: { SerialNumber: serialNumber } })
            .then(order => {
                if (!order) {
                    reply(new Error('Invalid Serial Number'));
                    return;
                }
                reply({ data: order });
            });
    }

    @get('/{serial}/regcard.png')
    orderImage(request: Request, reply: ReplyNoContinue) {
        const serialNumber = request.params['serial'];
        this._db.Order.findOne({ where: { SerialNumber: serialNumber } })
            .then(o => {
                if (!o) {
                    reply(new Error('Invalid Serial Number'));
                    return;
                }
                const order = o.toJSON();
                const issueDate = moment(order.Date).format('L');

                // TODO: Needs to be migrated to serverless service
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
    async create(request: Request, reply: ReplyNoContinue) {
        const orderValues = request.payload;

        try {

            const accessCode = await this._db.AccessCode.findOne({ where: { Code: orderValues.CodeName } });

            orderValues.IPAddress = request.headers['x-forwarded-for'] || request.info.remoteAddress;

            const order = await this._db.Order.create(orderValues);

            await accessCode.increment('UsedQuantity');

            const orderData = order.toJSON();
            orderData['ConfirmationUrl'] = `http://${process.env.HOST}/order/${orderData.SerialNumber}`;

            await this._notify([
                {
                    address: {
                        name: `${orderData.FirstName} ${orderData.LastName}`,
                        email: orderData.Email
                    },
                    substitution_data: orderData
                }
            ], notificationTemplates.AirlineOrderConfirmation);

            reply({ data: order });

        } catch (error) {
            let statusCode = 500;
            if (error instanceof Error) {
                const errors: ApiErrors = [];
                let detail = 'Something went wrong';
                switch (error.message) {
                    case 'DUPLICATE':
                        detail = 'You are attempting to register multiple times.<br /><br />' +
                                 'Please contact <a href="mailto:techsupport@2tickets4me.com">techsupport@2tickets4me.com</a>' +
                                 'if you have a concern regarding your registration.';
                        statusCode = 422;
                        break;
                }
                errors.push({
                    source: '/api/orders',
                    title: error.message,
                    detail: detail
                });
                error = { errors };
            }

            reply(error).code(statusCode);
        }
    }

    private _notify(recipients: Recipient[], template_id?: string, emailContent?: { subject: string; html?: string; text?: string; }) {
        let subject: string;
        let html: string;
        let text: string;
        if (!template_id && !emailContent) {
            throw new Error('missing template_id and emailContent');
        }
        if (emailContent) {
            subject = emailContent.subject;
            html = emailContent.html;
            text = emailContent.text;
            if (!html && !text) {
                throw new Error('missing html and text');
            }
        }
        const transmission = {
            recipients,
            content: {
                template_id,
                use_draft_template: true,
                subject,
                html,
                text
            }
        };

        return this._mailer.send(transmission);
    }

    setDb(dbContext) {
        this._db = dbContext;
        return this;
    }

    setMailer(mailer) {
        this._mailer = mailer;
        return this;
    }
}

export const orderRoutes = new OrdersController().setDb(getDBContext()).setMailer(new Mailer()).routes();
