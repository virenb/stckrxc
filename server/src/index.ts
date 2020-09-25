import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__ } from './constants';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'stckr2',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    entities: [Post, User]
  });


  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // Order matters for express middleware! Redis comes before Apollo

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
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
    context: ({ req, res }) => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  });

  app.listen(4000, () => {
    console.log('server started at localhost 4000')
  }
  )

};

main().catch(err => {
  console.error(err);
});