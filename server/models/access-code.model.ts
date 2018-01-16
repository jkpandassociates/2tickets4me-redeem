import * as Sequelize from 'sequelize';
import * as Joi from 'joi';
import * as Moment from 'moment';

export interface AccessCodeAttributes {
    Code: string;
    ClientId: number;
    StartDate: Date;
    ExpireDate: Date;
    MaxQuantity: number;
    UsedQuantity: number;
    Type: number;
    Active: boolean;
    SurveyUrl: string;
    SurveyPassword: string;
    EmailAddressesToNotify: string;
}

export interface AccessCodeInstance extends Sequelize.Instance<AccessCodeAttributes> {}

export function defineModel(sequelize: Sequelize.Sequelize, dataTypes: Sequelize.DataTypes) {
    return sequelize.define<AccessCodeInstance, AccessCodeAttributes>('AccessCode', {
        Id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'code_id'
        },
        Code: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'code_name'
        },
        ClientId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: 'client_id'
        },
        StartDate: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: 'code_start',
            get: function getDate(this: AccessCodeInstance) {
                const startTime = this.getDataValue('StartDate');
                if (startTime) {
                    const date = new Date(0);
                    date.setUTCSeconds(startTime);
                    return date;
                } else {
                    return null;
                }
            },
            set: function setDate(this: AccessCodeInstance, val: Date) {
                const timestamp = Moment(val).unix();
                this.setDataValue('StartDate', timestamp);
            }
        },
        ExpireDate: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: 'code_expire',
            get: function getDate(this: AccessCodeInstance) {
                const expireTime = this.getDataValue('ExpireDate');
                if (expireTime) {
                    const date = new Date(0);
                    date.setUTCSeconds(expireTime);
                    return date;
                } else {
                    return null;
                }
            },
            set: function setDate(this: AccessCodeInstance, val: Date) {
                const timestamp = Moment(val).unix();
                this.setDataValue('ExpireDate', timestamp);
            }
        },
        MaxQuantity: {
            type: dataTypes.INTEGER,
            field: 'code_max_qty'
        },
        UsedQuantity: {
            type: dataTypes.INTEGER,
            field: 'code_used_qty'
        },
        Type: {
            type: dataTypes.INTEGER,
            field: 'code_type',
            defaultValue: 1
        },
        Active: {
            type: dataTypes.INTEGER,
            field: 'code_enabled',
            get: function getDate(this: AccessCodeInstance) {
                const active: number = this.getDataValue('Active');
                return !!(active);
            },
            set: function setDate(this: AccessCodeInstance, val: boolean) {
                this.setDataValue('Active', val ? 1 : 0);
            }
        },
        SurveyUrl: {
            type: dataTypes.STRING,
            field: 'code_survey'
        },
        SurveyPassword: {
            type: dataTypes.STRING,
            field: 'code_survey_pass'
        },
        EmailAddressesToNotify: {
            type: dataTypes.STRING,
            field: 'code_email'
        }
    }, {
        createdAt: false,
        updatedAt: false,
        tableName: 'jkp_access_codes',
        hooks: {
            beforeValidate: beforeValidate
        }
    });
}

export const associate = function (_: Sequelize.Sequelize) {}

export const validations = Joi.object({
    Code: Joi.string().required(),
    ClientId: Joi.number().required(),
    StartDate: Joi.date().required(),
    ExpireDate: Joi.date().required(),
    MaxQuantity: Joi.number().optional().allow(null),
    UsedQuantity: Joi.number().optional().allow(null),
    Type: Joi.number().required(),
    Active: Joi.boolean().required(),
    SurveyUrl: Joi.string().optional().allow(null),
    SurveyPassword: Joi.string().optional().allow(null),
    EmailAddressesToNotify: Joi.string().optional().allow(null)
});

function beforeValidate(
    this: Sequelize.Model<AccessCodeInstance, AccessCodeAttributes>,
    accessCode: AccessCodeInstance, _: Sequelize.DefineOptions<AccessCodeInstance>,
    done: (error?: any, value?: any) => any
) {
    if (accessCode.isNewRecord) {
        // validate this is not a duplicate entry
        this.findAndCount({
            where: {
                Code: {
                    $like: `${accessCode.get('Code')}`
                }
            }
        }).then(data => {
            const { count } = data;
            if (!count) {
                done();
            } else {
                done('DUPLICATE');
            }
        }).catch(error => {
            done(error);
        });
    } else {
        done();
    }

}
