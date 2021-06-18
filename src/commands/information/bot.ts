import { Collection, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import chalk from "chalk";

import { DaClient, ArgsInterface } from "../../resources/definitions.js";
import { botLog } from "../../resources/automaton.js";

const data = {
    name: "bot",
    description: "Sender masse ræl om botten"
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, ArgsInterface>) {
    const { fGreen } = client.formattedColours;
    const { user, guild } = interaction;
    const channel = interaction.channel as TextChannel;

    const platformTable: {[index: string]: string} = {
        "aix": "AIX",
        "darwin": "Darwin",
        "freebsd": "FreeBSD",
        "linux": "Linux",
        "openbsd": "OpenBSD",
        "sunos": "SunOS",
        "win32": "Windows",
        "android": "Android"
    }

    const { heapUsed, heapTotal } = process.memoryUsage();
    const platform: string = platformTable[process.platform] || process.platform;
    const uptime = process.uptime();
    const { systemCPUTime } = process.resourceUsage();
    const guilds = client.guilds.cache.size;
    const channels = client.channels.cache.size;
    const roughUserCount = client.guilds.cache.reduce((count, guild) => count + guild.memberCount, 0);

    const infoEmbed = new MessageEmbed()
    .setTitle(`${interaction.guild?.me?.displayName.toUpperCase() || "omagawd min infof xD"}`)
    .setURL("https://youtube.com")
    .setColor(client.colours.yellow)
    .addField("Platform", `${platform}`)
    .addField("Spec", `\`${(heapUsed/10**6).toFixed(2)}\`/\`${(heapTotal/10**6).toFixed(2)}\` MB,\nmed \`${systemCPUTime}\` μs system/CPU brukt per clockcycle`)
    .addField("Uptime", `${Math.ceil(uptime)} sekunder`)
    .addField("Servere og kanaler", `${guilds} servere og ${channels} kanaler`)
    .addField("Brukere (ca.)", `${roughUserCount} stykker`);

    interaction.reply({ embeds: [infoEmbed] });

    botLog(chalk `{${fGreen} BOT} {grey > Text}`,
    { authorName: user.tag, authorID: user.id, channelName: channel.name, guildName: guild?.name });
};