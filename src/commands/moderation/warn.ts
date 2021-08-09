import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "warn",
	description: "Warns a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Member to warn",
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const option = interaction.options.getString("option", true);

	interaction.log();
}
