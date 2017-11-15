// @flow
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import omit from 'lodash/omit';

import { checkAuth } from '../../utils/auth';

export default () => ({
  Default: {
    Course: {
      modules: ({ courseId }, a, { knex }) =>
        knex
          .select()
          .from('course_modules')
          .where('course_id', courseId)
          .then(resultArr =>
            resultArr.map(el => mapKeys(el, (v, k) => camelCase(k)))
          ),
      teacher: ({ teacher }, a, { knex }) =>
        knex
          .select()
          .from('users')
          .where('user_id', teacher)
          .then(result => mapKeys(result[0], (v, k) => camelCase(k))),
    },
  },
  Query: {
    courseGetAll: (p, a, { knex }) =>
      knex
        .select()
        .from('courses')
        .then(resultArr =>
          resultArr.map(el => mapKeys(el, (v, k) => camelCase(k)))
        ),

    courseGet: (p, { courseId }, { knex }) =>
      knex
        .select()
        .from('courses')
        .where('course_id', parseInt(courseId, 10))
        .limit(1)
        .then(result => mapKeys(result[0], (v, k) => camelCase(k))),
  },

  Mutation: {
    courseAddNew: checkAuth()(async (p, args, { knex }) => {
      let id;
      try {
        id = await knex('courses')
          .insert(mapKeys(args, (v, k) => snakeCase(k)))
          .returning('course_id')
          .limit(1)
          .then(r => r[0]);
      } catch (e) {
        return {
          ok: false,
          error: 'Ошибка при создании курса.',
        };
      }

      return {
        ok: true,
        success: id,
      };
    }),
    courseEdit: checkAuth()(async (parent, args, { knex }) => {
      try {
        await knex('courses')
          .update({
            ...mapKeys(omit(args, ['courseId']), (v, k) => snakeCase(k)),
            updated_at: knex.fn.now(),
          })
          .where('course_id', args.courseId)
          .limit(1);

        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: 'Ошибка! Попробуйте позже или обратитесь в службу поддержки',
        };
      }
    }),

    courseDelete: checkAuth()(async (parent, args, { knex }) => {
      try {
        await knex('courses')
          .del()
          .where('course_id', args.courseId)
          .limit(1);
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        };
      }
      return {
        ok: true,
      };
    }),
  },
});
