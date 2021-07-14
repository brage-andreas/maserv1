import { CommandInteraction, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

export const data = {
	name: "say",
	description: "halalutrrh",
	options: [
		{
			name: "input",
			type: "STRING",
			description: "Content to send",
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;
	const input = args.get("input") as string;

	await interaction.reply({ content: input, allowedMentions: { parse: [] } });

	log.cmd({ cmd: "say", msg: `Said: "${input}"` }, { guild, channel, user });
}
