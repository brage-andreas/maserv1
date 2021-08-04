import { ApplicationCommandData } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

export const data: ApplicationCommandData = {
	name: "softban",
	description: "Softbans a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Member to softban",
			required: true
		},
		{
			name: "days",
			type: "INTEGER",
			description: "Days to prune messages"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, channel } = interaction;

	const option = interaction.options.getString("option", true);

	log.cmd({ cmd: "" }, { guild, channel, user });
}
