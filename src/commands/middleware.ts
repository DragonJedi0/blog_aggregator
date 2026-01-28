import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";
import { CommandHandler } from "./commands";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName, ...args) => {
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if(!user){
        throw new Error(`user ${config.currentUserName} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}