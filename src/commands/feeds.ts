import { createFeed, createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds, printFeed } from "src/lib/db/queries/feeds";
import { getUserById } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, userObject: User, ...args: string[]) {
    if (args.length !== 2){
        throw new Error(`usage: ${cmdName} <feed name> <feed url>`)
    }

    const feedName = args[0];
    const url = args[1];

    const feedObject = await createFeed(feedName, url, userObject);

    if(!feedObject){
        throw new Error(`Error creating feed ${feedName}`);
    }

    console.log("Feed created successfully:");
    printFeed(feedObject, userObject);
}

export async function handlerListFeeds(cmdName:string, ...args: string[]){
    if(args.length !== 0){
        throw new Error(`usage: ${cmdName}`);
    }

    // Get all feeds
    const feeds = await getFeeds();

    if(feeds.length === 0){
        throw new Error("No feeds found. Use 'addfeed' command to enter a new feed");
    }

    for (const feed of feeds){
        console.log("--------------------");
        const user = await getUserById(feed.userId);
        if(!user){
            console.log(`userID ${feed.userId} not found for feed ${feed.name}`);
        } else {
            console.log(`* Name: ${feed.name}`);
            console.log(`* URL: ${feed.url}`);
            console.log(`* User: ${user.name}`);
        }
    }
}

export async function handlerFollowFeed(cmdName: string, userObject: User, ...args: string[]) {
    if(args.length !== 1){
        throw new Error(`usage: ${cmdName} <url>`);
    }

    // Get Feed By URL
    const url = args[0];
    const feedObject = await getFeedByUrl(url);

    if(!feedObject){
        throw new Error(`feed at ${url} not found`);
    }

    // Create new Feed Follow Object
    const feedFollow = await createFeedFollow(feedObject.id, userObject.id);

    if(!feedFollow){
        throw new Error(`Unable add feed to user ${userObject.name}'s follow list.`);
    }

    console.log(`Successfully added feed at ${url} to user's follow list`);
    console.log(`Feed: ${feedFollow.feedName}`);
    console.log(`User: ${feedFollow.userName}`);
}

export async function handlerFollowList(cmdName: string, userObject: User, ...args: string[]) {
    if(args.length !== 0){
        throw new Error(`usage: ${cmdName}`);
    }

    // Get Feed List
    const userFollowList = await getFeedFollowsForUser(userObject.id);

    console.log("------------------------");
    console.log(`Showing Feed Follow List`);
    console.log("------------------------");
    console.log(`User: ${userObject.name}`)
    for (const feed of userFollowList){
        console.log(`Feed: ${feed.feedName}`);
    }
}

export async function handlerUnfollowFeed(cmdName: string, user: User, ...args: string[]){
    if(args.length !== 1){
        throw new Error(`usage: ${cmdName} <feed name>`);
    }

    const feedUrl = args[0];

    // Get feed by Url
    const feedObject = await getFeedByUrl(feedUrl);
    if(!feedObject){
        throw new Error(`feed at ${feedUrl} not found`);
    }

    try {
        await deleteFeedFollow(feedObject.id);
    } catch(err){
        if (err instanceof Error){
           console.log("Error deleting feed follow:", err.message);
        }
        throw err;
    }

    console.log(`* user ${user.name} no longer following feed ${feedObject.name}`);
}