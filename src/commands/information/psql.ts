import { ApplicationCommandData, Collection, CommandInteraction, TextChannel } from "discord.js";
import chalk from "chalk";

import { DaClient } from "../../resources/definitions.js";
import { botLog } from "../../resources/automaton.js";
import { getNick } from "../../resources/psql/query.js";

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
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, unknown>) {
	const { fGreen } = client.formattedColours;
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	//console.log(await exists("row", interaction.user.id, `guild_486548195137290265`));

	const input = args.get("query") as string;
	interaction.reply(JSON.stringify(await getNick(user.id, "486548195137290265")));

	botLog(chalk`{${fGreen} COMMAND} {grey > Text}`, {
		authorName: user.tag,
		authorID: user.id,
		channelName: channel.name,
		guildName: guild?.name
	});
}
