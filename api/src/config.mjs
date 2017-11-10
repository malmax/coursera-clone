// @flow
import rc from 'rc';

const APPNAME: string = 'API';

const config = {
  user: {
    roles: ['admin', 'teacher', 'client'],
  },
  payment: {
    types: ['cash', 'liqpay'],
  },
  db: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
  },
};

export type configType = {
  user: {
    roles: [string],
  },
  payment: {
    types: [string],
  },
  db: {
    client: string,
    connection: {
      filename: string,
    },
  },
};

export default rc(APPNAME, config);