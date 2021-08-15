import { ApplicationCommandOptionType } from "discord-api-types";
import { MessageEmbed } from "discord.js";

import type { CmdInteraction } from "../../resources/definitions.js";
import { confirm, parseDate } from "../../util/automaton.js";
import { USER_STATUS } from "../../constants.js";
import { clearNick, getNick } from "../../resources/psql/schemas/nicks.js";

export const data = {
	name: "nicks",
	description: "Administer your nicks",
	options: [
		{
			name: "clear",
			type: ApplicationCommandOptionType.SubCommand,
			description: "Clear your nicks in this server"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { user, guild, member } = interaction;

	await interaction.deferReply({ ephemeral: true });

	const nicks = await getNick(guild.id, user.id, member.displayName);
	if (!nicks || nicks.length <= 1) {
		interaction.editReply("Looks like your name history is already cleared!");
		return;
	}

	const msg = `Are you sure you want to delete your name history?\n\`${nicks.join("`, `")}\``;
	await confirm(interaction, msg)
		.then(async () => {
			await clearNick(guild.id, user.id);
			interaction.util.log(`Used on ${user.tag} (${user.id})`);
		})
		.catch(() => null);
}
