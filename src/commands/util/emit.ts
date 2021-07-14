import { ApplicationCommandData, CommandInteraction, GuildMember, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

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

export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;
	const member = interaction.member as GuildMember;

	const event = args.get("event") as string;

	client.emit(event, member);
	interaction.reply({ content: "Done", ephemeral: true });

	log.cmd({ cmd: "emit", msg: `Emitted ${event}` }, { guild, channel, user });
}
