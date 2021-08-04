import { ApplicationCommandData, Message, MessageEmbed, User } from "discord.js";
import { performance } from "perf_hooks";
import ms from "ms";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";
import { TOKEN_REGEX } from "../../constants.js";

export const data: ApplicationCommandData = {
	name: "eval",
	description: "Runs code",
	options: [
		{
			name: "code",
			type: "STRING",
			description: "Code to run",
			required: true
		},
		{
			name: "reply",
			type: "BOOLEAN",
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
	error?: string | undefined;
	output?: string | undefined;
	embed?: MessageEmbed | undefined;
}

const wrap = (str: string) => `\`\`\`js\n${str}\n\`\`\``;

export async function evalCmd(client: DaClient, opt: evalObj): Promise<evalOutput> {
	const { code, user, that } = opt;
	const noReply = opt.noReply ?? false;

	try {
		const start = performance.now();
		const evaluatedRaw = await eval(`(async () => { ${code} })()`);
		const end = performance.now();

		const evaluated = JSON.stringify(evaluatedRaw, null, 2);

		if (TOKEN_REGEX.test(evaluated)) return { error: "Command rejected" };

		if (!noReply) {
			const type = typeof evaluatedRaw;
			const constructor = evaluatedRaw?.constructor.name ?? "Nullish";
			const timeTaken = ms(Number((end - start).toFixed(3)), { long: true }).replace(".", ",");

			const evalStr = `${wrap(evaluated)}\n${timeTaken}\n${type} (${constructor})`;

			const evaluatedEmbed = new MessageEmbed()
				.setAuthor(user.tag, user.displayAvatarURL())
				.setColor(`#${client.colours.yellow}`)
				.addField("📥 Input", wrap(code))
				.addField("📤 Output", evalStr)
				.setFooter("Succsessfully evaluated")
				.setTimestamp();

			return { embed: evaluatedEmbed, output: evaluated };
		} else return {};
	} catch (err) {
		const errEmoji = client.moji.get("err");

		const evaluatedEmbed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(`#${client.colours.red}`)
			.addField("📥 Input", wrap(code))
			.addField("📤 Output", `${errEmoji} Error\n${wrap(err)}`)
			.setFooter("Evaluation failed")
			.setTimestamp();

		return { embed: evaluatedEmbed, output: err };
	}
}

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, guild, channel } = interaction;
	const that = interaction;

	await interaction.defer();

	if (interaction.user.id !== "196333104183508992") return interaction.editReply({ content: "Command rejected" });

	const code = interaction.options.getString("code", true);
	const noReply = interaction.options.getBoolean("reply") ?? false;

	const { error, embed, output } = await evalCmd(client, { code, noReply, user, that });

	if (embed) interaction.editReply({ embeds: [embed] });
	else interaction.editReply({ content: "Something went wrong" });

	if (error) log.cmd({ cmd: "eval", msg: `Error: "${error}"` }, { guild, channel, user }, true);
	else log.cmd({ cmd: "eval", msg: `Output: ${output ? `"${output}"` : "No output"}` }, { guild, channel, user });
}
