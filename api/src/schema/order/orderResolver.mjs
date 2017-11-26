// @flow
import groupBy from 'lodash/groupBy';

import { checkAuth } from '../../utils/auth';
import { checkPayments } from '../../utils/payment';

export default () => ({
  Default: {},
  Query: {
    orderGetStudentModules: (p, args, { knex }) =>
      checkPayments()
        .then(() =>
          knex
            .select([
              'u.email',
              'u.name',
              'c.name as courseName',
              'm.name as courseModule',
              'o.paid as oPaid',
              't.paid as tPaid',
              't.transaction_id as transactionId',
              'm.course_module_id as courseModuleId',
            ])
            .from('orders as o')
            .leftJoin('users as u', 'u.user_id', 'o.user_id')
            .leftJoin(
              'course_modules as m',
              'm.course_module_id',
              'o.course_module_id'
            )
            .leftJoin('courses as c', 'c.course_id', 'm.course_id')
            .leftJoin(
              'transactions as t',
              't.transaction_id',
              'o.transaction_id'
            )
        )
        .then(data => {
          const out = groupBy(data, 'email');
          const formated = Object.keys(out).map(email => {
            const item = out[email];
            let transactionId = 0;
            let paid = 0;
            let name = '';
            const ordered = item.map(el => {
              transactionId = el.transactionId;
              paid = el.tPaid;
              name = el.name;
              return {
                paid: el.oPaid,
                courseName: el.courseName,
                courseModule: el.courseModule,
                courseModuleId: el.courseModuleId,
              };
            });
            return {
              transactionId,
              paid,
              email,
              name,
              ordered,
            };
          });
          return formated;
        }),
  },
  Mutation: {
    ordersBulkCreate: (p, args, { knex }) => {
      if (args.moduleIds.length === 0) return false;
      let discount = parseInt(args.discount, 10) || 0;
      if (discount > 100 || discount < 0) discount = 0;
      discount = 1 - discount / 100;

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
              amount: el.price * discount,
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
