// @flow
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import ApolloServer from 'apollo-server-koa';

import './database';

const app = new Koa();
const router = new KoaRouter();
const PORT = 3001;

app.use(koaBody());

router.post('/graphql', ApolloServer.graphqlKoa({ schema: {} }));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
