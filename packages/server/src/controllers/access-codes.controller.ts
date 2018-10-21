import { RouteConfiguration, Request, ReplyNoContinue } from 'hapi';
import { controller, Controller, get, post, validate } from 'hapi-decorators';
import * as Joi from 'joi';

import { getDBContext, DbContext } from '../models';
import { Mailer } from '../infrastructure/mailer';
import { logger } from '../infrastructure/logger';
import { AccessCodeAttributes } from '../models/access-code.model';
import { access } from 'fs';
import { ClientAttributes } from '../models/client.model';

const notificationTemplates = {
  AirlineOrderConfirmation: '2tix-airline-order-confirmation',
  CruiseOrderConfirmation: '2tix-cruise-order-confirmation',
  InternalOrderConfirmation: '2tix-internal-confirmation',
  ErrorOccurred: '2tix-internal-error-occurred'
};

enum ErrorCode {
  CODE_NOT_FOUND = 100,
  CODE_NOT_ACTIVE,
  CLIENT_NOT_FOUND,
  CLIENT_NOT_ACTIVE,
  CODE_LIMIT_EXCEEDED,
  CODE_START_DATE_IN_FUTURE,
  CODE_EXPIRE_DATE_IN_PAST
}

const accessCodeErrors = {
  [ErrorCode.CODE_NOT_FOUND]: '',
  [ErrorCode.CODE_NOT_ACTIVE]: '',
  [ErrorCode.CLIENT_NOT_FOUND]: '',
  [ErrorCode.CLIENT_NOT_ACTIVE]: '',
  [ErrorCode.CODE_LIMIT_EXCEEDED]:
    'The maximum redemptions for this code has been exceeded.',
  [ErrorCode.CODE_START_DATE_IN_FUTURE]: 'The start date is in the future.',
  [ErrorCode.CODE_EXPIRE_DATE_IN_PAST]: 'The expire date is in the past.'
};

const getErrorDetails = (
  errorCode: ErrorCode
): { errorCode: string; errorMessage: string } => {
  const errorCodeStr = ErrorCode[errorCode];
  const errorMessage = accessCodeErrors[errorCode];
  return { errorCode: errorCodeStr, errorMessage };
};

@controller('/api/accesscodes')
class AccessCodesController implements Controller {
  private _db: DbContext;
  private _mailer: Mailer;

  baseUrl: string;
  routes: () => RouteConfiguration[];

  // TODO: Add security
  @get('/')
  getAccessCodes(request: Request, reply: ReplyNoContinue): void {
    const { code } = <{ [key: string]: string }>request.query;
    const where: any = {};

    if (code) {
      where.Code = { $eq: code };
    }

    this._db.AccessCode.findAll({ where })
      .then(accessCodes => {
        reply({ data: accessCodes });
      })
      .catch(error => {
        logger.error(error);
        reply(error);
      });
  }

  @get('/validate')
  @validate({
    query: Joi.object({
      code: Joi.string().required()
    })
  })
  async validate(request: Request, reply: ReplyNoContinue) {
    const { code } = request.query;
    try {
      const {
        valid,
        accessCode,
        client,
        errorCode,
        errorMessage
      } = await this.validateAccessCode(code);

      const errorsToNotifyClient = [
        ErrorCode[ErrorCode.CODE_START_DATE_IN_FUTURE],
        ErrorCode[ErrorCode.CODE_EXPIRE_DATE_IN_PAST],
        ErrorCode[ErrorCode.CODE_LIMIT_EXCEEDED]
      ];

      if (
        valid !== true &&
        client !== null &&
        client !== undefined &&
        errorCode !== null &&
        errorCode !== undefined &&
        errorsToNotifyClient.indexOf(errorCode) > -1
      ) {
        await this._mailer.send({
          recipients: [
            {
              address: {
                name: client.ContactName,
                email: client.Email
              },
              substitution_data: {
                CodeName: accessCode.Code,
                ErrorMessage: [
                  errorMessage,
                  'Use of this code has been denied.'
                ].join(' ')
              }
            }
          ],
          content: {
            template_id: '2tix-internal-error-occurred'
          }
        });
      }

      if (valid !== true) {
        logger.debug(
          `Invalid Access Code ${
            errorMessage ? ': ' + errorMessage : ''
          }`.trim(),
          {
            errorCode,
            accessCode: (accessCode && accessCode.Code) || code
          }
        );
      }

      reply({ data: { valid, errorCode, errorMessage } });
    } catch (error) {
      logger.error(error);
      reply(error);
    }
  }

  // TODO: Add security
  @post('/')
  @validate({
    payload: getDBContext().validations.AccessCode.options({
      stripUnknown: true
    })
  })
  create(request: Request, reply: ReplyNoContinue): void {
    const accessCodeValues = request.payload;
    this._db.AccessCode.create(accessCodeValues)
      .then(accessCode => {
        reply({ data: accessCode });
      })
      .catch((error: Error) => {
        const errors: ApiErrors = [];
        let detail = 'Something went wrong';
        let statusCode = 500;
        switch (error.message) {
          case 'DUPLICATE':
            detail = 'The access code you entered is already in use.';
            statusCode = 422;
            break;
        }
        errors.push({
          source: '/api/accesscodes',
          title: error.message,
          detail
        });
        reply({ errors }).code(statusCode);
      });
  }

  setDb(dbContext) {
    this._db = dbContext;
    return this;
  }

  setMailer(mailer) {
    this._mailer = mailer;
    return this;
  }

  // tslint:disable-next-line:max-line-length
  private async validateAccessCode(
    code: string
  ): Promise<{
    valid: boolean;
    accessCode?: AccessCodeAttributes;
    client?: ClientAttributes;
    errorCode?: string;
    errorMessage?: string;
  }> {
    const accessCode = await this._db.AccessCode.findOne({
      where: { Code: code }
    });
    const today = new Date();
    let accessCodeJson: AccessCodeAttributes;
    let client;

    const returnObj = {
      valid: false
    };

    if (accessCode === null || accessCode === undefined) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CODE_NOT_FOUND)
      });
    }

    accessCodeJson = accessCode.toJSON();

    returnObj['accessCode'] = accessCodeJson;

    const {
      Active,
      ClientId,
      StartDate,
      ExpireDate,
      MaxQuantity,
      UsedQuantity
    } = accessCodeJson;

    if (Active !== true) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CODE_NOT_ACTIVE)
      });
    }

    client = await this._db.Client.findById(ClientId);

    if (client === null || client === undefined) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CLIENT_NOT_FOUND)
      });
    }

    returnObj['client'] = client.toJSON();

    if (client.get('Active') !== true) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CLIENT_NOT_ACTIVE)
      });
    }

    if (StartDate && StartDate > today) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CODE_START_DATE_IN_FUTURE)
      });
      // tslint:disable-next-line:no-else-after-return
    } else if (
      accessCode.get('ExpireDate') &&
      accessCode.get('ExpireDate') < today
    ) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CODE_EXPIRE_DATE_IN_PAST)
      });
    } else if (MaxQuantity && UsedQuantity && MaxQuantity <= UsedQuantity) {
      return Promise.resolve({
        ...returnObj,
        ...getErrorDetails(ErrorCode.CODE_LIMIT_EXCEEDED)
      });
    }

    return Promise.resolve({
      ...returnObj,
      valid: true
    });
  }
}

export const accessCodeRoutes = new AccessCodesController()
  .setDb(getDBContext())
  .setMailer(new Mailer())
  .routes();
