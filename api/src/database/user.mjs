// @flow
import Knex from 'knex';
import config, { type configType } from '../config';

type KnexType = any;

const knex: KnexType = Knex(config.db);
const tableName: string = 'users';

export default () =>
  knex.schema.hasTable(tableName).then((exists: Boolean): Promise<any> => {
    if (exists) return Promise.resolve(`${tableName} exists`);

    return knex.schema
      .createTable(tableName, (table: Object): void => {
        console.log(`Creating ${tableName} in `, table.client.config.client);

        table.increments('user_id'); // .primary();

        table
          .string('email')
          .unique()
          .comment('Email authorization');
        table.boolean('verified_email').defaultTo(false);
        table.string('password');
        table.uuid('refresh_token_secret');
        // .defaultTo(knex.raw('uuid_generate_v4()'));

        // profile
        table.string('name', 255);
        table.integer('timezone').defaultTo(3);
        table.enum('role', config.user.roles);

        table.timestamps(true, true);
      })
      .then((): void => console.log(`... created ${tableName}`));
  });

export type UserType = {
  user_id: number,
  email: string,
  password: string,
  name: ?string,
  timezone: ?number,
  role: string,
  created_at: ?string,
  updated_at: ?string,
};

export type UserTypeCamel = {
  userId: number,
  email: string,
  password: string,
  name: ?string,
  timezone: ?number,
  role: string,
  createdAt: ?string,
  updatedAt: ?string,
};
