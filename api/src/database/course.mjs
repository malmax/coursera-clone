// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'courses';

export default () =>
  knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, (table: Object): void => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table.increments('course_id'); // .primary();

        table.string('name').unique();
        table.string('description');
        table.date('start_at');
        table
          .integer('teacher')
          .references('user.user_id')
          .defaultTo(1);

        table.timestamps(true, true);
      })
      .then((): void => console.log(`... created ${tableName}`));
  });

export type CourseType = {
  course_id: number,
  name: string,
  description: string,
  created_at: string,
  updated_at: string,
};
