// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'orders';

export default () =>
  knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, table => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table.increments('order_id');
        table
          .integer('transaction_id')
          .references('transactions.transaction_id');
        table
          .integer('course_module_id')
          .notNullable()
          .references('course_modules.course_module_id');
        table
          .integer('user_id')
          .index()
          .notNullable()
          .references('users.user_id');
        table.unique(['course_module_id', 'user_id']);
        table
          .boolean('paid')
          .notNullable()
          .defaultTo(false);
        table.enu('type', config.payment.types).notNullable();
        table.string('comment');
        table.integer('amount');

        table.timestamps(true, true);
      })
      .then((): void => console.log(`... created ${tableName}`));
  });

export type PaymentType = {
  course_module_id: number,
  user_id: number,
  type: string,
  comment: string,
  amount: number,
  paid: boolean,
  created_at: string,
  updated_at: string,
};
