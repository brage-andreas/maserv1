import chalk from "chalk";

import { cols, fCols } from "./colours.js";

const { red, green, yellow } = cols;
const { fRed, fGreen, fYellow } = fCols;

const twoCharLength = (num: number): string => (num < 10 ? String("0" + num) : String(num));

interface BotLogNames {
	guildName?: string;
	channelName?: string;
	authorName?: string;
	authorID?: string;
}

/**
 * @returns sec, min, hour [ ]
 */
const time = (): string[] => {
	const now: Date = new Date();

	const sec = twoCharLength(now.getSeconds());
	const min = twoCharLength(now.getMinutes());
	const hour = twoCharLength(now.getHours());

	return [sec, min, hour];
};

const cache: { authorID: string; authorCh: string } = { authorID: "", authorCh: "" };

// botLog(chalk `{${fGreen} COMMAND} {grey > MESSAGE}`);
const botLog = async (custom: string, names?: BotLogNames): Promise<void> => {
	const [sec, min, hour] = time();
	const same = cache.authorCh === names?.channelName && cache.authorID === names?.authorID;

	if (!same) {
		const memberLocationArray: string[] = ["\n "];

		if (names?.authorName) memberLocationArray.push(chalk`{${fYellow} ${names.authorName}}`);
		if (names?.authorID) memberLocationArray.push(chalk`{grey (${names.authorID})}`);
		if (names?.channelName) memberLocationArray.push(chalk`{grey in} #${names.channelName}`);
		if (names?.guildName) memberLocationArray.push(chalk`{grey of ${names.guildName}}`);

		if (memberLocationArray.length > 1) {
			console.log(memberLocationArray.join(" "));
		}
	}

	const content = chalk`  {grey ${hour}:${min}:${sec}} ${custom}`;
	console.log(content);

	cache.authorCh = names?.channelName || "";
	cache.authorID = names?.authorID || "";
};

const parseDate = (timestamp: number | null): string => {
	if (!timestamp) return "Ukjent dato";
	return `<t:${Math.ceil(timestamp / 1000)}:R>`;
};

export { time, botLog, parseDate };
