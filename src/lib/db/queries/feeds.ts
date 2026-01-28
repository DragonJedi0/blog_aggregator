
import { eq } from "drizzle-orm";
import { db } from "..";
import { Feed, feed_follows, feeds, User, users } from "../schema";

export async function createFeed(feedName: string, url: string, user: User) {
    const [result] = await db.insert(feeds)
        .values({
            name: feedName,
            url: url,
            userId: user.id
            })
        .returning();

    if(!result){
        throw new Error(`feed not added`);
    }

    await createFeedFollow(result.id, user.id);
    return result;
}

export async function printFeed(feed: Feed, user: User) {
    console.log(`* ID: ${feed.id}`);
    console.log(`* Created: ${feed.createdAt}`);
    console.log(`* Updated: ${feed.updatedAt}`);
    console.log(`* Name: ${feed.name}`);
    console.log(`* URL: ${feed.url}`);
    console.log(`* User: ${user.name}`);
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;   
}

export async function createFeedFollow(feed_id: string, user_id: string){
    const [newFeedFollow] = await db.insert(feed_follows)
        .values({
            feedId: feed_id,
            userId: user_id,
            })
        .returning();

    if(!newFeedFollow){
        throw new Error("Unable add feed to user's follow list");
    }

    const [result] = await db
        .select({
            id: feed_follows.id,
            createdAt: feed_follows.createdAt,
            updatedAt: feed_follows.updatedAt,
            feedId: feed_follows.feedId,
            userId: feed_follows.userId,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.id, newFeedFollow.id));

    return result;
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getFeedFollowsForUser(user_id: string) {
    const result = await db
        .select({
            id: feed_follows.id,
            createAt: feed_follows.createdAt,
            updatedAt: feed_follows.updatedAt,
            feedId: feed_follows.feedId,
            userId: feed_follows.userId,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.userId, user_id));

    return result;
}

export async function deleteFeedFollow(feed_id: string) {
    await db.delete(feed_follows).where(eq(feed_follows.feedId, feed_id));
}