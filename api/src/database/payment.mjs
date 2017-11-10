// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'payment';

export default () => knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, table => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table
          .integer('course_module_id')
          .primary()
          .notNullable()
          .references('course_module.course_module_id');
        table
          .integer('user_id')
          .index()
          .notNullable()
          .references('user.user_id');

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
  created_at: string,
  updated_at: string,
};
