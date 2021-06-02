import { ApplicationCommandData, Message } from "discord.js";
import { DaClient } from "../resources/definitions";

export async function run(client: DaClient, msg: Message) {
    const { content, author, guild, channel } = msg;
    const botOwner = (query: string): boolean => content.toLowerCase() === query && author.id === client.application?.owner?.id;
    
    if (!client.application?.owner) await client.application?.fetch();

	if (botOwner("?deploy")) {
        if (!guild) return;
		const data: ApplicationCommandData[] = client.commands.map(cmd => cmd.default);
		await guild.commands.set(data);
    }
    
    if (botOwner("?clear")) {
        if (!guild) return;
        await guild.commands.set([]);
    }

    if (content === "lol") {
        channel.send("iolbanan", { allowedMentions: { repliedUser: false }, reply: { messageReference: msg.id } })
    }
}