import { ApplicationCommandOptionType } from "discord-api-types";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data = {
	name: "warn",
	description: "Warns a member",
	options: [
		{
			name: "member",
			type: ApplicationCommandOptionType.User,
			description: "Member to warn",
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const option = interaction.options.getString("option", true);

	interaction.util.log();
}
