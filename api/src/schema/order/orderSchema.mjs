// @flow
import config from '../../config';

export default () => {
  type OrderSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const orderSchema: OrderSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  orderSchema.typeDefs = [
    `type Order {
        courseModuleId: Int!
        userId: Int!
        type: PaymentType
        comment: String
        amount: Int
        paid: Boolean!
        createdAt: String
        updatedAt: String
        }`,
    `enum PaymentType {
        ${config.payment.types.join('\n')}        
        }`,
    `type OrderedCourse {
        paid: Boolean!
        courseName: String!
        courseModule: String!
        courseModuleId: Int!
        }`,
    `type StudentOrder {
        transactionId: Int!
        paid: Boolean!
        email: String!
        name: String
        ordered: [OrderedCourse!]
    }`,
  ];

  orderSchema.query = [`orderGetStudentModules: [StudentOrder!]`];

  orderSchema.mutation = [
    `ordersBulkCreate(userId: Int!, moduleIds:[Int!]!): Boolean`,
  ];

  return orderSchema;
};
