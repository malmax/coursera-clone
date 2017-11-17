// @flow
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import omit from 'lodash/omit';

import { checkAuth } from '../../utils/auth';

export default () => ({
  Default: {
    CourseModule: {
      Course: (parent, args, { knex }) =>
        knex
          .select()
          .from('courses')
          .where('course_id', parent.courseId)
          .limit(1)
          .then(r => mapKeys(r[0], (v, k) => camelCase(k))),
    },
  },
  Query: {
    courseGetModules: (p, { courseId }, { knex }) =>
      knex
        .select()
        .from('course_modules')
        .where('course_id', courseId)
        .then(resultArr =>
          resultArr.map(el => mapKeys(el, (v, k) => camelCase(k)))
        ),

    courseModuleGetAll: (p, a, { knex }) =>
      knex
        .select()
        .from('course_modules')
        .then(resultArr =>
          resultArr.map(el => mapKeys(el, (v, k) => camelCase(k)))
        ),
  },

  Mutation: {
    courseModuleAddNew: checkAuth()(async (p, args, { knex }) => {
      let id;
      try {
        id = await knex('course_modules')
          .insert(mapKeys(args, (v, k) => snakeCase(k)))
          .returning('course_id')
          .limit(1)
          .then(r => r[0]);
      } catch (e) {
        return {
          ok: false,
          error: 'Ошибка при создании модуля курса.',
        };
      }

      return {
        ok: true,
        success: id,
      };
    }),

    courseModuleDelete: checkAuth()(async (parent, args, { knex }) => {
      try {
        await knex('course_modules')
          .del()
          .where('course_module_id', args.courseModuleId)
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
