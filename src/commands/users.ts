import { createUser, deleteAllUsers, getUsers, getUserByName } from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";

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
    if (args.length !== 1){
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
        throw new Error(`User already registered. Use 'login ${userName}' to login`);
    }
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    if(args.length !== 0) {
        throw new Error(`usage: reset`);
    }

    try{
        await deleteAllUsers();
        console.log("Users table cleared!");
        console.log("Feeds table cleared!");
        console.log("Follows table cleared!");
    } catch(err){
        if (err instanceof Error){
           console.log("Error resetting database:", err.message);
        }
        throw err;
    }
}

export async function handlerListUsers(cmdName:string, ...args: string[]){
    if(args.length !== 0){
        throw new Error(`usage: users`);
    }

    const users = await getUsers();
    const config = readConfig();
    const current_user_name = config.currentUserName;
    
    users.forEach((user: any) => {
        if(user.name == current_user_name){
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    });
}