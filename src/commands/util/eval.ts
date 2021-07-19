import { ApplicationCommandData } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

export const data: ApplicationCommandData = {
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

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, channel } = interaction;

	await interaction.defer();

	if (interaction.user.id !== "196333104183508992") return interaction.editReply({ content: "nei" });
	const code = interaction.options.getString("code", true);

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
