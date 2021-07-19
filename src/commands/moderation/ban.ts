import { ApplicationCommandData, MessageEmbed } from "discord.js";

import { log, confirm, hasPerms } from "../../resources/automaton.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "ban",
	description: "Bans a member",
	options: [
		{
			name: "member",
			type: "USER",
			description: "Who to ban. Takes ID and mention",
			required: true
		},
		{
			name: "reason",
			type: "STRING",
			description: "Reason for ban"
		},
		{
			name: "days",
			type: "INTEGER",
			description: "How many days to prune messages"
		},
		{
			name: "nsfw",
			type: "BOOLEAN",
			description: "Removes the member's avatar if true"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, member, channel } = interaction;

	await interaction.defer();

	const err = client.moji.get("err");
	if (!hasPerms("BAN_MEMBERS", guild.me))
		return interaction.editReply(`${err || ""} I don't have sufficient permissions`);

	if (!hasPerms("BAN_MEMBERS", member))
		return interaction.editReply(`${err || ""} You don't have sufficient permissions`);

	const target = interaction.options.getUser("member", true);
	const reason = interaction.options.getString("reason") ?? undefined;
	const rawDays = interaction.options.getInteger("days") ?? 7;
	const nsfw = interaction.options.getBoolean("nsfw");

	const days = Math.ceil(rawDays) > 7 ? 7 : Math.ceil(rawDays) < 0 ? 0 : Math.ceil(rawDays);

	const sendBanEmbed = () => {
		const banEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.green}`)
			.setThumbnail(!nsfw ? target.displayAvatarURL({ size: 1024, dynamic: false }) : "")
			.addField("Succsessfully banned", `${target} (${target.id})`)
			.setFooter("User banned")
			.setTimestamp();

		if (reason) banEmbed.addField("Reason", reason);
		banEmbed.addField(
			"Info",
			`Last ${days} days of messages pruned${nsfw ? `\nNSFW avatar removed from embed` : ""}`
		);

		interaction.editReply({ embeds: [banEmbed], content: null, components: [] });

		log.cmd({ cmd: "ban", msg: `Banned ${target.tag} (${target.id})` }, { guild, channel, user });
	};

	const sendError = () => {
		const banErrorEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.addField("Failed to ban", `${target.toString()} (${target.id})`)
			.setFooter("Ban failed")
			.setTimestamp();

		interaction.editReply({ embeds: [banErrorEmbed], content: null, components: [] });
	};

	const query = `Are you sure you want to ban ${target.tag} (${target.id})?`;
	await confirm(interaction, query)
		.then(() => guild.bans.create(target.id, { days, reason }).catch(sendError).then(sendBanEmbed))
		.catch(() => null);
}
