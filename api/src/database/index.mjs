import Bluebird from 'bluebird';

import user from './user';
import course from './course';
import courseModule from './courseModule';
import payment from './payment';

user()
  .then(() => course())
  .then(() => courseModule())
  .then(() => payment());
// Bluebird.map([user, course, courseModule, payment], r => r, { concurrency: 1 });
