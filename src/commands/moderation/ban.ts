import { ApplicationCommandData, CommandInteraction, Guild, MessageEmbed, TextChannel } from "discord.js";

import { log } from "../../resources/automaton.js";
import { Args, DaClient } from "../../resources/definitions.js";

const data: ApplicationCommandData = {
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

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user } = interaction;
	const guild = interaction.guild as Guild;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	const targetId = args.get("member") as `${bigint}`;
	const reason = args.get("reason") as string | undefined;
	const rawDays = args.get("days") ? Math.ceil(args.get("days") as number) : undefined;
	const nsfw = (args.get("nsfw") as boolean | undefined) || false;

	const days = !rawDays ? 7 : rawDays > 7 ? 7 : rawDays < 1 ? 1 : rawDays;
	const target = await client.users.fetch(targetId);

	/*await guild.bans.create(targetId, { days, reason }).catch(() => {
        const banErrorEmbed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setColor(`#${client.colours.red}`)
            .addField("Failed to ban", `${target.toString()} (\`${targetId}\`)`)
            .setFooter("Ban failed")
            .setTimestamp();

	    interaction.editReply({ embeds: [banErrorEmbed] });
    });*/

	const banEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.green}`)
		.setThumbnail(!nsfw ? target.displayAvatarURL({ size: 1024, dynamic: false }) : "")
		.addField("Succsessfully banned", `${target.toString()} (\`${targetId}\`)`)
		.setFooter("User banned")
		.setTimestamp();

	if (reason) banEmbed.addField("Reason", reason);
	banEmbed.addField("Info", `Last ${days} days of messages pruned${nsfw ? `\nNSFW avatar removed from embed` : ""}`);

	// TODO add confirmation buttons + system for them

	interaction.editReply({ embeds: [banEmbed] });

	log.cmd({ cmd: "ban", msg: `Banned ${target.tag} (${targetId})` }, { guild, channel, user });
}
