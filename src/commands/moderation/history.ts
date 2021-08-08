import { ApplicationCommandData } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../util/automaton.js";

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
	const { user, guild, channel } = interaction;

	const targetId = (interaction.options.get("member")?.value as string | undefined) ?? user.id;

	log.cmd({ cmd: "history", msg: `Showed history of X (${targetId})` }, { guild, channel, user });
}
