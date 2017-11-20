// @flow
import rc from 'rc';

const APPNAME: string = 'API';

export type configType = {
  auth: {
    dev: boolean,
    SECRET: string,
  },
  user: {
    roles: Array<string>,
  },
  payment: {
    merchant_id: number,
    merchantPassword: string,
    types: Array<string>,
    fondyUrl: string,
    fondyCheckUrl: string,
  },
  db: {
    client: string,
    connection: {
      filename: string,
    },
  },
};

const config: configType = {
  auth: {
    dev: true,
    SECRET: 'dfgfgnkdngkqn4fnkqnlfdnkc ak amlkwPQjo2h&4gqhnrbshn',
  },
  user: {
    roles: ['admin', 'teacher', 'client'],
  },
  payment: {
    types: ['cash', 'card'],
    merchant_id: 1404610,
    merchantPassword: 'o0tfxeCvIohwYDvE4KQwJ9RsqKDoneAQ',
    fondyUrl: 'https://api.fondy.eu/api/checkout/url/',
    fondyCheckUrl: 'https://api.fondy.eu/api/status/order_id',
  },
  db: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
  },
};

export default rc(APPNAME, config);
