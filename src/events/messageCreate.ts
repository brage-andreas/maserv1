import { ApplicationCommandData, Message } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { CODEBLOCK_REGEX, TOKEN_REGEX } from "../resources/constants.js";
import { log } from "../resources/automaton.js";

export async function run(client: DaClient, msg: Message) {
	const { content, author, guild, channel } = msg;
	const isBotOwner = (): boolean => author.id === client.application?.owner?.id;

	if (channel.type !== "GUILD_TEXT") return;

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

	if (content.toLowerCase().startsWith("?eval ") && isBotOwner()) {
		const getCode = (content: string) => {
			const captured = content.match(CODEBLOCK_REGEX);
			let code = captured?.groups?.code;

			return code ? code : content.slice(6).trim();
		};

		const code = getCode(content);

		try {
			const evaluated = await eval(`(async () => { ${code} })()`);
			msg.reply(`Output: \`\`\`js\n${evaluated}\`\`\``);

			log.cmd({ cmd: "eval", msg: `Output: "${evaluated}"` }, { guild, channel, user: author });
		} catch (err) {
			const errEmoji = client.moji.get("err");
			msg.reply(`${errEmoji} Error: \`\`\`js\n${err}\n\`\`\``);

			log.cmd({ cmd: "eval", msg: `Error: "${err}"` }, { guild, channel, user: author }, true);
		}
	}

	/*
        msg.reply("iolbanan");
        channel.send({ content: "iolbanan", allowedMentions: { repliedUser: false }, reply: { messageReference: msg.id } });
    */
}
