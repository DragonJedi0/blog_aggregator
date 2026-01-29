import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feed_follows, posts } from "../schema";

export async function createPost(
    title: string, 
    url: string,
    description: string | null,
    publishedAt: Date | null,
    feedId: string
) {
    await db
        .insert(posts)
        .values({
            title: title,
            url: url,
            description: description,
            publishedAt: publishedAt,
            feedId: feedId,
        });
}

export async function getPostsForUser(user_id: string, limit: number = 2) {
    const result = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId
        })
        .from(posts)
        .innerJoin(feed_follows, eq(posts.feedId, feed_follows.feedId))
        .where(eq(feed_follows.userId, user_id))
        .orderBy(sql`${posts.publishedAt} ASC NULLS LAST`)
        .limit(limit);
    return result;
}