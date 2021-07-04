import { ApplicationCommandData, CommandInteraction, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "eval",
	description: "Runs code",
	options: [
		{
			name: "code",
			type: "STRING",
			description: "Code to run",
			required: true
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	if (interaction.user.id !== "196333104183508992") return interaction.editReply({ content: "nei" });
	const code = args.get("code");

	try {
		const evaluated = await eval(`( async () => { ${code} })()`);
		interaction.editReply(`Output: \`\`\`js\n${evaluated}\`\`\``);

		log.cmd({ cmd: "eval", msg: `Output: "${evaluated}"` }, { guild, channel, user });
	} catch (err) {
		const errEmoji = client.moji.get("err");
		interaction.editReply(`${errEmoji} Error: \`\`\`js\n${err}\n\`\`\``);

		log.cmd({ cmd: "eval", msg: `Error: "${err}"` }, { guild, channel, user }, true);
	}
}
