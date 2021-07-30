import chalk from "chalk";
import {
	Collection,
	CommandInteraction,
	Guild,
	GuildChannel,
	GuildMember,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEmbed,
	PermissionResolvable,
	TextChannel,
	ThreadChannel,
	User
} from "discord.js";

import { FGREEN, FRED, FYELLOW } from "../constants.js";
import { viewValue } from "./psql/config/config.js";

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

export const parseDate = (timestamp: number | null): string => {
	if (!timestamp) return "Unknown date";
	return `<t:${Math.ceil(timestamp / 1000)}:R>`;
};

interface DefaultChannelOpt {
	optChannel?: TextChannel;
	optGuild?: Guild;
	me: GuildMember;
	type?: "member_log" | "log";
}
export const getDefaultChannel = async (opt: DefaultChannelOpt): Promise<TextChannel | null> => {
	return new Promise(async (resolve, reject) => {
		const { optChannel, optGuild, me, type } = opt;

		const perms: PermissionResolvable[] = ["VIEW_CHANNEL", "SEND_MESSAGES"];

		channel: if (optChannel) {
			if (!hasPerms(perms, me, optChannel)) break channel;
			resolve(optChannel);
		}

		if (optGuild) {
			const isValid = (ch: GuildChannel | ThreadChannel) => ch.type === "GUILD_TEXT" && hasPerms(perms, me, ch);
			const usableChannels = optGuild.channels.cache.filter(isValid) as Collection<`${bigint}`, TextChannel>;
			if (!usableChannels.size) resolve(null);

			const dbChannelID = type ? await viewValue(`${type}_channel`, optGuild.id) : null;

			const dbChannel = dbChannelID
				? (optGuild.channels.cache.get(dbChannelID as `${bigint}`) as TextChannel | undefined)
				: null;

			if (dbChannel) {
				if (isValid(dbChannel)) resolve(dbChannel);
				else reject(`Default ${type} is set, but I cannot send messages in ${dbChannel}.`);
			}

			const priorityChannel = usableChannels.find((ch) => ch.name === "general" || ch.name === "main");
			resolve(priorityChannel ?? usableChannels.first() ?? null);
		}
	});
};

export const confirm = async (itr: CommandInteraction, customContent?: string) => {
	return new Promise(async (resolve, reject) => {
		const row = new MessageActionRow().addComponents([
			new MessageButton().setCustomId("yes").setLabel("Yes").setStyle("SUCCESS"),
			new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER")
		]);

		const filter = (it: MessageComponentInteraction) => it.customId === "yes" || it.customId === "no";

		const query = (await itr.editReply({
			content: customContent || "Are you sure?",
			components: [row]
		})) as Message;

		const collector = query.createMessageComponentCollector({ filter, time: 15000 });

		collector.on("collect", (collectedInteraction: MessageComponentInteraction) => {
			if (collectedInteraction.customId === "yes") {
				collector.stop("fromCollected");
				resolve("");
			} else if (collectedInteraction.customId === "no") {
				collector.stop("fromCollected");
				reject("");
			}
		});

		collector.on("end", (useless: unknown, reason: string) => {
			if (reason !== "fromCollected") {
				itr.editReply({ content: "Command canceled", components: [] });
				reject("");
			}
		});
	});
};

type Perm = PermissionResolvable | PermissionResolvable[];
export const hasPerms = (permissions: Perm, member: GuildMember | null, channel?: GuildChannel | TextChannel) => {
	if (!member) return false;

	const toCheck = typeof permissions === "object" ? permissions : [permissions];
	const perms = channel ? member.permissionsIn(channel) : member.permissions;

	return perms.has(toCheck);
};

const _cache = { user: "", channel: "" };
export const log = {
	cmd: function (opt: LogOpt, from: LogFrom, err = false): void {
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

	event: function (opt: LogEvent): void {
		const { guild, msg } = opt;
		const [sec, min, hour] = time();

		const newLine = _cache.channel || _cache.user;
		const toPrint = newLine ? [""] : [];

		toPrint.push(
			guild ? chalk`  {grey In} {${FYELLOW} ${guild.name}}` : chalk`  {grey In} {${FRED} unknown guild}`
		);
		toPrint.push(chalk`  {grey [${hour}:${min}:${sec}] >} ${msg}`);

		console.log(toPrint.join("\n"));

		_cache.channel = "";
		_cache.user = "";
	}
};
