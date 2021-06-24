import { Collection, CommandInteraction, TextChannel } from "discord.js";
import chalk from "chalk";

import { botLog } from "../../resources/automaton.js";
import { fCols } from "../../resources/colours.js";
import { DaClient } from "../../resources/definitions.js";

const { fGreen } = fCols;

const data = {
    name: "say",
    description: "halalutrrh",
    options: [
        {
            name: "input",
            type: "STRING",
            description: "hva jeg skal sende #iol",
            required: true
        }
    ]
}

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, unknown>) {
    const { user, channel, guild } = interaction;
    const txtChannel: TextChannel | null = channel ? channel as TextChannel : null;

    await interaction.reply(args.get("input") as string);

    botLog(chalk `{${fGreen} SAY} {grey > "}${args.get("input")}{grey "}`,
    { authorName: user.tag, authorID: user.id, channelName: txtChannel?.name, guildName: guild?.name });
};