import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { parseDuration } from "src/lib/time";

export async function handlerAggregate(cmdName: string, ...args: string[]){
    // const output = await fetchFeed("https://www.wagslane.dev/index.xml");
    // console.log(JSON.stringify(output, null, 2));

    if(args.length !== 1){
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }

    const durationStr = args[0];
        
    scrapeFeeds().catch(handleError);

    try{
        const timeBetweenRequests = parseDuration(durationStr);
        
        console.log(`Collecting feeds every ${durationStr}`);

        const interval = setInterval(() => {
            scrapeFeeds().catch(handleError);
        }, timeBetweenRequests);

        await new Promise<void>((resolve) => {
            process.on("SIGINT", () => {
                console.log("Shutting down feed aggregator...");
                clearInterval(interval);
                resolve();
            });
        });
    } catch(err){
        throw err;
    }
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if(!feed){
        throw new Error("No feeds to scrape");
        return;
    }

    await markFeedFetched(feed.id);
    
    const feedData = await fetchFeed(feed.url);
    
    for (const rssItem of feedData.channel.item){
        console.log(`* ${rssItem.title}`)
    }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  );
}