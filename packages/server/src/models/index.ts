import * as Sequelize from 'sequelize';
import { DB } from './db';

// models
import * as Order from './order.model';
import * as AccessCode from './access-code.model';
import * as Client from './client.model';

function init(db: Sequelize.Sequelize, sync?: boolean) {
  const models = {
    Order: db.import('Order', Order.defineModel),
    AccessCode: db.import('AccessCode', AccessCode.defineModel),
    Client: db.import('Client', Client.defineModel)
  };

  const validations = {
    Order: Order.validations,
    AccessCode: AccessCode.validations,
    Client: Client.validations
  };

  const associations = [
    Order.associate,
    AccessCode.associate,
    Client.associate
  ];

  // apply associations
  for (const association of associations) {
    association(db);
  }

  if (sync) {
    // Drop all tables and create
    db.sync({ force: true });
  }

  return {
    models,
    validations
  };
}

export function getDBContext() {
  const sync = process.env.DB_SYNC && process.env.DB_SYNC === 'true';
  const { models, validations } = init(DB, sync);
  return { db: DB, ...models, validations };
}

const dbContext = getDBContext();
export type DbContext = typeof dbContext;
