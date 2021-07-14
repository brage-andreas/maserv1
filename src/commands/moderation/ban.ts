import { ApplicationCommandData, CommandInteraction, Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";

import { log, confirm, hasPerms } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

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

export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user } = interaction;
	const guild = interaction.guild as Guild;
	const member = interaction.member as GuildMember;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	const err = client.moji.get("err");
	if (!hasPerms(["BAN_MEMBERS"], guild.me))
		return interaction.editReply(`${err || ""} I don't have sufficient permissions`);

	if (!hasPerms(["BAN_MEMBERS"], member))
		return interaction.editReply(`${err || ""} You don't have sufficient permissions`);

	const targetId = args.get("member") as `${bigint}`;
	const reason = args.get("reason") as string | undefined;
	const rawDays = args.get("days") ? Math.ceil(args.get("days") as number) : undefined;
	const nsfw = (args.get("nsfw") as boolean | undefined) || false;

	const days = !rawDays ? 7 : rawDays > 7 ? 7 : rawDays < 1 ? 1 : rawDays;
	const target = await client.users.fetch(targetId);

	const sendBanEmbed = () => {
		const banEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.green}`)
			.setThumbnail(!nsfw ? target.displayAvatarURL({ size: 1024, dynamic: false }) : "")
			.addField("Succsessfully banned", `${target.toString()} (${targetId})`)
			.setFooter("User banned")
			.setTimestamp();

		if (reason) banEmbed.addField("Reason", reason);
		banEmbed.addField(
			"Info",
			`Last ${days} days of messages pruned${nsfw ? `\nNSFW avatar removed from embed` : ""}`
		);

		interaction.editReply({ embeds: [banEmbed], content: null, components: [] });

		log.cmd({ cmd: "ban", msg: `Banned ${target.tag} (${targetId})` }, { guild, channel, user });
	};

	const sendError = () => {
		const banErrorEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.addField("Failed to ban", `${target.toString()} (\`${targetId}\`)`)
			.setFooter("Ban failed")
			.setTimestamp();

		interaction.editReply({ embeds: [banErrorEmbed], content: null, components: [] });
	};

	const query = `Are you sure you want to ban ${target.tag} (${targetId})?`;
	await confirm(interaction, query)
		.then(() => guild.bans.create(targetId, { days, reason }).catch(sendError).then(sendBanEmbed))
		.catch(() => null);
}
