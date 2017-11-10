// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'course_module';

export default () => knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, (table: Object): void => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table.increments('course_module_id'); // .primary();

        table
          .integer('course_id')
          .references('course.course_id')
          .notNullable()
          .index();

        table.string('name');
        table.string('description');

        table.integer('price');
        table.date('start_date');
        table.date('end_date');

        table.integer('teacher').references('user.user_id');

        table.timestamps(true, true);
      })
      .then((): void => console.log(`... created ${tableName}`));
  });

export type CourseModuleType = {
  course_module_id: number,
  course_id: number,
  name: string,
  description: string,
  price: number,
  start_date: string,
  end_date: string,
  teacher: number,
  created_at: string,
  updated_at: string,
};
