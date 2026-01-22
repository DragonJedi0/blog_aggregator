import { readConfig } from "src/config";
import { createFeed, getFeeds, printFeed } from "src/lib/db/queries/feeds";
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

    const feedName = args[0]
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