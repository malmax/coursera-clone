// @flow
import Knex from 'knex';
import sha1 from 'sha1';
import axios from 'axios';

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

export const checkPayments = () =>
  knex
    .select()
    .from('transactions')
    // .where('paid', false)
    .where('pay_until', '<', knex.raw('date("now")'))
    .del()
    .then(() =>
      knex
        .select()
        .from('transactions')
        // .where('paid', false)
        .where('pay_until', '>=', knex.raw('date("now")'))
    )
    .then(gets => {
      const requests = gets.map(el => {
        const request = {
          order_id: el.transaction_id,
          merchant_id: config.payment.merchant_id,
        };
        request.signature = createPaymentSignature(request);
        return { request };
      });
      return axios.all(
        requests.map(l => axios.post(config.payment.fondyCheckUrl, l))
      );
    })
    .then(
      axios.spread((...res) => {
        // all requests are now complete
        res.forEach(el => {
          const response = el.data.response;
          const paid = response.order_status === 'approved';
          knex('transactions')
            .update({
              paid,
              updated_at: knex.fn.now(),
              comment: response.masked_card || '',
            })
            .where('transaction_id', response.order_id)
            .limit(1)
            .then(() =>
              knex('orders')
                .update({ paid, updated_at: knex.fn.now() })
                .where('transaction_id', response.order_id)
            );
        });
      })
    );
