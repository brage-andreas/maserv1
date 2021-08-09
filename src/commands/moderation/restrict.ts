import type { ApplicationCommandData } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { RESTRICTIONS, RESTRICTIONS_STR } from "../../constants.js";
import { Restriction } from "../../resources/psql/schemas/restrictions.js";
import ms from "ms";

export const data: ApplicationCommandData = {
	name: "restrict",
	description: "Restricts a member",
	options: RESTRICTIONS.map((restriction) => {
		return {
			name: restriction,
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
					name: "duration",
					type: "STRING",
					description: "Duration of restrict",
					required: true,
					choices: [
						{ name: "15 minutes", value: "15 min" },
						{ name: "1 hour", value: "1h" },
						{ name: "3 hours", value: "3h" },
						{ name: "6 hours", value: "6h" },
						{ name: "12 hours", value: "12h" },
						{ name: "1 day", value: "1d" },
						{ name: "2 days", value: "2d" },
						{ name: "3 days", value: "3d" },
						{ name: "7 days", value: "7d" }
					]
				},
				{
					name: "reason",
					type: "STRING",
					description: "Reason of restrict"
				}
			]
		};
	})
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { guild } = interaction;
	await interaction.deferReply({ ephemeral: true });

	const flag = interaction.options["_subcommand"] as RESTRICTIONS_STR | null;

	const memUser = interaction.options.getUser("member", true);
	const duration = ms(interaction.options.getString("duration", true));
	const reason = interaction.options.getString("reason");

	const member = await guild.members.fetch(memUser).catch(() => null);
	const preRoles = member ? new Set(member.roles.cache.keys()) : null;
	const { id } = memUser;

	const restrictions = new Restriction(id, guild.id);
	await restrictions.init();

	if (!flag) return interaction.editReply("Something went wrong with the sub-command");

	const added = await restrictions.add(flag);
	if (!added) return interaction.editReply("Restriction was not added, as the member already has it");

	const roleId = restrictions.getRoleId(flag);

	if (preRoles && roleId && !preRoles.has(roleId)) {
		if (member) {
			const newRoles = preRoles.add(roleId);

			member?.roles.set([...newRoles]);

			// TODO set to DB
			setTimeout(() => member?.roles.set([...preRoles]), duration);
		}
	}

	interaction.editReply(`Successfully added ${flag} restriction to ${member}`);

	const msg = `${flag} added to ${memUser.tag} (${memUser.id})`;
	interaction.util.log(msg);
}
