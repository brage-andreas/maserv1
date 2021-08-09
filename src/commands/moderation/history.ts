import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "history",
	description: "Shows a member's history",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Who to show history of"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user } = interaction;

	const targetId = (interaction.options.get("member")?.value as string | undefined) ?? user.id;

	interaction.util.log();
}
