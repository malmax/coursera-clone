import Bluebird from 'bluebird';

import user from './user';
import course from './course';
import courseModule from './courseModule';
import order from './order';
import transaction from './transaction';

user()
  .then(() => course())
  .then(() => courseModule())
  .then(() => order())
  .then(() => transaction());
// Bluebird.map([user, course, courseModule, payment], r => r, { concurrency: 1 });
