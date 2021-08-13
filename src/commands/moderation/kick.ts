import { ApplicationCommandOptionType } from "discord-api-types";
import { MessageEmbed } from "discord.js";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { confirm, sendLog, permCheck } from "../../util/automaton.js";

export const data = {
	name: "kick",
	description: "Kicks a member",
	options: [
		{
			name: "member",
			type: ApplicationCommandOptionType.User,
			description: "Who to kick. Takes ID and mention",
			required: true
		},
		{
			name: "reason",
			type: ApplicationCommandOptionType.String,
			description: "Reason for kick"
		},
		{
			name: "nsfw",
			type: ApplicationCommandOptionType.Boolean,
			description: "Removes the member's avatar in logs if true"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, member } = interaction;
	const err = client.moji.get("err");

	if (!guild.me) return interaction.reply({ content: "Something went wrong", ephemeral: true });

	await interaction.deferReply();

	const targetId = interaction.options.get("member", true).value as string;
	const reason = interaction.options.getString("reason");
	const nsfw = interaction.options.getBoolean("nsfw");

	const target = await guild.members.fetch(targetId).catch(() => null);
	if (!target) return "This user is not in the server";

	const permError = permCheck("KICK_MEMBERS", guild.me, member, target);
	if (permError) return interaction.editReply({ content: `${err || ""} ${permError}` });

	if (target.permissions.has("KICK_MEMBERS")) return interaction.editReply(`${err || ""} You can't kick this user`);

	const sendKickEmbed = () => {
		const kickEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.orange}`)
			.setThumbnail(!nsfw ? target.user.displayAvatarURL({ size: 1024, dynamic: false }) : "")
			.addField("Succsessfully kicked", `${target} (${target.id})`)
			.setFooter("User kicked")
			.setTimestamp();

		if (reason) kickEmbed.addField("Reason", reason);
		if (nsfw) kickEmbed.addField("Info", "NSFW avatar removed from embed");

		sendLog(interaction, kickEmbed, `Successfully kicked ${target.user.tag} (${target.id})`);

		interaction.util.log(`Kicked ${target.user.tag} (${target.id})`);
	};

	const sendError = () => {
		const kickErrorEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.black}`)
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
