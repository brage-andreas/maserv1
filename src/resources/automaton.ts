import chalk from "chalk";

import { cols, fCols } from "./colours"
import { BotLogNamesInterface } from "./definitions";

const { red, green, yellow } = cols;
const { fRed, fGreen, fYellow } = fCols;

const twoCharLength = (num: number): string => num<10 ? String("0"+num) : String(num);

/**
 * @returns sec, min, hour [ ]
 */
 const time = (): string[] => {
    const now = new Date;
    
    const sec = twoCharLength(now.getSeconds());
    const min = twoCharLength(now.getMinutes());
    const hour = twoCharLength(now.getHours());
    
    return [sec, min, hour];
}

const botLog = async (custom: string, names: BotLogNamesInterface) => {
    const [ sec, min, hour ] = time();
    const { guildName, channelName, authorName, authorID } = names;

    const strTime    = chalk `{grey ${hour}:${min}:${sec}}`;
    const strChannel = channelName ? chalk `{${yellow} #${channelName}} ` : "";
    const strGuild   = guildName ? chalk `{grey in "${guildName}"} ` : "";

    console.log(chalk `  {${red} ~/ CLIENT} ${strChannel}${strGuild}\n   ${strTime} ${custom}`);
}



export { time }