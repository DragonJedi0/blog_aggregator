
import { db } from "..";
import { Feed, feeds, User } from "../schema";

export async function createFeed(feedName: string, url: string, user: User) {
    const [result] = await db.insert(feeds)
        .values({
            name: feedName,
            url: url,
            userId: user.id
            })
        .returning();
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

export async function deleteAllFeeds() {
    await db.delete(feeds);
}