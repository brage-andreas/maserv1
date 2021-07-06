import { ApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { CONFIG_METHOD_CHOICES, CONFIG_OPTION_CHOICES } from "../../resources/constants.js";
import { Args, DaClient } from "../../resources/definitions.js";

const data: ApplicationCommandData = {
	name: "config",
	description: "Changes the various options for this server",
	options: [
		{
			name: "option",
			type: "STRING",
			description: "What option to administer",
			choices: CONFIG_OPTION_CHOICES,
			required: true
		},
		{
			name: "method",
			type: "STRING",
			description: "What method to use",
			choices: CONFIG_METHOD_CHOICES,
			required: true
		},
		{
			name: "value",
			type: "STRING",
			description: "What to update the setting to"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	const option = args.get("option") as string;
	const method = args.get("method") as string;
	const value = args.get("option") as string | undefined;

	if (method === "set") {
	} else if (method === "view") {
	} else if (method === "remove") {
	}

	log.cmd(
		{ cmd: "config", msg: `Used method ${method} on option ${option}${value ? ` with value "${value}"` : ""}` },
		{ guild, channel, user }
	);
}
