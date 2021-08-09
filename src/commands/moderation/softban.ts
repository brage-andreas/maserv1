import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

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
	const option = interaction.options.getString("option", true);

	interaction.util.log();
}
