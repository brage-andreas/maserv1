import { ApplicationCommandOptionType } from "discord-api-types";

import type { CmdInteraction } from "../../resources/definitions.js";

export const data = {
	name: "softban",
	description: "Softbans a member",
	options: [
		{
			name: "member",
			type: ApplicationCommandOptionType.User,
			description: "Member to softban",
			required: true
		},
		{
			name: "days",
			type: ApplicationCommandOptionType.Integer,
			description: "Days to prune messages"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const option = interaction.options.getString("option", true);

	interaction.util.log();
}
