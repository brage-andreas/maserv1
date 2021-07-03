import { ApplicationCommandData, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

import { CATEGORIES, CMD_TYPES } from "../../resources/constants.js";
import { Args, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "help",
	description: "Sends either a list of, or information about commands",
	options: [
		{
			name: "command",
			type: "STRING",
			description: "What command to send info about"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild, user, channel } = interaction;
	const targetCmd = args.get("command") as string;

	const [double_right_g, double_right_y] = client.mojis("double_right_g", "double_right_y");

	await interaction.defer();

	if (targetCmd) {
		const cmd = client.commands.get(targetCmd as string);
		if (!cmd)
			return interaction.editReply({
				content: `I cannot find said command ${guild ? `in ${guild.name}` : ""}`
			});

		const commandData = cmd.data;
		const optionsMap = commandData.options?.map((opt) => (opt.required ? opt.name : `<${opt.name}>`)).join(", ");

		const oneCmdEmbed = new MessageEmbed()
			.setTitle(`**${commandData.name.toUpperCase()}** (${guild})`)
			.setColor(client.colours.yellow)
			.setDescription(`${commandData.description}\n\`/${commandData.name.toLowerCase()} ${optionsMap}\``);

		commandData.options?.forEach((option) => {
			const title: string = option.required
				? `${double_right_g} ${option.name}`
				: `${double_right_y} <${option.name}>`;
			const content: string = `${option.description}\n*${CMD_TYPES[option.type]}*`;

			oneCmdEmbed.addField(title, content);
		});

		interaction.editReply({ embeds: [oneCmdEmbed] });

		log.cmd({ cmd: "help", msg: `Sent info about ${targetCmd}` }, { channel: channel as TextChannel, guild, user });
	} else {
		const allCmdsEmbed = new MessageEmbed()
			.setTitle(`Commands`)
			.setColor(client.colours.yellow)
			.setAuthor(user.tag, user.displayAvatarURL());

		const allCategories = new Set(client.commands.map((cmd) => cmd.category));
		allCategories.forEach((category: string) => {
			const cmds = client.commands
				.filter((cmd) => cmd.category === category)
				.array() // collection map has no index in loop
				.map((cmd, i) => `\`${i + 1 < 10 ? "0" + (i + 1) : i + 1}\` ${cmd.data.name}`);
			allCmdsEmbed.addField(CATEGORIES[category] || category, cmds.join("\n"));
		});

		interaction.editReply({ embeds: [allCmdsEmbed] });

		log.cmd({ cmd: "help", msg: "Sent all commands" }, { channel: channel as TextChannel, guild, user });
	}
}
