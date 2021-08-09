import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { RESTRICTIONS, RESTRICTIONS_STR } from "../../constants.js";
import { Restriction } from "../../resources/psql/schemas/restrictions.js";

export const data: ApplicationCommandData = {
	name: "restrict",
	description: "Restricts a member",
	options: RESTRICTIONS.map((r) => {
		return {
			name: r,
			type: "SUB_COMMAND",
			description: "Type of restriction",
			options: [
				{
					name: "member",
					type: "USER",
					description: "Member to restrict",
					required: true
				},
				{
					name: "remove",
					type: "BOOLEAN",
					description: "Remove this restriction"
				}
			]
		};
	})
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { guild } = interaction;
	// TODO: fix mute and create unrestrict
	await interaction.deferReply({ ephemeral: true });

	const flag = interaction.options["_subcommand"] as RESTRICTIONS_STR | null;
	const memUser = interaction.options.getUser("member", true);
	const remove = interaction.options.getBoolean("remove") ?? false;

	const member = await guild.members.fetch(memUser).catch(() => null);
	const roles = member ? new Set(member.roles.cache.keys()) : null;
	const { id } = memUser;

	const restrictions = new Restriction(id, guild.id);
	await restrictions.init();

	if (!flag) return interaction.editReply("Something went wrong with the sub-command");

	if (remove) {
		const removed = await restrictions.remove(flag);
		if (!removed) return interaction.editReply("Restriction was not removed, as the member does not have it");

		const roleId = restrictions.getRoleId(flag);

		if (roles && roleId && roles.has(roleId)) {
			roles.delete(roleId);
			member?.roles.set([...roles]);
		}

		interaction.editReply(`Successfully removed ${flag} restriction from ${member}`);
	} else {
		const added = await restrictions.add(flag);
		if (!added) return interaction.editReply("Restriction was not added, as the member already has it");

		const roleId = restrictions.getRoleId(flag);

		if (roles && roleId && !roles.has(roleId)) {
			roles.add(roleId);
			member?.roles.set([...roles]);
		}

		interaction.editReply(`Successfully added ${flag} restriction to ${member}`);
	}

	const msg = `${flag} ${remove ? "removed from" : "added to"} ${memUser.tag} (${memUser.id})`;
	interaction.log(msg);
}
