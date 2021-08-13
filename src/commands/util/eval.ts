import type { Message, User } from "discord.js";
import Discord, { MessageAttachment, MessageEmbed } from "discord.js";

import { performance } from "perf_hooks";
import ms from "ms";

import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { TOKEN_REGEX } from "../../constants.js";
import { ApplicationCommandOptionType } from "discord-api-types";

export const data = {
	name: "eval",
	description: "Runs code",
	options: [
		{
			name: "code",
			type: ApplicationCommandOptionType.String,
			description: "Code to run",
			required: true
		},
		{
			name: "reply",
			type: ApplicationCommandOptionType.Boolean,
			description: "Check true if you have custom replies"
		}
	]
};

interface evalObj {
	code: string;
	noReply?: boolean;
	user: User;
	that: Message | CmdInteraction;
}
interface evalOutput {
	error?: string;
	output?: string;
	embeds?: MessageEmbed[];
	files?: MessageAttachment[];
}

const wrap = (str: string) => `\`\`\`js\n${str}\n\`\`\``;

export async function evalCmd(client: DaClient, opt: evalObj): Promise<evalOutput> {
	const D = Discord;
	const { code, user, that } = opt; // destructure "that" for use in eval command
	const noReply = opt.noReply ?? false;

	try {
		const start = performance.now();
		const evaluatedRaw = await eval(`(async () => {\n${code}\n})()`);
		const end = performance.now();

		const type = typeof evaluatedRaw;
		const evaluated = type === "function" ? evaluatedRaw.toString() : JSON.stringify(evaluatedRaw, null, 2);

		if (TOKEN_REGEX.test(evaluated)) return { error: "Command rejected" };

		if (!noReply) {
			const constructor = evaluatedRaw?.constructor.name ?? "Nullish";
			const timeTaken = ms(Number((end - start).toFixed(3)), { long: true }).replace(".", ",");
			let files: MessageAttachment[] | undefined = [];

			const evalStr = `${timeTaken}\n${type} (${constructor})`;

			if (evaluated?.length >= 1023 - evalStr.length) {
				const buffer = Buffer.from(evaluated);
				const file = new MessageAttachment(buffer, "evaluated.js");
				files.push(file);
			}

			files = files.length ? files : undefined;

			const codeStr = wrap(code).length >= 1024 ? "Code was too long." : wrap(code);
			const response = files ? "Response was too long. Sent as an attachment." : `${wrap(evaluated)}\n${evalStr}`;

			const evaluatedEmbed = new MessageEmbed()
				.setAuthor(user.tag, user.displayAvatarURL())
				.setColor(`#${client.colours.yellow}`)
				.addField("📥 Input", codeStr)
				.addField("📤 Output", response)
				.setFooter("Succsessfully evaluated")
				.setTimestamp();

			return { embeds: [evaluatedEmbed], output: evaluated, files };
		} else return {};
	} catch (err) {
		const errEmoji = client.moji.get("err");

		err = err.length >= 1002 ? `${err.slice(998)}\n...` : `${err}`;

		const evaluatedEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.addField("📥 Input", wrap(code))
			.addField("📤 Output", `${errEmoji} Error\n${wrap(err)}`)
			.setFooter("Evaluation failed")
			.setTimestamp();

		return { embeds: [evaluatedEmbed], error: err };
	}
}

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user } = interaction;
	const that = interaction;

	await interaction.deferReply();

	if (interaction.user.id !== "196333104183508992") return interaction.editReply({ content: "Command rejected" });

	const code = interaction.options.getString("code", true);
	const noReply = interaction.options.getBoolean("reply") ?? false;

	const { error, embeds, output, files } = await evalCmd(client, { code, noReply, user, that });

	if (embeds) interaction.editReply({ embeds, files });
	else if (!noReply && error) interaction.editReply({ content: error });
	else if (!noReply) interaction.editReply({ content: "Something wen't wrong" });

	const errMsg = `Error: ${error}`;
	const outputMsg = `Output: ${output ?? "No output"}`;
	interaction.util.log(error ? errMsg : outputMsg, error ? true : false);
}
