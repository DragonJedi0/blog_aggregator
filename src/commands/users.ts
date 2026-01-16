import { createUser, getUserByName } from "src/lib/db/queries/users";
import { setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]){
    if (args.length !== 1){
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const userExists = await getUserByName(userName);

    if (!userExists){
        throw new Error(`User ${userName} does not exist. Use 'register ${userName}' to add user`)
    } else {
        setUser(userName);
        console.log("User switched successfully!");
    }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !==1){
        throw new Error(`usage: ${cmdName} <name>`)
    }

    const userName = args[0];
    const userExists = await getUserByName(userName);

    if (!userExists){
        const user = await createUser(userName);
        setUser(userName);
        console.log(`User ${userName} created successfully`);
        console.log(user);
    } else {
        throw new Error(`User alredy registered. Use 'login ${userName}' to login`);
    }
}