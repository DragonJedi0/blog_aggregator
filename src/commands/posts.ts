import { cosineDistance } from "drizzle-orm";
import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    if(args.length > 1){
        throw new Error(`usage: ${cmdName} <limit>`);
    }

    const limit = args[0] ? Number(args[0]) : 2;

    if(isNaN(limit) || limit <= 0){
        throw new Error(`Invalid limit: ${limit}`);
    }

    const posts = await getPostsForUser(user.id, limit);

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (const post of posts){
        console.log(`*        Post: ${post.title}`);
        console.log(`*         URL: ${post.url}`);
        console.log(`*     PubDate: ${post.publishedAt}`);
        console.log(`* Description: ${post.description}`);
    }
}