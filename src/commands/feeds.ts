import { readConfig } from "src/config";
import { createFeed, printFeed } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

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

    printFeed(feedObject, user);
}