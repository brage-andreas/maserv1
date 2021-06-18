import { Collection, CommandInteraction, TextChannel } from "discord.js";
import chalk from "chalk";

import { DaClient, ArgsInterface } from "../../resources/definitions.js";
import { botLog } from "../../resources/automaton.js";

const data = {
    name: "eval",
    description: "Kjører kode",
    options: [
        {
            name: "code",
            type: "STRING",
            description: "Koden å kjøre"
        }
    ]
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, ArgsInterface>) {
    const { fGreen } = client.formattedColours;
    const { user, guild } = interaction;
    const channel = interaction.channel as TextChannel;

    await interaction.defer();

    if (interaction.user.id !== "196333104183508992") return interaction.editReply({ content: "nei" });
    const code = args.get("code");

    try {
        const evaluated = await eval(`( async () => { ${code} })()`);
        interaction.editReply(`Output: \`\`\`js\n${evaluated}\`\`\``);
        botLog(chalk `{${fGreen} EVAL} {grey > Output: "}${evaluated}{grey "}`);
    }
    
    catch (err) {
        const errEmoji = client.moji.get("err");
        interaction.editReply(`${errEmoji} Error: \`\`\`js\n${err}\n\`\`\``);
        botLog(chalk `{${fGreen} EVAL} {grey > Error: "}${err}{grey "}`,
        { authorName: user.tag, authorID: user.id, channelName: channel.name, guildName: guild?.name });
    }
}   