import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  const argsList = process.argv.slice(2);

  if (argsList.length < 1){
    console.log("Error: Not enough arguments");
    process.exit(1);
  }

  const cmdName = argsList[0];
  const args = argsList.slice(1);
  const registery: CommandsRegistry = {};

  registerCommand(registery, "login", handlerLogin);

  try {
    runCommand(registery, cmdName, ...args);
  } catch(err){
    if (err instanceof Error){
      console.log(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.log(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
}

main();