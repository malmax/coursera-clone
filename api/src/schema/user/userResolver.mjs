// @flow
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import omit from 'lodash/omit';

import {
  checkAuthOrOwner,
  hashPassword,
  checkAuth,
  comparePassword,
  generateTokens,
} from '../../utils/auth';
import { normalizeUser, normalizeEmail } from '../../utils/user';
import { sendEmail } from '../../utils/email';

export default () => ({
  Default: {},
  Query: {
    userGetAll: (p, a, { knex }) =>
      knex
        .select()
        .from('users')
        .then(resultArr =>
          resultArr.map(el => mapKeys(el, (v, k) => camelCase(k)))
        ),

    userGet: (p, { userId }, { knex }) =>
      knex
        .select()
        .from('users')
        .where('user_id', parseInt(userId, 10))
        .limit(1)
        .then(result => mapKeys(result[0], (v, k) => camelCase(k))),
  },

  Mutation: {
    userEdit: checkAuthOrOwner()(async (parent, args, { knex }) => {
      try {
        const newUser = normalizeUser(args);

        await knex('users')
          .update({
            ...mapKeys(omit(newUser, ['userId']), (v, k) => snakeCase(k)),
            updated_at: knex.fn.now(),
          })
          .where('user_id', args.userId)
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
    userChangePassword: checkAuthOrOwner()(async (p, args, { knex }) => {
      const password = args.newPassword.trim();
      const oldPassword = args.oldPassword.trim();

      if (password.length < 8) {
        return {
          ok: false,
          error: 'Длина пароля должна быть больше 8 символом',
        };
      }

      try {
        await knex('user')
          .update({
            password: await hashPassword(password),
            migrated_password: true,
            updated_at: knex.fn.now(),
          })
          .where('user_id', args.userId)
          .where('password', await hashPassword(oldPassword))
          .limit(1);
      } catch (e) {
        return {
          ok: false,
          error: 'Ошибка! Попробуйте позже или обратитесь в службу поддержки',
        };
      }

      return {
        ok: true,
      };
    }),
    userDelete: checkAuth()(async (parent, args, { knex }) => {
      try {
        await knex('users')
          .del()
          .where('user_id', args.userId)
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
    userChangeRole: checkAuth()(async (parent, args, { knex }) => {
      try {
        await knex('users')
          .update({
            role: args.newRole,
            updated_at: knex.fn.now(),
          })
          .where('user_id', args.userId)
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
    userAddNew: checkAuth()(async (p, args, { knex }) => {
      let id;
      try {
        const user = await normalizeUser(args);

        if (!user.email) {
          throw new Error('Необходимо указать email');
        }

        id = await knex('users')
          .insert(mapKeys(omit(user, ['userId']), (v, k) => snakeCase(k)))
          .returning('user_id')
          .limit(1)
          .then(r => r[0]);
      } catch (e) {
        return {
          ok: false,
          error:
            'Ошибка при создании пользователя. Возможно, такой пользователь уже зарегистрирован',
        };
      }

      return {
        ok: true,
        success: id,
      };
    }),
    userFindOrCreate: (p, args, { knex }) => {
      const name: string | void = args.name ? args.name.trim() : undefined;
      const email: string | void = normalizeEmail(args.email);

      if (!email) {
        throw new Error('Incorrect email');
      }
      return knex
        .select()
        .from('users')
        .where('email', email)
        .limit(1)
        .then(result => {
          if (result.length) {
            return mapKeys(result[0], (v, k) => camelCase(k));
          }

          const password = Math.round(Math.random() * 100000).toString();

          return knex('users')
            .insert({
              email,
              name,
              password: hashPassword(password),
            })
            .returning('user_id')
            .then(u => {
              sendEmail('registration', { email, name, password });
              return {
                email,
                name,
                userId: u[0],
              };
            });
        });
    },
    tryLogin: (p, args, { knex }) =>
      knex
        .select()
        .from('users')
        .where('email', args.email)
        .limit(1)
        .then(([user]) => {
          if (!user) return null;
          if (comparePassword(user, args.password)) {
            const [token, refreshToken] = generateTokens(user);
            if (token && refreshToken) return { token, refreshToken };
          }
          return null;
        }),
  },
});
