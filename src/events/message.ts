import { ApplicationCommandData, Message, MessageEmbed } from "discord.js";
import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, msg: Message) {
    const { content, author, guild/*, channel*/ } = msg;
    const isBotOwner = (): boolean => author.id === client.application?.owner?.id;
    
    if (!client.application?.owner) await client.application?.fetch();

	if (content === "?build" && isBotOwner()) {
        if (!guild) return;

        msg.delete();
		const data: ApplicationCommandData[] = client.commands.map(cmd => cmd.data);
		await guild.commands.set(data);
    }
    
    if (content === "?clear" && isBotOwner()) {
        if (!guild) return;

        msg.delete();
        await guild.commands.set([]);
    }

    /*if (content === "lol") {
        msg.reply("iolbanan");
        channel.send({ content: "iolbanan", allowedMentions: { repliedUser: false }, reply: { messageReference: msg.id } });
    }*/
}