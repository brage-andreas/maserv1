import { ApplicationCommandData, MessageEmbed } from "discord.js";

import { CATEGORIES, CMD_TYPES } from "../../constants.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
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

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { guild, user, member } = interaction;
	const [greenArrow, yellowArrow] = client.mojis("doubletick_g", "doubletick_y");

	await interaction.deferReply();

	const targetCmd = interaction.options.getString("command");

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
			.setColor(`#${client.colours.yellow}`)
			.setDescription(`${commandData.description}\n\`/${commandData.name.toLowerCase()} ${optionsMap}\``);

		commandData.options?.forEach((option) => {
			const title: string = option.required ? `${greenArrow} ${option.name}` : `${yellowArrow} <${option.name}>`;
			const content: string = `${option.description}\n*${CMD_TYPES[option.type]}*`;

			oneCmdEmbed.addField(title, content);
		});

		interaction.editReply({ embeds: [oneCmdEmbed] });

		interaction.log(`Sent info about ${targetCmd}`);
	} else {
		const allCmdsEmbed = new MessageEmbed()
			.setTitle(`Commands`)
			.setColor(`#${client.colours.yellow}`)
			.setAuthor(member.displayName || user.tag, user.displayAvatarURL());

		const allCategories = client.commands.categories;
		allCategories.forEach((category: string) => {
			const cmds = client.commands.withCategory(category);

			allCmdsEmbed.addField(`${yellowArrow} ${CATEGORIES[category] || category}`, cmds.join(", "));
		});

		interaction.editReply({ embeds: [allCmdsEmbed] });

		interaction.log("Sent all commands");
	}
}
