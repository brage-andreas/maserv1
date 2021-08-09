import type { ApplicationCommandData, Role } from "discord.js";
import { MessageEmbed } from "discord.js";
import ms from "ms";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { confirm, getDefaultChannel, hasPerms } from "../../util/automaton.js";
import { viewValue } from "../../resources/psql/schemas/config.js";

export const data: ApplicationCommandData = {
	name: "mute",
	description: "Mutes a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Member to mute",
			required: true
		},
		{
			name: "duration",
			type: "STRING",
			description: "Member to mute"
		},
		{
			name: "reason",
			type: "STRING",
			description: "Reason for mute"
		},
		{
			name: "nsfw",
			type: "BOOLEAN",
			description: "Removes the member's avatar in logs if true"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild } = interaction;
	const err = client.moji.get("err");
	const MIN_TIME = 300000; // 5 min
	const MAX_TIME = 604800000; // 1 week

	const sendError = (str: string) => {
		interaction.reply({ content: `${err || ""} ${str}`, ephemeral: true });
	};

	if (!guild.me) return sendError("Something went wrong");

	const logChannel = await getDefaultChannel({ optGuild: guild, me: guild.me, type: "log" });

	const configMuteRoleId: string | null = await viewValue("mute_role", guild.id);
	const configMuteRole = configMuteRoleId ? guild.roles.cache.get(configMuteRoleId) ?? null : null;
	const muteRole: Role | null =
		configMuteRole ??
		guild.roles.cache.find((role) => ["muted", "mute", "silent"].some((e) => role.name.toLowerCase() === e)) ??
		null;

	if (!muteRole) return sendError("Couldn't find a mute role. Set one with the config command");

	const targetId = interaction.options.get("member", true).value as string;
	const rawDuration = interaction.options.getString("duration") ?? "1h";
	const reason = interaction.options.getString("reason");
	const nsfw = interaction.options.getBoolean("nsfw") ?? false;
	let duration = 0;

	if (targetId === interaction.user.id) return sendError("You can't mute yourself");

	const target = await guild.members.fetch(targetId).catch(() => null);
	if (!target) return sendError("This user is not in the server");
	if (hasPerms("MANAGE_ROLES", target)) return sendError("You can't mute this user");
	if (!hasPerms("MANAGE_ROLES", guild.me)) return sendError("I don't have sufficent permissions");

	try {
		duration = ms(rawDuration);
	} catch (err) {
		return sendError("Provide a valid duration");
	}

	if (duration < MIN_TIME) return sendError("Provide a longer duration. Minimum is five minutes (5 min)");
	if (duration > MAX_TIME) return sendError("Provide a shorter duration. Maximum is one week (1 w)");

	await interaction.deferReply();

	const roleIdsSet = new Set(target.roles.cache.map((role) => role.id));
	roleIdsSet.delete(guild.id);

	// SAVE MEMBER TO DB

	const durationStr = ms(duration, { long: true });

	const query = `Are you sure you want to mute ${target.user.tag} (${target.id}) for ${durationStr}?`;
	await confirm(interaction, query)
		.then(() => {
			target.roles
				.set([muteRole])
				.catch(() => interaction.editReply({ content: "I failed to change their roles", components: [] }))
				.then(() => {
					const muteEmbed = new MessageEmbed()
						.setAuthor(user.tag, user.displayAvatarURL())
						.setColor(`#${client.colours.yellow}`)
						.setThumbnail(!nsfw ? target.user.displayAvatarURL({ size: 1024, dynamic: false }) : "")
						.addField("Succsessfully muted", `${target} (${target.id})`)
						.addField("Duration", `${durationStr}`)
						.setFooter("User muted")
						.setTimestamp();
					if (reason) muteEmbed.addField("Reason", reason);
					if (nsfw) muteEmbed.addField("Info", "NSFW avatar removed from embed");

					interaction.editReply({
						content: `Successfully muted ${target.user.tag} (${target.id})`,
						components: []
					});
					if (logChannel) logChannel.send({ embeds: [muteEmbed] });

					setTimeout(() => {
						target.roles.set([...roleIdsSet]);
					}, duration);

					interaction.log(`Muted ${target.user.tag} (${targetId}) for ${durationStr}`);
				});
		})
		.catch(() => null);
}
