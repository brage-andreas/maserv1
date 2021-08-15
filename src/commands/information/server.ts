import type { GuildChannel, TextChannel, ThreadChannel, VoiceChannel } from "discord.js";
import { Collection, MessageEmbed } from "discord.js";

import type { CmdInteraction } from "../../resources/definitions.js";
import { parseDate } from "../../util/automaton.js";

export const data = {
	name: "server",
	description: "Sends information about this server"
};

export async function run(interaction: CmdInteraction) {
	const { guild, client } = interaction;

	await interaction.deferReply();

	if (!guild || !guild.available) return interaction.editReply({ content: "Hmm. Noe gikk galt." });

	await guild.members.fetch();
	const { createdTimestamp, channels, name, description, id, memberCount, roles } = guild;
	const owner = await guild.fetchOwner();

	const made = parseDate(createdTimestamp);

	const oldestChannel = (channels: Collection<string, GuildChannel | ThreadChannel>) => {
		let nonThreadChannels = channels.filter((ch) => !ch.isThread()) as Collection<string, GuildChannel>;
		return nonThreadChannels.sort((a, b) => a.createdTimestamp - b.createdTimestamp).first();
	};

	const textChs = channels.cache.filter((c) => c.type === "GUILD_TEXT") as Collection<string, TextChannel>;
	const voiceChs = channels.cache.filter((c) => c.type === "GUILD_VOICE") as Collection<string, VoiceChannel>;

	const oldestTextChannel = oldestChannel(textChs);
	const oldestVoiceChannel = oldestChannel(voiceChs);

	const oldTextString = oldestTextChannel ? `\nOldest text channel is ${oldestTextChannel}` : "";
	const oldVoiceString = oldestVoiceChannel ? `\nOldest voice channel is ${oldestVoiceChannel}` : "";

	const infoEmbed = new MessageEmbed()
		.setColor(`#${client.colours.yellow}`)
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
			`**${textChs.size}** text channels and **${voiceChs.size}** voice channels\n${oldTextString}${oldVoiceString}`
		)
		.addField("Roles", `${roles.cache.size - 1} custom roles`)
		.setTimestamp();

	interaction.editReply({ embeds: [infoEmbed] });

	interaction.util.log(`Used on guild ${guild.name} (${guild.id})`);
}
