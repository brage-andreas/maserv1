import chalk from "chalk";
import { Guild, TextChannel, User } from "discord.js";

import { FGREEN, FRED, FYELLOW } from "./constants.js";

const _twoCharLength = (num: number): string => (num < 10 ? String("0" + num) : String(num));

interface LogOpt {
	cmd: string;
	msg?: string;
}

interface LogFrom {
	user: User;
	channel: TextChannel;
	guild: Guild | null;
}

interface LogEvent {
	msg: string;
	guild: Guild | null;
}

// -----
// -----
// -----

/**
 * @returns sec, min, hour [ ]
 */
const time = (): string[] => {
	const now: Date = new Date();

	const sec = _twoCharLength(now.getSeconds());
	const min = _twoCharLength(now.getMinutes());
	const hour = _twoCharLength(now.getHours());

	return [sec, min, hour];
};

const _cache = { user: "", channel: "" };
const log = {
	cmd: function (opt: LogOpt, from: LogFrom, err = false) {
		const { cmd, msg } = opt;
		const { user, channel, guild } = from;
		const toPrint: string[] = [];

		if (_cache.channel !== channel.id || _cache.user !== user.id) {
			const fromArray = [];

			// User
			fromArray.push(chalk`\n  {${FYELLOW} ${user.tag}} {grey (${user.id})}`);

			// Channel
			if (fromArray.length) {
				fromArray.push(chalk`{grey in} #${channel.name}`);
			} else {
				fromArray.push(chalk`  {grey In} {${FYELLOW} #${channel.name}}`);
			}

			// Guild
			if (fromArray.length) {
				fromArray.push(chalk`{grey in} ${guild?.name || "unknown guild"}`);
			} else {
				fromArray.push(chalk`  {grey In} {${FYELLOW} ${guild?.name || "unknown guild"}}`);
			}

			toPrint.push(fromArray.join(" "));
		}

		toPrint.push(chalk`  {${err ? FRED : FGREEN} ${cmd.toUpperCase()}} ${msg ? chalk`{grey >} ${msg}` : ""}`);

		console.log(toPrint.join("\n"));

		_cache.channel = channel.id;
		_cache.user = user.id;
	},

	event: function (opt: LogEvent) {
		const { guild, msg } = opt;
		const toPrint = [];

		toPrint.push(guild ? chalk`{${FYELLOW} ${guild.name}}` : chalk`{${FRED} Unknown guild}`);
		toPrint.push(chalk`${msg}`);

		console.log(toPrint.join("\n"));

		_cache.channel = "";
		_cache.user = "";
	}
};

const parseDate = (timestamp: number | null): string => {
	if (!timestamp) return "Ukjent dato";
	return `<t:${Math.ceil(timestamp / 1000)}:R>`;
};

export { time, log, parseDate };
