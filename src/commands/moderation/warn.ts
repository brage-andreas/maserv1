import { ApplicationCommandData } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../util/automaton.js";

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
	const { user, guild, channel } = interaction;

	const option = interaction.options.getString("option", true);

	log.cmd({ cmd: "" }, { guild, channel, user });
}
