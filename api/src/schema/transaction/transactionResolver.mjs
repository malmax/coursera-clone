// @flow
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

          const orderDesc = `Оплата курсов:${result.reduce(
            (prev, cur) => `${prev},${cur.name}`,
            ''
          )}`;
          const amount = result.reduce((prev, cur) => prev + cur.price, 0);

          return knex('transaction')
            .insert({
              user_id: args.userId,
              comment: orderDesc,
              amount,
              paid: false,
            })
            .returning('transaction_id');
        })
        .then(([id]) => id),
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
            amount: tr.amount * 100,
            merchant_id: config.payment.merchant_id,
          };
          request.signature = createPaymentSignature(request);
          console.log(JSON.stringify({ request }));
        }),
  },
});
