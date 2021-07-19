import { ApplicationCommandData, CommandInteraction, GuildMember, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

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
	const { user, guild, channel, member } = interaction;

	const event = interaction.options.getString("event", true);

	client.emit(event, member);
	interaction.reply({ content: "Done", ephemeral: true });

	log.cmd({ cmd: "emit", msg: `Emitted ${event}` }, { guild, channel, user });
}
