// @flow
export default () => {
  type TransactionSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const transactionSchema: TransactionSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  transactionSchema.typeDefs = [
    `type Transaction {
        transactionId: Int!
        userId: Int!
        comment: String
        amount: Int
        paid: Boolean!
        createdAt: String
        updatedAt: String
        }`,
  ];

  transactionSchema.query = [];

  transactionSchema.mutation = [
    `transactionCreate(userId: Int!): String`,
    `transactionPayLink(userId: Int!): String`,
  ];

  return transactionSchema;
};
