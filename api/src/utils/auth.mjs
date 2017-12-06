// @flow
import bcrypt from 'bcrypt';
// import crypto from 'crypto';
import uuid4 from 'uuid/v4';
import Knex from 'knex';
import jwt from 'jsonwebtoken';
import get from 'lodash/get';

import config from '../config';

import type { UserType } from '../database/user';

const knex = Knex(config.db);

export const hashPassword = async (passwordIn: string): Promise<string> => {
  const password = passwordIn.toString().trim();
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  user: UserType,
  passwordIn: string
): Promise<boolean> => {
  const password = passwordIn.toString().trim();

  try {
    const result = await bcrypt.compare(password, user.password);
    if (!result) return Promise.resolve(false);
  } catch (e) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

export const generateTokens = async (
  user: UserType
): Promise<Array<string>> => {
  let token: string;
  let refreshToken: string;
  try {
    token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        name: user.name,
      },
      config.auth.SECRET,
      { expiresIn: '20m' }
    );

    const refreshSecret = await knex('users')
      .update({ refresh_token_secret: uuid4() })
      .returning('refresh_token_secret')
      .where('user_id', user.user_id)
      .limit(1)
      .then(e => e[0]);

    refreshToken = jwt.sign(
      {
        userId: user.user_id,
      },
      `${refreshSecret}${config.auth.SECRET}`,
      { expiresIn: '7d' }
    );
  } catch (e) {
    throw new Error('не могу создать токены');
  }

  return Promise.resolve([token, refreshToken]);
};

async function regenerateTokens(
  token: string,
  refreshToken: string
): Promise<Array<string>> {
  try {
    const decodedToken = jwt.decode(refreshToken);
    const user = await knex
      .select()
      .from('users')
      .where('user_id', decodedToken.userId)
      .then(u => u[0]);

    if (!user) {
      throw new Error('Incorrect user');
    }

    jwt.verify(
      refreshToken,
      `${user.refresh_token_secret}${config.auth.SECRET}`
    );

    return generateTokens(user);
  } catch (e) {
    return Promise.resolve([]);
  }
}

export const setAuthCookiesAndHeaders = (
  tokenIn: string = 'none',
  refreshTokenIn: string = 'none',
  ctx: any
): void => {
  let token = tokenIn;
  let refreshToken = refreshTokenIn;

  if (!token || !refreshToken) {
    token = 'none';
    refreshToken = 'none';
    ctx.cookies.set('token', null);
    ctx.cookies.set('refreshToken', null);
  } else {
    ctx.cookies.set('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    ctx.cookies.set('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }

  ctx.response.set('Access-Control-Expose-Headers', 'x-refresh-token,x-token');
  ctx.response.set('Access-Control-Request-Headers', 'x-refresh-token,x-token');
  ctx.response.set('x-token', token);
  ctx.response.set('x-refresh-token', refreshToken);
};

export const userMiddleware = async (ctx, next): Promise<void> => {
  ctx.request.user = { userId: 0, role: 'client' };

  if (['POST', 'GET'].indexOf(ctx.request.method) !== -1) {
    const token = ctx.request.get('x-token');
    const refreshToken = ctx.request.get('x-refresh-token');

    if (
      token !== ctx.cookies.get('token') ||
      refreshToken !== ctx.cookies.get('refreshToken') ||
      !token ||
      !refreshToken
    ) {
      // console.log('Header token <> Cookie token');
      setAuthCookiesAndHeaders('', '', ctx);
    } else {
      try {
        const decodedToken = jwt.verify(token, config.auth.SECRET);
        // просрочен Token
        ctx.request.user = {
          userId: decodedToken.userId,
          role: decodedToken.role,
        };
      } catch (e) {
        const [newToken, newRefreshToken] = await regenerateTokens(
          token,
          refreshToken
        );

        if (newToken && newRefreshToken) {
          setAuthCookiesAndHeaders(newToken, newRefreshToken, ctx);
          ctx.request.user = jwt.decode(newToken);
        } else {
          setAuthCookiesAndHeaders('', '', ctx);
        }
      }
    }
  }

  await next();
};

// checkAuth(['admin','manager'])(resolver)
export const checkAuth = (authArray: Array<string> = ['admin']): Function => (
  resolver: Function
) => async (parent, args, context): Object => {
  if (config.auth.dev) {
    console.error('WARNING! grant access without check user');
    return resolver(parent, args, context);
  }
  const user = context.ctx.request.user;

  console.log(user);
  if (user.userId === 0) {
    throw new Error('Access denied');
  }

  if (authArray.length > 0) {
    if (authArray.indexOf(user.role) === -1) {
      throw new Error('Access denied');
    }
  }

  return resolver(parent, args, context);
};

export const checkAuthOrOwner = (authArray = ['admin']) => (
  resolver: Function
) => async (parent, args, context) => {
  if (config.auth.dev) {
    console.error('WARNING! grant access without check user');
    return resolver(parent, args, context);
  }

  const user = context.ctx.request.user;
  if (user.userId === 0) {
    return null;
  }

  if (authArray.length > 0) {
    if (authArray.indexOf(user.role) === -1) {
      if (user.userId !== args.userId) {
        throw new Error('try to mutate another user');
      }

      let result = await resolver(parent, args, context);
      if (Array.isArray(result)) {
        result = result.filter(o => {
          const userId = get(o, 'userId') || get(o, 'user.userId');
          return userId === user.userId;
        });
      } else if (typeof result === 'object') {
        const userId = get(result, 'userId') || get(result, 'user.userId');
        result = userId === user.userId ? result : null;
      } else {
        result = null;
      }
      return result;
    }
  }

  return resolver(parent, args, context);
};

export const hideFields = (
  hideFields: Array<string> = [],
  showFieldsFor: Array<string> = ['admin', 'manager']
): Object => {
  function delField(object, fieldName): void {
    if (Array.isArray(object)) {
      object.forEach(obj => {
        if (typeof obj === 'object') {
          delField(obj, fieldName);
        }
      });
    } else if (typeof object === 'object') {
      Object.keys(object).forEach(key => {
        if (key === fieldName) {
          object[key] = undefined;
        }

        if (typeof object[key] === 'object') {
          delField(object[key], fieldName);
        }
      });
    }
  }
  return (resolver: any): any => async (parent, args, context) => {
    if (config.auth.dev) {
      console.error('WARNING! grant access without check user');
      return resolver(parent, args, context);
    }

    const user = context.ctx.request.user;
    const result = await resolver(parent, args, context);

    if (
      hideFields.length > 0 &&
      showFieldsFor.length > 0 &&
      showFieldsFor.indexOf(user.role) === -1
    ) {
      if (Array.isArray(result)) {
        return result.map((el, index) => {
          const out = result[index];

          hideFields.forEach(hideField => {
            delField(out, hideField);
          });

          return out;
        });
      } else if (typeof result === 'object') {
        const out = result;
        hideFields.forEach(hideField => {
          delField(out, hideField);
        });
        return out;
      }
    }
    return result;
  };
};
