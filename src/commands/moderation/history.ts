import { ApplicationCommandOptionType } from "discord-api-types";

import type { CmdInteraction } from "../../resources/definitions.js";

export const data = {
	name: "history",
	description: "Shows a member's history",
	options: [
		{
			name: "member",
			type: ApplicationCommandOptionType.User,
			description: "Who to show history of"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { user } = interaction;

	const targetId = (interaction.options.get("member")?.value as string | undefined) ?? user.id;

	interaction.util.log();
}
