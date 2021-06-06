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

    const sameUser = cache.authorCh === names?.channelName && cache.authorID === names?.authorID;
    const arrayToPrint: string[] = [" "];

    if (names?.authorName && sameUser) arrayToPrint.push(chalk `{${fYellow} ${names.authorName}}`);
    if (names?.authorID && sameUser)   arrayToPrint.push(chalk `{grey (${names.authorID}})`);
    if (names?.channelName)  arrayToPrint.push(chalk `{grey in} #${names.channelName}`);
    if (names?.guildName)    arrayToPrint.push(chalk `{grey of ${names.guildName}}`);
    if (arrayToPrint.length) arrayToPrint.push("\n");

    arrayToPrint.push(chalk ` {grey ${hour}:${min}:${sec}}`);
    arrayToPrint.push(custom);

    console.log(arrayToPrint.join(" "));

    cache.authorCh = names?.channelName || "";
    cache.authorID = names?.authorID    || "";
}



export { time, botLog }