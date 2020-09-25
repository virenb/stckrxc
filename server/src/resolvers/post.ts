import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  // Look up all posts
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  // Look up individual posts
  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string): Promise<Post> {
    // Two SQL queries
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    // If the user inputs a title, we will update it
    if (typeof title !== 'undefined') {
      Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }

}