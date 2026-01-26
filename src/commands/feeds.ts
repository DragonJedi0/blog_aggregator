import { readConfig } from "src/config";
import { createFeed, createFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds, printFeed } from "src/lib/db/queries/feeds";
import { getUserById, getUserByName } from "src/lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2){
        throw new Error(`usage: ${cmdName} <feed name> <feed url>`)
    }

    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if(!user){
        throw new Error(`user ${config.currentUserName} not found`);
    }

    const feedName = args[0];
    const url = args[1];

    const feedObject = await createFeed(feedName, url, user);

    if(!feedObject){
        throw new Error(`Error creating feed ${feedName}`);
    }

    console.log("Feed created successfully:");
    printFeed(feedObject, user);
}

export async function handlerListFeeds(cmdName:string, ...args: string[]){
    if(args.length !== 0){
        throw new Error(`usage: feeds`);
    }

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

export async function handlerFollowFeed(cmdName: string, ...args: string[]) {
    if(args.length !== 1){
        throw new Error(`usage: follow <url>`);
    }

    // Get User
    const config = readConfig();
    const userObject = await getUserByName(config.currentUserName);

    if(!userObject){
        throw new Error(`user ${config.currentUserName} not found`);
    }

    // Get Feed
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

export async function handlerFollowList(cmndName: string, ...args: string[]) {
    if(args.length !== 0){
        throw new Error(`usage: following`);
    }

    // Get User
    const config = readConfig();
    const userObject = await getUserByName(config.currentUserName);

    if(!userObject){
        throw new Error(`user ${config.currentUserName} not found`);
    }

    // Get Feed List
    const userFollowList = await getFeedFollowsForUser(userObject.id);

    if(userFollowList.length === 0){
        throw new Error(`User ${userObject.name} has no feeds listed.\nUse commands 'follow' or 'addfeed' to create a list`);
    }

    console.log("------------------------");
    console.log(`Showing Feed Follow List`);
    console.log("------------------------");
    console.log(`User: ${userObject.name}`)
    for (const feed of userFollowList){
        console.log(`Feed: ${feed.feedName}`);
    }
}