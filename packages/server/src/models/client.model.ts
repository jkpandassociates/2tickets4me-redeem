import * as Sequelize from 'sequelize';
import * as Joi from 'joi';
import moment from 'moment';

export interface ClientAttributes {
    Id: number;
    Type: number;
    ContactName: string;
    StreetOne: string;
    StreetTwo: string;
    City: string;
    State: string;
    ZipCode: number;
    Phone: string;
    Email: string;
    Active: boolean;
    SurveyUrl: string;
    SurveyPassword: string;
    Notes: string;
    CreatedAt: Date;
}

export interface ClientInstance extends Sequelize.Instance<ClientAttributes> {}

export function defineModel(sequelize: Sequelize.Sequelize, dataTypes: Sequelize.DataTypes) {
    return sequelize.define<ClientInstance, ClientAttributes>('Client', {
        Id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'client_id'
        },
        Type: {
            type: dataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
            field: 'client_type'
        },
        ContactName: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'client_contact'
        },
        StreetOne: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'client_street1'
        },
        StreetTwo: {
            type: dataTypes.STRING,
            field: 'client_street2'
        },
        City: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'client_city'
        },
        State: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'client_state'
        },
        ZipCode: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: 'client_zip'
        },
        Phone: {
            type: dataTypes.STRING,
            field: 'client_phone'
        },
        Email: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'client_email'
        },
        Active: {
            type: dataTypes.INTEGER,
            field: 'client_enabled',
            get: function getActive(this: ClientInstance): boolean {
                const active: number = this.getDataValue('Active');
                return !!(active);
            },
            set: function setActive(this: ClientInstance, val: boolean) {
                this.setDataValue('Active', val ? 1 : 0);
            }
        },
        SurveyUrl: {
            type: dataTypes.STRING,
            field: 'client_survey'
        },
        SurveyPassword: {
            type: dataTypes.STRING,
            field: 'client_survey_pass'
        },
        Notes: {
            type: dataTypes.STRING,
            field: 'client_notes'
        },
        CreatedAt: {
            type: dataTypes.INTEGER,
            allowNull: false,
            field: 'client_reg_date',
            get: function getDate(this: ClientInstance): Date {
                const expireTime = this.getDataValue('CreatedAt');
                if (expireTime) {
                    const date = new Date(0);
                    date.setUTCSeconds(expireTime);
                    return date;
                }

                return null;
            },
            set: function setDate(this: ClientInstance, val: Date) {
                const timestamp = moment(val).unix();
                this.setDataValue('CreatedAt', timestamp);
            }
        }
    }, {
        createdAt: false,
        updatedAt: false,
        tableName: 'jkp_clients'
    });
}

export const associate = function (_: Sequelize.Sequelize) {}

export const validations = Joi.object({});
