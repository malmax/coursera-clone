// @flow
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import ApolloServer from 'apollo-server-koa';
import Knex from 'knex';
import cors from 'koa-cors';

import config from './config';
import './database';
import graphQlSchema from './schema';

const app = new Koa();
app.use(cors({ origin: 'http://localhost:3000' }));

const router = new KoaRouter();
const PORT = 3001;
const knex = Knex(config.db);

app.use(koaBody());

router.post(
  '/graphql',
  ApolloServer.graphqlKoa({ schema: graphQlSchema, context: { knex } })
);
router.get('/graphiql', ApolloServer.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => console.log('http://localhost:3001/graphiql'));
