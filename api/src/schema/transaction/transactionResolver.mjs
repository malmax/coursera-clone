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
        .select(
          'm.name',
          'o.amount',
          'o.comment',
          'o.course_module_id',
          'order_id'
        )
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
            pay_until: knex.raw('date("now","+5 day")'),
          });
          return Promise.all([
            id,
            Promise.resolve({
              comment: orderDesc,
              amount,
              orderIds: result.map(el => el.order_id),
            }),
          ]);
        })
        .then(([[transactionId], rest]) => {
          const updatePromises = rest.orderIds.map(el =>
            knex('orders')
              .update({
                updated_at: knex.fn.now(),
                transaction_id: transactionId,
              })
              .where('order_id', el)
              .limit(1)
          );
          const request = {
            order_id: transactionId,
            order_desc: rest.comment,
            currency: 'USD',
            amount: rest.amount * 100,
            merchant_id: config.payment.merchant_id,
          };
          request.signature = createPaymentSignature(request);
          const axiosReq = axios.post(config.payment.fondyUrl, { request });
          return Promise.all([axiosReq, ...updatePromises]);
        })
        .then(([{ data: { response } }]) => {
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
