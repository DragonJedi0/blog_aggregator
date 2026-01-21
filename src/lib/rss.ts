import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed>{
    try{
        const response = await fetch(feedURL, {
            headers: {
                "User-Agent": "gator",
            }
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.text();
        const parser = new XMLParser();
        const xml = parser.parse(rawData);
        const channel = xml.rss?.channel;

        if(!channel){
            throw new Error(`failed to parse xml data`)
        }
        if(!channel.title){
            throw new Error(`failed to parse xml data`);
        }
        if(!channel.link){
            throw new Error(`failed to parse xml data`);
        }
        if(!channel.description){
            throw new Error(`failed to parse xml data`);
        }

        const channelTitle = channel.title;
        const channelLink = channel.link;
        const channelDescription = channel.description;
        const rawItems = channel.item
        const channelItems = Array.isArray(rawItems) ? rawItems : [rawItems];
    
        const rssItems: RSSItem[] = [];

        for (const item of channelItems){
            if(!item.title || !item.link || !item.description || !item.pubDate){
                continue;
            }

            rssItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            });
        }

        const metadata: RSSFeed = {
            channel:{
                title: channelTitle,
                link: channelLink,
                description: channelDescription,
                item: rssItems,
            }
        };

        return metadata;
    } catch (error) {
        console.log("Error fetching feed data: ", error);
        throw error;
    }
}