import chalk from "chalk";
import { Collection, Guild, GuildChannel, GuildMember, TextChannel, ThreadChannel, User } from "discord.js";

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
export const time = (): string[] => {
	const now: Date = new Date();

	const sec = _twoCharLength(now.getSeconds());
	const min = _twoCharLength(now.getMinutes());
	const hour = _twoCharLength(now.getHours());

	return [sec, min, hour];
};

const _cache = { user: "", channel: "" };
export const log = {
	cmd: function (opt: LogOpt, from: LogFrom, err = false) {
		const { cmd, msg } = opt;
		const { user, channel, guild } = from;
		const [sec, min, hour] = time();

		const toPrint: string[] = [];
		const cmdStr = chalk`{${err ? FRED : FGREEN} ${cmd.toUpperCase()}}`;

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

		toPrint.push(chalk`  {grey [${hour}:${min}:${sec}]} ${cmdStr} ${msg ? chalk`{grey >} ${msg}` : ""}`);

		console.log(toPrint.join("\n"));

		_cache.channel = channel.id;
		_cache.user = user.id;
	},

	event: function (opt: LogEvent) {
		const { guild, msg } = opt;
		const [sec, min, hour] = time();

		const toPrint = [];

		toPrint.push(
			guild ? chalk`  {grey In} {${FYELLOW} ${guild.name}}` : chalk`  {grey In} {${FRED} unknown guild}`
		);
		toPrint.push(chalk`  {grey [${hour}:${min}:${sec}] >} ${msg}`);

		console.log(toPrint.join("\n"));

		_cache.channel = "";
		_cache.user = "";
	}
};

export const parseDate = (timestamp: number | null): string => {
	if (!timestamp) return "Unknown date";
	return `<t:${Math.ceil(timestamp / 1000)}:R>`;
};

export const getDefaultChannel = (opt: { optChannel?: TextChannel; optGuild?: Guild; me: GuildMember }) => {
	const { optChannel, optGuild, me } = opt;

	const hasPerms = (channel: GuildChannel | TextChannel) => {
		if (channel.type !== "text") return false;
		const perms = me.permissionsIn(channel);
		return perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES");
	};

	channel: if (optChannel) {
		const perms = me.permissionsIn(optChannel);
		if (!perms.has("VIEW_CHANNEL") || !perms.has("SEND_MESSAGES")) break channel;
	}

	if (optGuild) {
		const isValid = (ch: GuildChannel | ThreadChannel) => ch.type === "text" && hasPerms(ch);
		const usableChannels = optGuild.channels.cache.filter(isValid) as Collection<`${bigint}`, TextChannel>;
	}
};
