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
	description: "Slett opptil 100 meldinger i en kanal fra samme server",
	options: [
		{
			name: "antall",
			type: "INTEGER",
			description: "Hvor mange meldinger",
			required: true
		},
		{
			name: "kar",
			type: "USER",
			description: "Hvem å slette meldinger til"
		},
		{
			name: "kanal",
			type: "CHANNEL",
			description: "Hvor å slette meldinger"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild, user } = interaction;
	const member = interaction.member as GuildMember;

	if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "nei", ephemeral: true });

	const allowedAmount = (n: number) => (Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n));
	const getChannel = (id?: `${bigint}`) => {
		let ch: unknown;
		if (id) ch = guild?.channels.cache.get(id);
		if (!id) ch = interaction.channel;
		return ch as TextChannel;
	};

	await interaction.reply({ content: "Jobber...", ephemeral: true });

	const amount = allowedAmount(args.get("antall") as number);
	const targetID = args.get("kar") as `${bigint}`;
	const channelID = args.get("kanal") as `${bigint}`;

	const target = targetID ? await client.users.fetch(targetID) : null;
	const channel = getChannel(channelID);

	channel.messages.fetch({ limit: amount }).then(async (messages: Collection<`${bigint}`, Message>) => {
		const msgsToDelete = target ? messages.filter((msg) => msg.author.id === target.id) : messages;

		const targetStr = target ? ` fra ${target}` : "";
		const channelStr = channelID ? ` i kanalen ${channel}` : "";

		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomID("ja").setLabel("Ja").setStyle("SUCCESS"),
			new MessageButton().setCustomID("nei").setLabel("Nei").setStyle("DANGER")
		);

		const query = (await interaction.editReply({
			content: `Sikker på at du vil slette ${msgsToDelete.size} meldinger${targetStr}${channelStr}?`,
			components: [row]
		})) as Message;

		const filter = (interaction: MessageComponentInteraction) =>
			interaction.customID === "ja" || interaction.customID === "nei";
		const collector = query.createMessageComponentInteractionCollector({ filter, time: 15000 });

		collector.on("collect", (collectedInteraction: MessageComponentInteraction) => {
			if (collectedInteraction.customID === "ja") {
				channel.bulkDelete(msgsToDelete, true).then((messages: Collection<`${bigint}`, Message>) => {
					interaction.editReply({ content: "Gjort!", components: [] });
					log.cmd(
						{ cmd: "prune", msg: `Deleted ${messages.size} messages` },
						{ channel: interaction.channel as TextChannel, user, guild }
					);
				});

				collector.stop("fromCollected");
			} else if (collectedInteraction.customID === "nei") {
				collector.stop("fromCollected");
			}
		});

		collector.on("end", (collected: Collection<string, MessageComponentInteraction>, reason: string) => {
			if (reason === "fromCollected") interaction.editReply({ content: "Okay!", components: [] });
			else interaction.editReply({ content: "Tidsavbrudt", components: [] });
		});
	});
}
