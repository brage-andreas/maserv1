import { ApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

type Duration = 60 | 1440 | 4320 | 10080;

const data: ApplicationCommandData = {
	name: "thread",
	description: "Lag en thread",
	options: [
		{
			name: "navn",
			type: "STRING",
			description: "Navnet til threaden",
			required: true
		},
		{
			name: "varighet",
			type: "INTEGER",
			description: "Hvor lenge threaden skal bare",
			choices: [
				{
					name: "1 time",
					value: 60
				},
				{
					name: "1 dag",
					value: 1440
				},
				{
					name: "3 dager",
					value: 4320
				},
				{
					name: "1 uke",
					value: 10080
				}
			]
		},
		{
			name: "grunn",
			type: "STRING",
			description: "Hvorfor lage tred"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	const name = args.get("navn") as string;
	const duration = (args.get("varighet") as Duration | undefined) || 1440;
	const reason = args.get("grunn") as string | undefined;

	const msg = await channel.send("lol");
	channel.threads.create({ name, autoArchiveDuration: duration, startMessage: msg, reason }).catch(() => null);

	interaction.reply({ content: "Gjort!", ephemeral: true });

	log.cmd({ cmd: "thread" }, { guild, channel, user });
}
