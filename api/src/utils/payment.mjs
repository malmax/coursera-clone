// @flow
import Knex from 'knex';
import sha1 from 'sha1';
import config from '../config';

const knex = Knex(config.db);

export type RequestFondy = {
  order_id: string,
  order_desc: string,
  currency: 'USD' | 'RUB',
  amount: number,
  merchant_id: number,
  signature?: string,
};

export const createPaymentSignature = (payment: RequestFondy): string => {
  const string = Object.keys(payment)
    .sort()
    .map(key => payment[key])
    .join('|');
  return sha1(`${config.payment.merchantPassword}|${string}`);
};

export const paymentStatus = userId => {};
