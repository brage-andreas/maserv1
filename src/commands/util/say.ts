import { hasPerms, log } from "../../resources/automaton.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data = {
	name: "say",
	description: "halalutrrh",
	options: [
		{
			name: "input",
			type: "STRING",
			description: "Content to send",
			required: true
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, channel, member } = interaction;

	const input = interaction.options.getString("input", true);

	const mentionOpt = { content: input };
	const opt = { content: input, allowedMentions: { parse: [] } };

	const perms = hasPerms("MENTION_EVERYONE", member) || hasPerms("MANAGE_MESSAGES", member);

	await interaction.reply(perms ? mentionOpt : opt);

	log.cmd({ cmd: "say", msg: `Said: "${input}"` }, { guild, channel, user });
}
