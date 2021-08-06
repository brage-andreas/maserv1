import { Message } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { CODEBLOCK_REGEX, TOKEN_REGEX } from "../constants.js";
import { log } from "../resources/automaton.js";
import { evalCmd } from "../commands/util/eval.js";

export async function run(client: DaClient, msg: Message) {
	const { content, author, guild, channel } = msg;
	if (!client.application?.owner) await client.application?.fetch();
	const isBotOwner = () => author.id === client.application?.owner?.id;

	if (channel.type !== "GUILD_TEXT") return;
	if (TOKEN_REGEX.test(content)) return msg.delete();

	if (!guild) return;

	if (content === "?build" && isBotOwner()) {
		const data = client.commands.map((cmd) => cmd.data);
		guild.commands.set(data);
		msg.delete();
		return;
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

		const { error, embeds, output, files } = await evalCmd(client, { code, user, that });

		if (embeds) msg.reply({ embeds, files });
		else msg.reply({ content: "Something went wrong" });

		if (error) log.cmd({ cmd: "eval", msg: `Error: "${error}"` }, { guild, channel, user }, true);
		else log.cmd({ cmd: "eval", msg: `Output: ${output ? output : "No output"}` }, { guild, channel, user });
	}
}
