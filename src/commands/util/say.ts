import { ApplicationCommandOptionType } from "discord-api-types";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { hasPerms, permCheck } from "../../util/automaton.js";

export const data = {
	name: "say",
	description: "halalutrrh",
	options: [
		{
			name: "input",
			type: ApplicationCommandOptionType.String,
			description: "Content to send",
			required: true
		},
		{
			name: "anonymous",
			type: ApplicationCommandOptionType.Boolean,
			description: "Wheter to hide the executor"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { guild, member } = interaction;

	const input = interaction.options.getString("input", true);
	const anon = interaction.options.getBoolean("anonymous") ?? false;

	if (!guild.me) return interaction.reply({ content: "Something went wrong", ephemeral: true });

	const permError = permCheck("SEND_MESSAGES", guild.me, member, null);
	if (permError) return interaction.reply({ content: permError, ephemeral: true });

	const mentionOpt = { content: input };
	const opt = { content: input, allowedMentions: { parse: [] } };

	const perms = hasPerms("MENTION_EVERYONE", member);

	// TODO: check mod role
	if (anon) {
		await interaction.reply({ content: "Done!", ephemeral: true });
		await interaction.channel.send(perms ? mentionOpt : opt);
	} else {
		await interaction.reply(perms ? mentionOpt : opt);
	}

	interaction.util.log(`Said: "${input}" ${anon ? "anonymously" : ""}`);
}
