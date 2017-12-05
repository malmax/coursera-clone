// @flow
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import ApolloServer from 'apollo-server-koa';
import ApolloUploadServer from 'apollo-upload-server';
import Knex from 'knex';
import cors from 'koa-cors';
import compress from 'koa-compress';

import { userMiddleware } from './utils/auth';
import config from './config';
import './database';
import graphQlSchema from './schema';

const app = new Koa();
app.use(userMiddleware);
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// Enable gzip
app.use(compress());
// ctx.request.user = { userId: 0, role: 'client' };

const router = new KoaRouter();
const PORT = 3001;
const knex = Knex(config.db);

router.post(
  '/graphql',
  koaBody(),
  ApolloUploadServer.apolloUploadKoa(),
  ApolloServer.graphqlKoa(ctx => ({
    schema: graphQlSchema,
    context: { knex, ctx },
  }))
);
router.get('/graphiql', ApolloServer.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => console.log('http://localhost:3001/graphiql'));
