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
	ThreadChannel
} from "discord.js";

import { CmdInteraction } from "../resources/definitions.js";
import { viewValue } from "../resources/psql/schemas/config.js";

const _twoCharLength = (num: number): string => (num < 10 ? String("0" + num) : String(num));

interface DefaultChannelOpt {
	optChannel?: TextChannel;
	optGuild?: Guild;
	me: GuildMember;
	type?: "member_log" | "log";
}

// -----
// -----
// -----

export const getTime = () => {
	const now: Date = new Date();

	const sec = _twoCharLength(now.getSeconds());
	const min = _twoCharLength(now.getMinutes());
	const hour = _twoCharLength(now.getHours());

	return `[${hour}:${min}:${sec}]`;
};

export const parseDate = (timestamp: number | null): string => {
	if (!timestamp) return "Unknown date";
	return `<t:${Math.ceil(timestamp / 1000)}:R>`;
};

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
			const usableChannels = optGuild.channels.cache.filter(isValid) as Collection<string, TextChannel>;
			if (!usableChannels.size) resolve(null);

			const dbChannelID = type ? await viewValue(type, optGuild.id) : null;

			const dbChannel = dbChannelID
				? (optGuild.channels.cache.get(dbChannelID as string) as TextChannel | undefined)
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

	const toCheck = Array.isArray(permissions) ? permissions : [permissions];
	const perms = channel ? member.permissionsIn(channel) : member.permissions;

	return perms.has(toCheck);
};

export const permCheck = (perm: Perm, me: GuildMember, member: GuildMember, target: GuildMember | null) => {
	if (!hasPerms(perm, me)) return "I don't have sufficient permissions";
	if (!hasPerms(perm, member)) return "You don't have sufficient permissions";

	if (target && target.id === member.user.id) return "You can't do this action on yourself";

	return null;
};

export const sendLog = async (interaction: CmdInteraction, embed: MessageEmbed, reply: string) => {
	const optGuild = interaction.guild;
	const me = optGuild.me as GuildMember;

	const logChannel = await getDefaultChannel({ optGuild, me, type: "log" });
	interaction.editReply({ content: reply, components: [] });

	if (logChannel) logChannel.send({ embeds: [embed] });
};
