// @flow
import { checkAuth } from '../../utils/auth';

export default () => ({
  Default: {},
  Query: {},
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
