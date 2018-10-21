import * as Sequelize from 'sequelize';
import * as Joi from 'joi';
import moment from 'moment';

export interface OrderAttributes {
  SerialNumber: string;
  FirstName: string;
  LastName: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: number;
  Email: string;
  Phone: string;
  WorkPhone: string;
  IPAddress: string;
  Destination: string;
  CodeName: string;
  Date: Date;
  Sponsor: string;
  RepresentativeName: string;
}

export interface OrderInstance extends Sequelize.Instance<OrderAttributes> {}

export function defineModel(
  sequelize: Sequelize.Sequelize,
  dataTypes: Sequelize.DataTypes
) {
  return sequelize.define<OrderInstance, OrderAttributes>(
    'Order',
    {
      Id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'reg_id'
      },
      SerialNumber: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_serial'
      },
      FirstName: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_firstname'
      },
      LastName: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_lastname'
      },
      Address: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_address'
      },
      City: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_city'
      },
      State: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_state'
      },
      ZipCode: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: 'reg_zip'
      },
      Email: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_email',
        validate: {
          isEmail: true
        }
      },
      Phone: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_phone'
      },
      WorkPhone: {
        type: dataTypes.STRING,
        field: 'reg_wphone',
        defaultValue: ''
      },
      IPAddress: {
        type: dataTypes.STRING,
        field: 'ip_address',
        allowNull: false,
        validate: {
          isIP: true
        }
      },
      Destination: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_destination'
      },
      CodeName: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'code_name'
      },
      Date: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: 'reg_date',
        get: function getDate(this: OrderInstance) {
          const date = new Date(0);
          date.setUTCSeconds(this.getDataValue('Date'));
          return date;
        },
        set: function setDate(this: OrderInstance, val: Date) {
          const timestamp = moment(val).unix();
          this.setDataValue('Date', timestamp);
        }
      },
      Sponsor: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_sponsor'
      },
      RepresentativeName: {
        type: dataTypes.STRING,
        allowNull: false,
        field: 'reg_repname'
      }
    },
    {
      createdAt: false,
      updatedAt: false,
      tableName: 'jkp_registered',
      hooks: {
        beforeValidate
      }
    }
  );
}

export const associate = function(_: Sequelize.Sequelize) {};

export const validations = Joi.object({
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  Address: Joi.string().required(),
  City: Joi.string().required(),
  State: Joi.string().required(),
  ZipCode: Joi.number().required(),
  Email: Joi.string()
    .email()
    .required(),
  Phone: Joi.string().required(),
  WorkPhone: Joi.string()
    .optional()
    .allow(['', null]),
  Destination: Joi.string().required(),
  CodeName: Joi.string().required(),
  Sponsor: Joi.string().required(),
  RepresentativeName: Joi.string().required()
});

function beforeValidate(
  this: Sequelize.Model<OrderInstance, OrderAttributes>,
  order: OrderInstance,
  _: Sequelize.DefineOptions<OrderInstance>,
  done: (error?: any, value?: any) => any
) {
  if (order.isNewRecord) {
    order.set('Date', new Date());
    order.set('SerialNumber', generateSerialNumber());

    // validate this is not a duplicate entry
    this.findAndCount({
      where: {
        $and: [
          {
            FirstName: {
              $like: `${order.get('FirstName')}`
            }
          },
          {
            $or: [
              {
                LastName: {
                  $like: `${order.get('LastName')}`
                }
              },
              {
                Phone: {
                  $eq: `${order.get('Phone')}`
                }
              },
              {
                Email: {
                  $like: `${order.get('Email')}`
                }
              }
            ]
          }
        ]
      }
    })
      .then(data => {
        const { count } = data;
        if (!count) {
          done();
        } else {
          done('DUPLICATE');
        }
      })
      .catch(error => {
        done(error);
      });
  } else {
    done();
  }
}

function generateSerialNumber(): string {
  const num = randomNumber(8);
  const date = moment().format('MMDD');
  return `${num}-${date}`;
}

function randomNumber(length = 1) {
  let num = '20';

  for (let i = 0; i < length - 2; i = i + 1) {
    num += Math.floor(Math.random() * 10); // 0 - 9
  }

  return num;
}
