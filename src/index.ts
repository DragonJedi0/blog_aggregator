import { setUser, readConfig } from "./config";

function main() {
  setUser("Sam");
  console.log(readConfig());
}

main();