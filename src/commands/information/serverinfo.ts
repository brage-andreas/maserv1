import { ApplicationCommandData, Collection, CommandInteraction, GuildChannel, MessageEmbed } from "discord.js";
import chalk from "chalk";

import { DaClient } from "../../resources/definitions.js";
import { botLog, parseDate } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
    name: "serverinfo",
    description: "Sender en haug med ræl om inn server"
}

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, unknown>) {
    const { fGreen } = client.formattedColours;
    const { yellow } = client.colours;
    const { guild } = interaction;

    await interaction.defer();

    if (!guild || !guild.available) return interaction.editReply({ content: "Hmm. Noe gikk galt." });

    await guild.members.fetch()
    const { createdTimestamp, channels, name, description, id, memberCount, roles } = guild;
    const owner = await guild.fetchOwner();

    const made = parseDate(createdTimestamp);
    
    const oldestChannel = (chl: Collection<`${bigint}`, GuildChannel>) => chl.sort((a: GuildChannel, b:GuildChannel) => a.createdTimestamp-b.createdTimestamp).first();
    
    const textChannels = channels.cache.filter(c => c.type === "text");
    const voiceChannels = channels.cache.filter(c => c.type === "voice");
    
    const oldestTextChannel = oldestChannel(textChannels);
    const oldestVoiceChannel = oldestChannel(voiceChannels);

    const oldTextString = oldestTextChannel ? `\nEldste tekstkanal er ${oldestTextChannel}.` : ``;
    const oldVoiceString = oldestVoiceChannel ? `\nEldste voicekanal er ${oldestVoiceChannel.name}.` : ``;

    const infoEmbed = new MessageEmbed()
    .setColor(yellow)
    .setThumbnail(guild.iconURL({ format: "png", dynamic: true, size: 1024 }) || "")
    .setTitle(name)
    .addField("Beskrivelse", description ? description : "Har ingen beskrivelse.")
    .addField("ID", `\`${id}\``, true)
    .addField("Ikon", `[Link](${guild.iconURL({ format: "png", dynamic: true, size: 4096 })})`, true)
    if (made) infoEmbed.addField("Server laget", made)
    infoEmbed.addField("Eier", `${owner} (${owner.id})`, true)
    .addField("Medlemmer", `${memberCount}`)
    .addField("Kanaler", `${textChannels.size} text og ${voiceChannels.size} voice (${channels.cache.size} totalt)${oldTextString}${oldVoiceString}`)
    .addField("Roller", `${roles.cache.size-1} roller`)
    .setTimestamp();

    interaction.editReply({ embeds: [infoEmbed] });

    botLog(chalk `{${fGreen} SERVERINFO} {grey > Used on guild} ${guild.name} {grey (${guild.id})}`);
};