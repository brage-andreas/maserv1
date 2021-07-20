import { ApplicationCommandData, MessageEmbed } from "discord.js";

import { log, confirm, hasPerms, getDefaultChannel } from "../../resources/automaton.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "kick",
	description: "Kicks a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Who to kick. Takes ID and mention",
			required: true
		},
		{
			name: "reason",
			type: "STRING",
			description: "Reason for kick"
		},
		{
			name: "nsfw",
			type: "BOOLEAN",
			description: "Removes the member's avatar in logs if true"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, member, channel } = interaction;
	const err = client.moji.get("err");

	if (!guild.me) return interaction.reply({ content: "Something went wrong", ephemeral: true });

	await interaction.defer();

	if (!hasPerms("KICK_MEMBERS", guild.me)) {
		interaction.editReply(`${err || ""} I don't have sufficient permissions`);
		return;
	}

	if (!hasPerms("KICK_MEMBERS", member)) {
		interaction.editReply(`${err || ""} You don't have sufficient permissions`);
		return;
	}

	const targetId = interaction.options.get("member", true).value as `${bigint}`;
	const reason = interaction.options.getString("reason");
	const nsfw = interaction.options.getBoolean("nsfw");

	if (targetId === interaction.user.id) {
		interaction.editReply(`${err || ""} You can't kick yourself`);
		return;
	}

	const target = await guild.members.fetch(targetId).catch(() => null);
	if (!target) return interaction.editReply({ content: "This user is not in the server" });

	if (target.permissions.has("KICK_MEMBERS")) {
		interaction.editReply(`${err || ""} You can't kick this user`);
		return;
	}

	const logChannel = await getDefaultChannel({ optGuild: guild, me: guild.me, type: "log" });

	const sendKickEmbed = () => {
		const kickEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.yellow}`)
			.setThumbnail(!nsfw ? target.user.displayAvatarURL({ size: 1024, dynamic: false }) : "")
			.addField("Succsessfully kicked", `${target} (${target.id})`)
			.setFooter("User kicked")
			.setTimestamp();

		if (reason) kickEmbed.addField("Reason", reason);
		if (nsfw) kickEmbed.addField("Info", "NSFW avatar removed from embed");

		interaction.editReply({ content: `Successfully kicked ${target.user.tag} (${target.id})`, components: [] });
		if (logChannel) logChannel.send({ embeds: [kickEmbed] });

		log.cmd({ cmd: "kick", msg: `Kicked ${target.user.tag} (${target.id})` }, { guild, channel, user });
	};

	const sendError = () => {
		const kickErrorEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.addField("Failed to kick", `${target.toString()} (${target.id})`)
			.setFooter("Kick failed")
			.setTimestamp();

		interaction.editReply({ embeds: [kickErrorEmbed], content: null, components: [] });
	};

	const auditReason = `${reason ? `${reason} | ` : ""}Kicked by ${user.tag} (${user.id})`;
	const query = `Are you sure you want to kick ${target.user.tag} (${target.id})?`;
	await confirm(interaction, query)
		.then(() => target.kick(auditReason).catch(sendError).then(sendKickEmbed))
		.catch(() => null);
}
