import { ApplicationCommandOptionType } from "discord-api-types";
import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data = {
	name: "emit",
	description: "Emits an event",
	options: [
		{
			name: "event",
			type: ApplicationCommandOptionType.String,
			description: "What event to emit",
			choices: [
				{
					name: "join",
					value: "guildMemberAdd"
				},
				{
					name: "leave",
					value: "guildMemberRemove"
				}
			],
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { member } = interaction;

	const event = interaction.options.getString("event", true);

	client.emit(event, member);
	interaction.reply({ content: "Done", ephemeral: true });

	interaction.util.log(`Emitted ${event}`);
}
