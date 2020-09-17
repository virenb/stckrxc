import { MikroORM } from "@mikro-orm/core";
// import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config'
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    })
  })

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started at localhost 4000')
  }
  )
  // const post = orm.em.create(Post, { title: 'First Post' });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts)

};

main().catch(err => {
  console.error(err);
});