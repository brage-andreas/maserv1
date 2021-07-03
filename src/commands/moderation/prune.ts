import {
	ApplicationCommandData,
	Collection,
	CommandInteraction,
	GuildMember,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	TextChannel
} from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "prune",
	description: "Deletes up to 100 messages",
	options: [
		{
			name: "amount",
			type: "INTEGER",
			description: "How many messages",
			required: true
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

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild, user } = interaction;
	const member = interaction.member as GuildMember;

	if (!member.permissions.has("MANAGE_MESSAGES"))
		return interaction.reply({ content: "You don't have sufficient permissions", ephemeral: true });

	const allowedAmount = (n: number) => (Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n));
	const getChannel = (id?: `${bigint}`): TextChannel | undefined => {
		let ch: any = interaction.channel;
		if (id) ch = guild?.channels.cache.get(id);
		if (ch?.type !== "text") return;
		return ch as TextChannel;
	};

	await interaction.reply({ content: "Working...", ephemeral: true });

	const amount = allowedAmount(args.get("amount") as number);
	const targetID = args.get("user") as `${bigint}`;
	const channelID = args.get("channel") as `${bigint}`;

	const target = targetID ? await client.users.fetch(targetID) : null;
	const channel = getChannel(channelID);

	if (!channel) return interaction.editReply({ content: "Something went wrong with the channel" });

	channel.messages.fetch({ limit: amount }).then(async (messages: Collection<`${bigint}`, Message>) => {
		const msgsToDelete = target ? messages.filter((msg) => msg.author.id === target.id) : messages;

		const targetStr = target ? ` from ${target}` : "";
		const channelStr = channelID ? ` in ${channel}` : "";

		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomID("yes").setLabel("Yes").setStyle("SUCCESS"),
			new MessageButton().setCustomID("no").setLabel("No").setStyle("DANGER")
		);

		const filter = (interaction: MessageComponentInteraction) =>
			interaction.customID === "yes" || interaction.customID === "no";

		const query = (await interaction.editReply({
			content: `Are you sure you want to delete ${msgsToDelete.size} messages${targetStr}${channelStr}?`,
			components: [row]
		})) as Message;

		const collector = query.createMessageComponentInteractionCollector({ filter, time: 15000 });

		collector.on("collect", (collectedInteraction: MessageComponentInteraction) => {
			if (collectedInteraction.customID === "yes") {
				channel.bulkDelete(msgsToDelete, true).then((messages: Collection<`${bigint}`, Message>) => {
					interaction.editReply({ content: "Done!", components: [] });
					log.cmd(
						{ cmd: "prune", msg: `Deleted ${messages.size} messages` },
						{ channel: interaction.channel as TextChannel, user, guild }
					);
				});

				collector.stop("fromCollected");
			} else if (collectedInteraction.customID === "no") {
				collector.stop("fromCollected");
			}
		});

		collector.on("end", (collected: Collection<string, MessageComponentInteraction>, reason: string) => {
			if (reason === "fromCollected") interaction.editReply({ content: "Okay!", components: [] });
			else interaction.editReply({ content: "Command canceled", components: [] });
		});
	});
}
