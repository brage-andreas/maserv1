import chalk from "chalk";
import { Collection, CommandInteraction, MessageEmbed } from "discord.js";

import { botLog } from "../../resources/automaton.js";
import { ArgsInterface, DaClient } from "../../resources/definitions.js";
import { cols as colours } from "../../resources/colours.js";

const data = {
    name: "help",
    description: "Sender ræl om kommandoer",
    options: [
        {
            name: "kommando",
            type: "STRING",
            description: "Sender mer ræl om én kommando"
        }
    ]
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, ArgsInterface>) {
    const { fGreen } = client.formattedColours;
    const { guild, user, channel } = interaction;
    const targetCmd = args.get("kommando");

    const typeTable: any = { // err on 49 if not type any
        "STRING": "string",
        "INTEGER": "tall",
        "BOOLEAN": "sant/usant",
        "USER": "bruker (@/ID)",
        "CHANNEL": "kanal (@/ID)",
        "ROLE": "rolle (@/ID)",
        "MENTIONABLE": "@/ID",
    }

    const [double_right_g, double_right_y] = client.mojis("double_right_g", "double_right_y");

    interaction.defer();

    if (targetCmd) {
        const cmd = client.commands.get(targetCmd as string);
        if (!cmd) return interaction.reply({ content: `Finner ikke kommandoen i ${guild?.name}`, allowedMentions: { repliedUser: false }, ephemeral: true })

        const commandData = cmd.default;
        const optionsMap = commandData.options?.map(opt => opt.required ? opt.name : `<${opt.name}>`).join(", ");

        const oneCmdEmbed = new MessageEmbed()
        .setTitle(`**${commandData.name.toUpperCase()}** (${guild})`)
        .setColor(colours.yellow)
        .setDescription(`${commandData.description}\n\`/${commandData.name.toLowerCase()} ${optionsMap}\``);
        
        commandData.options?.forEach(option => {
            const title: string = option.required ? `${double_right_g} ${option.name}` : `${double_right_y} <${option.name}>`;
            const content: string = `${option.description}\n*${typeTable[option.type]}*`;

            oneCmdEmbed.addField(title, content);
        });

        interaction.editReply({ embeds: [oneCmdEmbed] });
        botLog(chalk `{${fGreen} HELP} {grey > Sent info about} ${targetCmd}`,
            { guildName: guild?.name, authorName: user.tag, authorID: user.id, channelName: channel.type === "text" ? channel.name : "" });
    }
    
    else { 
        const allCmdsEmbed = new MessageEmbed()
        .setTitle(`**Kommandoer** (${guild})`)
        .setColor(colours.yellow)
        .setAuthor(user.tag, user.displayAvatarURL());
        
        const getCategoryString = (category: string): string => {
            const knownCategoryTable: Map<string, string> = new Map(Object.entries({
                "information": "ehh #stalker much ROFL",
                "moderation" : "karen da #managre",
                "other"      : "xD YDDCD (ya do da command doe) ROFL"
            }));

            return knownCategoryTable.get(category) || category.toUpperCase()
        }

        const allCategories: Set<string> = new Set(client.commands.map(cmd => cmd.category));
        allCategories.forEach((category: string) => {
            const cmds = client.commands
                         .filter(cmd => cmd.category === category)
                         .array() // collection map has no index in loop
                         .map((cmd, i) => `\`${i+1 < 10 ? "0"+(i+1) : i+1}\` ${cmd.default.name}`);
            allCmdsEmbed.addField(getCategoryString(category), cmds.join("\n"));
        });
        
        interaction.editReply({ embeds: [allCmdsEmbed] });

        botLog(chalk `{${fGreen} HELP} {grey > Sent all commands}`,
            { guildName: guild?.name, authorName: user.tag, authorID: user.id, channelName: channel.type === "text" ? channel.name : "" });
    }
};
