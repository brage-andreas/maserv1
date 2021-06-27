import { CommandInteraction, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

const data = {
	name: "say",
	description: "halalutrrh",
	options: [
		{
			name: "input",
			type: "STRING",
			description: "hva jeg skal sende #iol",
			required: true
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;
	const input = args.get("input") as string;

	await interaction.reply(input);

	log.cmd({ cmd: "say", msg: `Said: "${input}"` }, { guild, channel, user });
}
