import { ApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";
import { getNick } from "../../resources/psql/nicks/nicks.js";

const data: ApplicationCommandData = {
	name: "psql",
	description: "psql lol",
	options: [
		{
			name: "query",
			type: "STRING",
			description: "idk",
			required: true
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	//console.log(await exists("row", interaction.user.id, `guild_486548195137290265`));

	const input = args.get("query") as string;
	interaction.reply(input);

	console.log(await getNick(user.id, "486548195137290265"));

	log.cmd({ cmd: "psql" }, { channel, user, guild });
}
