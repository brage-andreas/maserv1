import { ApplicationCommandData, Collection, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { PLATFORMS } from "../../resources/constants.js";
import { log } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "bot",
	description: "Sender masse ræl om botten"
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user, guild } = interaction;
	const channel = interaction.channel as TextChannel;

	const { heapUsed, heapTotal } = process.memoryUsage();
	const { systemCPUTime } = process.resourceUsage();
	const platform: string = PLATFORMS[process.platform] || process.platform;
	const uptime = process.uptime();
	const guilds = client.guilds.cache.size;
	const channels = client.channels.cache.size;
	const roughUserCount = client.guilds.cache.reduce((count, guild) => count + guild.memberCount, 0);
	const heapStr = `\`${(heapUsed / 10 ** 6).toFixed(2)}\`/\`${(heapTotal / 10 ** 6).toFixed(2)}\``;

	const infoEmbed = new MessageEmbed()
		.setAuthor(`${interaction.guild?.me?.displayName.toUpperCase() || "omagawd min infof xD"}`)
		.setThumbnail(`${client.user?.displayAvatarURL()}` || "")
		.setColor(client.colours.yellow)
		.addField("Platform", `${platform}`)
		.addField("Spec", `\`${heapStr}\` MB,\nmed \`${systemCPUTime}\` μs system-CPU brukt per clockcycle`)
		.addField("Uptime", `${Math.ceil(uptime)} sekunder`)
		.addField("Servere og kanaler", `${guilds} servere og ${channels} kanaler`)
		.addField("Brukere (ca.)", `${roughUserCount} stykker`);

	interaction.reply({ embeds: [infoEmbed] });

	log.cmd({ cmd: "bot" }, { channel, guild, user });
}
