// @flow
import axios from 'axios';
import config from '../../config';
import { checkAuth } from '../../utils/auth';
import { createPaymentSignature } from '../../utils/payment';

export default () => ({
  Default: {},
  Query: {
    orderGetStudentModules: (p, args, { knex }) => {
      const del = knex
        .select()
        .from('transactions')
        .where('paid', false)
        .where('pay_until', '<', knex.raw('date("now")'))
        .del()
        .then(() =>
          knex
            .select()
            .from('transactions')
            .where('paid', false)
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
              if (response.order_status === 'approved') {
                knex('transactions')
                  .update({ paid: true })
                  .where('transaction_id', response.order_id)
                  .limit(1)
                  .then();
              }
              console.log(response);
            });

            const orders = knex.select().from('orders');
            const transactions = knex
              .select()
              .from('transactions')
              .where('paid', false);

            return Promise.all([orders, transactions]);
          })
        );
    },
  },
  Mutation: {
    ordersBulkCreate: (p, args, { knex }) => {
      if (args.moduleIds.length === 0) return false;

      return knex
        .select()
        .from('course_modules')
        .whereIn('course_module_id', args.moduleIds)
        .then(arr => {
          const orders = arr
            // .filter(el => new Date(el.start_date) > new Date())
            .map(el => ({
              course_module_id: el.course_module_id,
              user_id: args.userId,
              type: 'card',
              amount: el.price,
              paid: false,
            }));
          if (orders.length === 0) return null;

          const getDuplicates = knex
            .select('course_module_id')
            .from('orders')
            .whereIn('course_module_id', args.moduleIds)
            .where('user_id', args.userId);
          return Promise.all([getDuplicates, Promise.resolve(orders)]);
        })
        .then(([duplicatesIn, ordersIn]) => {
          const duplicates = duplicatesIn.map(el => el.course_module_id);
          const orders = ordersIn.filter(
            el => duplicates.indexOf(el.course_module_id) === -1
          );
          if (orders.length) {
            return knex('orders').insert(orders);
          }
          return Promise.resolve();
        })
        .then(() => true)
        .catch(e => {
          console.error(e);
          return false;
        });
    },
  },
});
