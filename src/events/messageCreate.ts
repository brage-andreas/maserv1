import { Message } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { CODEBLOCK_REGEX, TOKEN_REGEX } from "../constants.js";
import { evalCmd } from "../commands/util/eval.js";

export async function run(client: DaClient, msg: Message) {
	const { content, author, guild, channel } = msg;
	if (!client.application?.owner) await client.application?.fetch();
	const isBotOwner = () => author.id === client.application?.owner?.id;

	if (channel.type !== "GUILD_TEXT") return;
	if (TOKEN_REGEX.test(content)) return msg.delete();

	if (!guild) return;

	if (content === "?build" && isBotOwner()) {
		if (!client.user || !guild) return msg.reply("Something went wrong!");
		await client.commands.post(client.user.id, guild.id);
	}

	if (content === "?clear" && isBotOwner()) {
		guild.commands.set([]);
		msg.delete();
	}

	if (content.toLowerCase().startsWith("?eval") && isBotOwner()) {
		const user = author;
		const that = msg;

		const getCode = (content: string) => {
			const captured = content.match(CODEBLOCK_REGEX);
			let code = captured?.groups?.code;
			return code ? code : content.slice(6).trim();
		};

		const code = getCode(content);

		const { error, embeds, files } = await evalCmd(client, { code, user, that });

		if (embeds) msg.reply({ embeds, files });
		else if (error) msg.reply({ content: error });
		else msg.reply({ content: "Something went wrong" });
	}
}
