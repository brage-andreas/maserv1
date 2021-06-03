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
const botLog = async (custom: string, names: BotLogNamesInterface): Promise<void> => {
    const { guildName, channelName, authorName, authorID } = names;
    const [sec, min, hour] = time();

    const arrayToPrint: string[] = [" "];

    if (authorName)  arrayToPrint.push(chalk `{${fYellow} ${authorName}}`);
    if (authorID)    arrayToPrint.push(chalk `{grey (${authorID}})`);
    if (channelName) arrayToPrint.push(chalk `{grey in} #${channelName}`);
    if (guildName)   arrayToPrint.push(chalk `{grey of ${guildName}}`);

    arrayToPrint.push(chalk `\n  {grey ${hour}:${min}:${sec}}`);
    arrayToPrint.push(custom);

    console.log(arrayToPrint.join(" "));

    cache.authorCh = channelName || "";
    cache.authorID = authorID    || "";
}



export { time, botLog }