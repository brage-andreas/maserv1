import { ApplicationCommandData, Collection, CommandInteraction, Message } from "discord.js";
import chalk from "chalk";

import { DaClient } from "../../resources/definitions.js";
import { botLog } from "../../resources/automaton.js";
import { fCols } from "../../resources/colours.js";

const { fGreen } = fCols;

const data: ApplicationCommandData = {
    name: "ping",
    description: "Sender ping",
    options: [
        {
            name: "full",
            type: "BOOLEAN",
            description: "Sender mer info enn vanlig"
        }
    ]
}

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, unknown>) {
    interaction.reply("...");

    const reply = await interaction.fetchReply() as Message;
    if (!reply) return interaction.editReply("Noe gikk galt.");

    const full = args.get("full");

    const heartbeat = client.ws.ping;
    const absPing = reply.createdTimestamp-interaction.createdTimestamp;
    const ping = absPing-heartbeat<0 ? absPing-heartbeat*-1 : absPing-heartbeat;
    
    if (full) {
        interaction.editReply(`Ping/absolutt: \`${ping}/${absPing} ms\`\nWS heartbeat: \`${heartbeat} ms\``);
    }
    
    else {
        const [str1, str2, str3] = client.mojis("strength1", "strength2", "strength3");
        const emoji = ping > 300 ? str1 : ping > 75 ? str2 : str3;

        interaction.editReply(`Ping: ${emoji} ${ping} ms`);
    }

    botLog(chalk `{${fGreen} PING}`);
};
