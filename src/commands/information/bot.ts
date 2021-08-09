import { ApplicationCommandData, MessageEmbed } from "discord.js";
import ms from "ms";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { PLATFORMS } from "../../constants.js";

export const data: ApplicationCommandData = {
	name: "bot",
	description: "Sends information about me"
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const formatBytes = (number: number) => number.toFixed(2).replace(".", ",");

	const { heapUsed, heapTotal } = process.memoryUsage();
	const heapStr = `${formatBytes(heapUsed / 10 ** 6)}/${formatBytes(heapTotal / 10 ** 6)} MB`;

	const platform = PLATFORMS[process.platform] || process.platform;
	const uptime = process.uptime();

	const guilds = client.guilds.cache.size;
	const channels = client.channels.cache.filter((ch) => !ch.isThread()).size;
	const roughUserCount = client.guilds.cache.reduce((count, guild) => count + guild.memberCount, 0);

	const infoEmbed = new MessageEmbed()
		.setAuthor(`${interaction.guild?.me?.displayName.toUpperCase() || "My info"}`)
		.setThumbnail(`${client.user?.displayAvatarURL()}` || "")
		.setColor(`#${client.colours.yellow}`)
		.addField("Platform", platform)
		.addField("RAM", heapStr)
		.addField("Uptime", ms(uptime * 1000, { long: true }))
		.addField("Servers and channels", `${guilds} servers, and ${channels} channels`)
		.addField("Users", `${roughUserCount} users`);

	interaction.reply({ embeds: [infoEmbed] });

	interaction.util.log();
}
