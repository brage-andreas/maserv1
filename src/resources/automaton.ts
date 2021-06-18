import chalk from "chalk";

import { cols, fCols } from "./colours.js"
import { BotLogNamesInterface } from "./definitions.js";

const { red, green, yellow } = cols;
const { fRed, fGreen, fYellow } = fCols;

const twoCharLength = (num: number): string => num<10 ? String("0"+num) : String(num);

/**
 * @returns sec, min, hour [ ]
 */
 const time = (): string[] => {
    const now: Date = new Date;
    
    const sec: string = twoCharLength(now.getSeconds());
    const min: string = twoCharLength(now.getMinutes());
    const hour: string = twoCharLength(now.getHours());
    
    return [sec, min, hour];
}



// botLog(chalk `{${fGreen} COMMAND} {grey > MESSAGE}`);
const cache: { authorID: string, authorCh: string } = {authorID: "", authorCh: "" };
const botLog = async (custom: string, names?: BotLogNamesInterface): Promise<void> => {
    const [sec, min, hour] = time();
    const same = cache.authorCh === names?.channelName && cache.authorID === names?.authorID;
    
    if (!same) {
        const memberLocationArray: string[] = ["\n "];

        if (names?.authorName) memberLocationArray.push(chalk `{${fYellow} ${names.authorName}}`);
        if (names?.authorID) memberLocationArray.push(chalk `{grey (${names.authorID})}`);
        if (names?.channelName) memberLocationArray.push(chalk `{grey in} #${names.channelName}`);
        if (names?.guildName) memberLocationArray.push(chalk `{grey of ${names.guildName}}`);

        if (memberLocationArray.length > 1) {
            console.log(memberLocationArray.join(" "));
        }
    }

    const content: string = chalk `  {grey ${hour}:${min}:${sec}} ${custom}`;
    console.log(content);

    cache.authorCh = names?.channelName || "";
    cache.authorID = names?.authorID    || "";
}



const parseDates = (obj: { joined?: (Date | null), created?: (Date | null) }) => {
    const { joined, created } = obj;
    const date = new Date();

    if (!created && !joined) return { made: null, came: null };

    const getTime = (time: Date): string => {
        const month  = twoCharLength(time.getMonth()+1 );
        const minute = twoCharLength(time.getMinutes() );
        const hour   = twoCharLength(time.getHours()   );
        const dato   = twoCharLength(time.getDate()    );
        const year   = twoCharLength(time.getFullYear());

        return `\`${year}-${month}-${dato} ${hour}:${minute}\``;
    }

    const getTimeSince = (timeDate: Date): string => {
        const time = Date.parse(timeDate.toString());
        const dateMs = Date.parse(date.toString());

        const minsAgo = (dateMs-time)/60000;        // * 1000 * 60
        const hoursAgo = (dateMs-time)/3600000;     // * 1000 * 60 * 60
        const daysAgo = (dateMs-time)/86400000;     // * 1000 * 60 * 60 * 24
        const yearsAgo = (dateMs-time)/31536000000; // * 1000 * 60 * 60 * 24 * 365

        let returnStr;

        if (minsAgo <1) returnStr = "Under ett minutt siden"; else
        if (hoursAgo<1) returnStr = `${Math.ceil(minsAgo)} minutter siden`; else
        if (daysAgo <1) returnStr = `${Math.ceil(hoursAgo)} timer siden`; else
        if (yearsAgo<1) returnStr = `${Math.ceil(daysAgo)} dager siden`;
                   else returnStr = `${yearsAgo.toFixed(1).replace(".", ",")} år siden`;

        return returnStr;
    }

    const timeMade = created ? getTime(created) : null;
    const timeSinceMade = created ? getTimeSince(created) : null;
    const madeStr = [timeMade, timeSinceMade].join("\n");

    const timeCame = joined ? getTime(joined) : null;
    const timeSinceCame = joined ? getTimeSince(joined) : null;
    const cameStr = [timeCame, timeSinceCame].join("\n");

    return { made: madeStr, came: cameStr };
}



export { time, botLog, parseDates }