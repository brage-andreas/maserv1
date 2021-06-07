import { Collection, CommandInteraction, Message, TextChannel } from "discord.js";
import chalk from "chalk";

import { DaClient } from "../resources/definitions.js";
import { fCols } from "../resources/colours.js";
import { botLog } from "../resources/automaton.js"

const { fGreen } = fCols;

const data = {
    name: "ping",
    description: "Sender pingen til botten",
    options: [
        {
            name: "full",
            type: "BOOLEAN",
            description: "Om du vil ha extra mye ræl"
        }
    ]
}

export default data;
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, any>) {
    const { user, guild } = interaction;
    const channel = interaction.channel as TextChannel;

    const all = args.get("full");

    await interaction.reply("...");

    await interaction.fetchReply().then((replyMsg) => {
        const msg = replyMsg as Message;

        const heartbeat = client.ws.ping;
        const absPing   = msg.createdTimestamp-interaction.createdTimestamp;
        const ping      = absPing-heartbeat<0 ? absPing-heartbeat*-1 : absPing-heartbeat;
        //const emoji     = ping > 300 ? strength1 : ping > 75 ? strength2 : strength3;

        if (all) interaction.editReply(`Ping/absolutt: \`${ping}/${absPing} ms\`\nWS heartbeat: \`${heartbeat} ms\``);
        else     interaction.editReply(`Ping: ${ping} ms`);
    });

    botLog(chalk `{${fGreen} PING}`, { authorID: user.id, authorName: user.tag, channelName: channel.name, guildName: guild?.name });
};