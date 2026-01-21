import { fetchFeed } from "src/lib/rss";

export async function handlerAggregate(cmdName: string, ...args: string[]){
    const output = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(output, null, 2));
}