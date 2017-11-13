// @flow
import uniq from 'lodash/uniq';
import GraphQlTools from 'graphql-tools';

import userSchema from './user/userSchema';
import userResolver from './user/userResolver';
import courseSchema from './course/courseSchema';
import courseResolver from './course/courseResolver';

const logger = { log: e => console.log(e) };

const typeDefs: Array<string> = [];
const query: Array<string> = [];
const mutation: Array<string> = [];
const resolvers: any = {
  Query: {},
  Mutation: {},
};

// merge schemas
[userSchema, courseSchema].forEach(sch => {
  const { typeDefs: sTypeDefs, query: sQuery, mutation: sMutation } = sch();
  sTypeDefs.forEach(line => typeDefs.push(line));
  sQuery.forEach(line => query.push(line));
  sMutation.forEach(line => mutation.push(line));
});
// merge resolvers
[userResolver, courseResolver].forEach(res => {
  const { Query, Mutation, Default } = res();
  Object.assign(resolvers.Query, Query);
  Object.assign(resolvers.Mutation, Mutation);
  Object.assign(resolvers, Default);
});

export default GraphQlTools.makeExecutableSchema({
  typeDefs: [
    uniq(typeDefs).join('\n'),
    `type Query { ${uniq(query).join('\n')} }`,
    `type Mutation { ${uniq(mutation).join('\n')} }`,
  ],
  resolvers,
  logger,
});
