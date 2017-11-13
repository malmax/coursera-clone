// @flow
import { hashPassword } from '../utils/auth';
import type { UserTypeCamel } from '../database/user';
import config from '../config';

export const normalizePhone = (phoneStr: string = ''): number | void => {
  if (!phoneStr || phoneStr.length < 7) return undefined;

  let phone;
  try {
    phone = phoneStr
      .trim()
      .replace(/[^0-9+]/g, '')
      .match(/^(\+380|\+7|8)?(\d{3})((\d){7,10})/) || [''];
  } catch (e) {
    return undefined;
  }
  // если код страны +7/8 -> 7 или обрезаем +
  if (['+7', '8'].indexOf(phone[1]) !== -1) phone[1] = 7;
  else if (typeof phone[1] === 'string') phone[1] = phone[1].replace('+', '');

  return parseInt(`${phone[1]}${phone[2]}${phone[3]}`, 10) || undefined;
};

export const normalizeEmail = (emailRaw: string = ''): string | void => {
  const email = emailRaw.trim().toLowerCase();
  if (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)) {
      return undefined;
    }
  }
  return email || undefined;
};

export const displayPhone = (phoneNum: string): string => {
  const phone: Array<string> = phoneNum
    .toString()
    .match(/^(\+380|\+7|8|7)?(\d{3})((\d){7,10})/) || [''];

  return `+${phone[1]}(${phone[2]})${phone[3]}`;
};

type NormalizedUser = {|
  email: string | void,
  name: string | void,
  role: string | void,
  password: Promise<string> | void,
  userId: number,
|};
export const normalizeUser = async (
  userIn: UserTypeCamel
): Promise<NormalizedUser> => {
  const userId: number = parseInt(userIn.userId, 10) || 0;
  const name: string | void = userIn.name ? userIn.name.trim() : undefined;
  const email: string | void = normalizeEmail(userIn.email) || undefined;
  const role: string | void =
    config.user.roles.indexOf(userIn.role) !== -1 ? userIn.role : undefined;
  const password: Promise<string> | void = userIn.password
    ? await hashPassword(userIn.password.trim())
    : undefined;

  return Promise.resolve({
    userId,
    name,
    email,
    role,
    password,
  });
};
