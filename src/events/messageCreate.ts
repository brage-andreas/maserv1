import { ApplicationCommandData, Message } from "discord.js";
import { DaClient } from "../resources/definitions.js";
import { TOKEN_REGEX } from "../resources/constants.js";

export async function run(client: DaClient, msg: Message) {
	const { content, author, guild } = msg;
	const isBotOwner = (): boolean => author.id === client.application?.owner?.id;

	if (TOKEN_REGEX.test(content)) return msg.delete();

	if (!client.application?.owner) await client.application?.fetch();

	if (content === "?build" && isBotOwner()) {
		if (!guild) return;

		msg.delete();
		const data: ApplicationCommandData[] = client.commands.map((cmd) => cmd.data);
		await guild.commands.set(data);
	}

	if (content === "?clear" && isBotOwner()) {
		if (!guild) return;

		msg.delete();
		await guild.commands.set([]);
	}

	/*
        msg.reply("iolbanan");
        channel.send({ content: "iolbanan", allowedMentions: { repliedUser: false }, reply: { messageReference: msg.id } });
    */
}
