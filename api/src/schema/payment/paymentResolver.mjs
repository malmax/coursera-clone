// @flow
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import omit from 'lodash/omit';

import { checkAuth } from '../../utils/auth';

export default () => ({
  Default: {},
  Query: {},
  Mutation: {},
});
