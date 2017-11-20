// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'transactions';

export default () =>
  knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, table => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table.increments('transaction_id');
        table
          .integer('user_id')
          .index()
          .notNullable()
          .references('users.user_id');
        table
          .boolean('paid')
          .notNullable()
          .defaultTo(false);
        table.date('pay_until');
        table.string('comment');
        table.integer('amount');

        table.timestamps(true, true);
      })
      .then((): void => console.log(`... created ${tableName}`));
  });

export type TransactionType = {
  transaction_id: number,
  user_id: number,
  comment: string,
  amount: number,
  paid: boolean,
  created_at: string,
  updated_at: string,
};
