import * as Sequelize from 'sequelize';
import { DB } from './db';

// models
import * as Order from './order.model';
import * as AccessCode from './access-code.model';

function init(db: Sequelize.Sequelize, sync?: boolean) {
    const models = {
        Order: db.import('Order', Order.defineModel),
        AccessCode: db.import('AccessCode', AccessCode.defineModel)
    }

    const validations = {
        Order: Order.validations,
        AccessCode: AccessCode.validations
    }

    const associations = [
        Order.associate,
        AccessCode.associate
    ];

    // apply associations
    for(let association of associations) {
        association(db);
    }

    if (sync) {
        // Drop all tables and create
        db.sync({ force: true });
    }

    return {
        models,
        validations
    }
}

export function getDBContext() {
    const sync = (process.env.DB_SYNC && process.env.DB_SYNC === "true");
    const {models, validations} = init(DB, sync);
    return { db: DB, ...models, validations };
}

const dbContext = getDBContext();
export type DbContext = typeof dbContext;
