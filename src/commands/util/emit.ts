import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "emit",
	description: "Emits an event",
	options: [
		{
			name: "event",
			type: "STRING",
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
