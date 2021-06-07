import { ApplicationCommandData, Collection, CommandInteraction, DiscordAPIError, MessageEmbed } from "discord.js";
import { cols as colours } from "../resources/colours.js";
import { CommandInterface, DaClient } from "../resources/definitions.js";

const data = {
    name: "help",
    description: "sender ræl om kommandoer",
    options: [
        {
            name: "kommando",
            type: "STRING",
            description: "sender enda midre ræl"
        }
    ]
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, any>) {
    const { guild, user } = interaction;
    const targetCmd: string | undefined = args.get("kommando");

    interaction.defer();

    if (targetCmd) {
        const cmd: CommandInterface | undefined = client.commands.get(targetCmd);
        if (!cmd) return interaction.reply(`Finner ikke kommandoen i ${guild?.name}`, { allowedMentions: { repliedUser: false }, ephemeral: true })

        const commandData: ApplicationCommandData = cmd.default;

        const printArray: string[] = [`/${commandData.name}`];
        const optionsInfo: string[] = [];
        
        commandData.options?.forEach(option => {
            printArray.push(option.required ? option.name : `<${option.name}>`);

            const optionStr: string = `• ${option.required ? "R " : ""}${option.name} (${option.type.toString().toLowerCase()}) - ${option.description}`;
            optionsInfo.push(optionStr);
        });

        const oneCmdEmbed = new MessageEmbed()
        .setTitle(`**${targetCmd.toUpperCase()}** (${guild})`)
        .setColor(colours.yellow)
        .setDescription(`\`${printArray.join(" ")}\``)
        .setAuthor(user.tag, user.displayAvatarURL());

        if (optionsInfo.length) oneCmdEmbed.addField("Options", optionsInfo.join("\n"));

        interaction.editReply({ embeds: [oneCmdEmbed] });
    }
    
    else {
        const cmds = client.commands.array().map((cmd, i) => `\`${i+1 < 10 ? "0"+(i+1) : i+1}\` ${cmd.default.name}`);

        const allCmdsEmbed = new MessageEmbed()
        .setTitle(`**Kommandoer** (${guild})`)
        .setColor(colours.green)
        .setDescription(`${cmds.join("\n")}`)
        .setAuthor(user.tag, user.displayAvatarURL());

        interaction.editReply({ embeds: [allCmdsEmbed] });
    }
};

/*

    /NAME OPTIONS1 OPTIONS2
    * R Options 1 (TYPE) - DESCRIPTION
    * Options 2 (TYPE) - DESCRIPTION

Collection(3) [Map] {
  'help' => [Module: null prototype] {
    default: {
      name: 'help',
      description: 'sender ræl om kommandoer',
      options: [Array]
    },
    run: [AsyncFunction: run]
  },
  'say' => [Module: null prototype] {
    default: { name: 'say', description: 'halalutrrh', options: [Array] },
    run: [AsyncFunction: run]
  },
  'prune' => [Module: null prototype] {
    default: {
      name: 'prune',
      description: 'slett halalutrrh',
      options: [Array]
    },
    run: [AsyncFunction: run]
  }
}
*/
