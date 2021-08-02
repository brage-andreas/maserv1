import { ApplicationCommandData } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

export const data: ApplicationCommandData = {
	name: "restrict",
	description: "Restricts a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Member to restrict",
			required: true
		},
		{
			name: "restriction",
			type: "STRING",
			description: "Restrict to give",
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, channel } = interaction;

	const targetId = interaction.options.get("member", true).value;

	log.cmd({ cmd: "restrict" }, { guild, channel, user });
}
