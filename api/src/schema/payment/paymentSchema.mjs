// @flow
import config from '../../config';

export default () => {
  type PaymentSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const paymentSchema: PaymentSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  paymentSchema.typeDefs = [
    `type Payment {
        courseModuleId: Int!,
        userId: Int!,
        type: PaymentType,
        comment: String,
        amount: Int,
        createdAt: String
        updatedAt: String
        }`,
    `enum PaymentType {
        ${config.payment.types.join('\n')}        
        }`,
  ];

  paymentSchema.query = [];

  paymentSchema.mutation = [];

  return paymentSchema;
};
