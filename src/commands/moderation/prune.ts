import { ApplicationCommandData, Collection, GuildChannel, Message, TextChannel } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { confirm, hasPerms, log } from "../../util/automaton.js";

export const data: ApplicationCommandData = {
	name: "prune",
	description: "Deletes up to 100 messages",
	options: [
		{
			name: "amount",
			type: "INTEGER",
			description: "How many messages"
		},
		{
			name: "user",
			type: "USER",
			description: "Who to limit deleting to"
		},
		{
			name: "channel",
			type: "CHANNEL",
			description: "Where to delete messages. Channel must be in the same guild"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, member, guild } = interaction;

	// --- Perms
	const err = client.moji.get("err");
	if (!hasPerms(["BAN_MEMBERS"], guild.me))
		return interaction.editReply(`${err || ""} I don't have sufficient permissions`);

	if (!hasPerms(["BAN_MEMBERS"], member))
		return interaction.editReply(`${err || ""} You don't have sufficient permissions`);

	// --- Functions
	const allowedAmount = (n: number) => (Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n));
	const getChannel = (ch: GuildChannel | null): TextChannel | null => {
		if (ch?.type !== "GUILD_TEXT") return null;
		return ch as TextChannel;
	};

	// --- Deferring
	await interaction.reply({ content: "Working...", ephemeral: true });

	// --- Args
	const rawChannel = (interaction.options.getChannel("channel") as GuildChannel | null) ?? interaction.channel;
	const rawAmount = interaction.options.getInteger("amount") ?? 50;
	const target = interaction.options.getUser("user");

	const channel = getChannel(rawChannel);
	const amount = allowedAmount(rawAmount);

	if (!channel) return interaction.editReply({ content: "Something went wrong with the channel" });

	// --- Prune
	channel.messages.fetch({ limit: amount }).then(async (messages: Collection<string, Message>) => {
		const msgsToDelete = target ? messages.filter((msg) => msg.author.id === target.id) : messages;

		const targetStr = target ? ` from ${target}` : "";
		const channelStr = channel ? ` in ${channel}` : "";

		const query = `Are you sure you want to delete ${msgsToDelete.size} messages${targetStr}${channelStr}?`;
		await confirm(interaction, query)
			.then(() => {
				channel.bulkDelete(msgsToDelete, true).then((messages: Collection<string, Message>) => {
					interaction.editReply({ content: "Done!", components: [] });
					log.cmd(
						{ cmd: "prune", msg: `Deleted ${messages.size} messages` },
						{ channel: interaction.channel as TextChannel, user, guild }
					);
				});
			})
			.catch(() => null);
	});
}
