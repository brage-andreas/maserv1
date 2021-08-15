import type { GuildChannel, Message, TextChannel } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
import { Collection } from "discord.js";

import type { CmdInteraction } from "../../resources/definitions.js";
import { confirm, hasPerms } from "../../util/automaton.js";

export const data = {
	name: "prune",
	description: "Deletes up to 100 messages",
	options: [
		{
			name: "amount",
			type: ApplicationCommandOptionType.Integer,
			description: "How many messages",
			required: true
		},
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "Who to limit deleting to"
		},
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "Where to delete messages. Channel must be in the same guild"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { client, member, guild } = interaction;

	await interaction.reply({ content: "Working...", ephemeral: true });

	const err = client.moji.get("err");
	if (!hasPerms(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"], guild.me))
		return interaction.editReply(`${err || ""} I don't have sufficient permissions`);

	if (!hasPerms(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"], member))
		return interaction.editReply(`${err || ""} You don't have sufficient permissions`);

	const allowedAmount = (n: number) => (Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n));
	const getChannel = (ch: GuildChannel | null) => {
		if (!ch?.isText()) return null;
		return ch;
	};

	const rawAmount = interaction.options.getInteger("amount", true);
	const target = interaction.options.getUser("user");
	const rawChannel = (interaction.options.getChannel("channel") as GuildChannel | null) ?? interaction.channel;

	const channel = getChannel(rawChannel);
	const amount = allowedAmount(rawAmount);

	if (!channel) return interaction.editReply({ content: "Something went wrong with the channel" });

	channel.messages
		.fetch({ limit: amount })
		.then(async (messages: Collection<string, Message>) => {
			const msgsToDelete = target ? messages.filter((msg) => msg.author.id === target.id) : messages;

			const targetStr = target ? ` from ${target}` : "";
			const channelStr = channel ? ` in ${channel}` : "";

			const query = `Are you sure you want to delete ${msgsToDelete.size} messages${targetStr}${channelStr}?`;
			await confirm(interaction, query)
				.then(() => {
					channel.bulkDelete(msgsToDelete, true).then((messages: Collection<string, Message>) => {
						interaction.editReply({ content: "Done!", components: [] });

						interaction.util.log(`Deleted ${messages.size} messages`);
					});
				})
				.catch(() => null);
		})
		.catch(() => interaction.editReply({ content: "Something went wrong with fetching the messages" }));
}
