import { handlerAggregate } from "./commands/aggregate";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerAddFeed } from "./commands/feeds";
import { handlerListUsers, handlerLogin, handlerRegister, handlerReset } from "./commands/users";

async function main() {
  const argsList = process.argv.slice(2);

  if (argsList.length < 1){
    console.log("Error: Not enough arguments");
    process.exit(1);
  }

  const cmdName = argsList[0];
  const args = argsList.slice(1);
  const registery: CommandsRegistry = {};

  registerCommand(registery, "login", handlerLogin);
  registerCommand(registery, "register", handlerRegister);
  registerCommand(registery, "reset", handlerReset);
  registerCommand(registery, "users", handlerListUsers);
  registerCommand(registery, "agg", handlerAggregate);
  registerCommand(registery, "addfeed", handlerAddFeed);

  try {
    await runCommand(registery, cmdName, ...args);
  } catch(err){
    if (err instanceof Error){
      console.log(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.log(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

await main();