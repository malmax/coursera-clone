// @flow
import axios from 'axios';
import config from '../../config';
import { checkAuth } from '../../utils/auth';
import { createPaymentSignature } from '../../utils/payment';

export default () => ({
  Default: {},
  Query: {},
  Mutation: {
    transactionCreate: (p, args, { knex }) =>
      knex
        .select('m.name', 'o.amount', 'o.comment', 'o.course_module_id')
        .from('orders as o')
        .leftJoin(
          'course_modules as m',
          'm.course_module_id',
          'o.course_module_id'
        )
        .where('o.user_id', args.userId)
        .where('o.paid', false)
        .then(result => {
          if (result.length === 0) {
            throw new Error('Не нашли платежи');
          }
          const del = knex
            .select()
            .from('transactions')
            .where('user_id', args.userId)
            .where('paid', false);
          // .del();

          return Promise.all([Promise.resolve(result), del]);
        })
        .then(([result]) => {
          const orderDesc = `Оплата курсов:${result.reduce(
            (prev, cur) => `${prev},${cur.name}`,
            ''
          )}`;
          const amount = result.reduce((prev, cur) => prev + cur.amount, 0);
          const id = knex('transactions').insert({
            user_id: args.userId,
            comment: orderDesc,
            amount,
            paid: false,
          });
          return Promise.all([
            id,
            Promise.resolve({
              comment: orderDesc,
              amount,
            }),
          ]);
        })
        .then(([id, rest]) => {
          const request = {
            order_id: id[0],
            order_desc: rest.comment, // orderDesc.replace(':,', ':'),
            currency: 'USD',
            amount: rest.amount * 100,
            merchant_id: config.payment.merchant_id,
          };
          request.signature = createPaymentSignature(request);
          return axios.post(config.payment.fondyUrl, { request });
        })
        .then(({ data: { response } }) => {
          if (response.response_status !== 'success') {
            throw new Error(response.error_message);
          }
          return response.checkout_url;
        })
        .catch(e => {
          console.error(e.message);
          return '';
        }),
    transactionPayLink: (p, args, { knex }) =>
      knex
        .select()
        .from('transactions')
        .where('user_id', args.userId)
        .where('paid', false)
        .orderBy('transaction_id', 'desc')
        .limit(1)
        .then(([tr]) => {
          const request = {
            order_id: tr.transaction_id,
            order_desc: tr.comment, // orderDesc.replace(':,', ':'),
            currency: 'USD',
            amount: tr.amount,
            merchant_id: config.payment.merchant_id,
          };
          request.signature = createPaymentSignature(request);
          return axios.post(config.payment.fondyUrl, { request });
        })
        .then(({ data: { response } }) => {
          if (response.response_status !== 'success') {
            throw new Error(response.error_message);
          }
          return response.checkout_url;
        })
        .catch(e => {
          console.error(e.message);
          return '';
        }),
  },
});
