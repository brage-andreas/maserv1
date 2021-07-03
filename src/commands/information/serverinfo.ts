import {
	ApplicationCommandData,
	Collection,
	CommandInteraction,
	GuildChannel,
	MessageEmbed,
	TextChannel
} from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log, parseDate } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "serverinfo",
	description: "Sends information about this server"
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild, user } = interaction;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	if (!guild || !guild.available) return interaction.editReply({ content: "Hmm. Noe gikk galt." });

	await guild.members.fetch();
	const { createdTimestamp, channels, name, description, id, memberCount, roles } = guild;
	const owner = await guild.fetchOwner();

	const made = parseDate(createdTimestamp);

	const oldestChannel = (chl: Collection<`${bigint}`, GuildChannel>) =>
		chl.sort((a: GuildChannel, b: GuildChannel) => a.createdTimestamp - b.createdTimestamp).first();

	const textChannels = channels.cache.filter((c) => c.isText());
	const voiceChannels = channels.cache.filter((c) => c.type === "voice");

	const oldestTextChannel = oldestChannel(textChannels);
	const oldestVoiceChannel = oldestChannel(voiceChannels);

	const oldTextString = oldestTextChannel ? `\nOldest text channel is ${oldestTextChannel}` : ``;
	const oldVoiceString = oldestVoiceChannel ? `\nOldest voice channel is ${oldestVoiceChannel}` : ``;

	const infoEmbed = new MessageEmbed()
		.setColor(client.colours.yellow)
		.setThumbnail(guild.iconURL({ format: "png", dynamic: true, size: 1024 }) || "")
		.setTitle(name)
		.addField("Description", description ? description : "This server has no description")
		.addField("ID", `\`${id}\``, true)
		.addField("Icon", `[Link](${guild.iconURL({ format: "png", dynamic: true, size: 4096 })})`, true);

	if (made) infoEmbed.addField("Server created", made);

	infoEmbed
		.addField("Owner", `${owner} (${owner.id})`, true)
		.addField("Members", `${memberCount}`)
		.addField(
			"Channels",
			`${textChannels.size} text channels and ${voiceChannels.size} voice channels\n${oldTextString}${oldVoiceString}`
		)
		.addField("Roles", `${roles.cache.size - 1} custom roles`)
		.setTimestamp();

	interaction.editReply({ embeds: [infoEmbed] });

	log.cmd({ cmd: "serverinfo", msg: `Used on guild ${guild.name} (${guild.id})` }, { channel, guild, user });
}
