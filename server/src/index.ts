import { MikroORM } from "@mikro-orm/core";
import mikroConfig from './mikro-orm.config'
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import 'reflect-metadata';
import { UserResolver } from './resolvers/user';
import redis from 'redis'
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__ } from "./constants";
// import { MyContext } from './types';



const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient();

  // Order matters for express middleware! Redis comes before Apollo
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // ms, sec, min, hour, day, year
        httpOnly: true,
        secure: __prod__, // cookie only works in https
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: 'hdjsadjsnmldsklmds', // change to env variable
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  })

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started at localhost 4000')
  }
  )

};

main().catch(err => {
  console.error(err);
});