import { ApplicationCommandData, GuildChannel, GuildMember, MessageEmbed, Role, TextChannel, User } from "discord.js";

import { CONFIG_METHOD_CHOICES, CONFIG_OPTION_CHOICES, ID_REGEX } from "../../constants.js";
import { removeValue, setValue, viewConfig, viewValue } from "../../resources/psql/schemas/config.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

export const data: ApplicationCommandData = {
	name: "config",
	description: "Changes the various options for this server",
	options: [
		{
			name: "method",
			type: "STRING",
			description: "What method to use",
			choices: CONFIG_METHOD_CHOICES,
			required: true
		},
		{
			name: "option",
			type: "STRING",
			description: "What option to administer",
			choices: CONFIG_OPTION_CHOICES
		},
		{
			name: "value",
			type: "STRING",
			description: "What to update the setting to. Takes IDs, mentions, and names."
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { user, channel, guild } = interaction;

	const getIdFromValue = (option: string | null) => {
		const valueOpt = interaction.options.getString("value");
		if (!valueOpt || !option) return null;

		const baseOpt = interaction.options;
		let value =
			(baseOpt.getMentionable(option) as GuildMember | User | Role | null) ??
			(baseOpt.getChannel(option) as GuildChannel | null);

		if (value) return value;

		const role = guild.roles.cache.find((role) => role.name === valueOpt);
		const channel = guild.channels.cache.find((channel) => channel.name === valueOpt);

		return role ?? channel?.type === "GUILD_TEXT" ? (channel as TextChannel) : null ?? null;
	};

	const method = interaction.options.getString("method", true);
	const option = interaction.options.getString("option");
	const value = getIdFromValue(option);

	await interaction.defer();

	const getOptionName = (valueName: string) =>
		CONFIG_OPTION_CHOICES.find((opt) => opt.value === valueName)?.name || option;

	const getNameFromID = (id: `${bigint}`) =>
		guild.channels.cache.get(id)?.toString() || guild.roles.cache.get(id)?.toString() || "unknown";

	const optionName = option ? getOptionName(option) : null;

	const [checklist, tools, gear, err] = client.mojis("checklist", "apparatus", "gears", "err");

	const configEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.yellow}`)
		.setTimestamp();

	const setOption = async () => {
		if (!option || !optionName || !value) return interaction.editReply(`${err} Something went wrong`);

		await setValue(option, value.id, guild.id);

		let nameStr = `${value} (${value.id})`;

		configEmbed.addField(`${tools} ${optionName}`, `Set value to ${nameStr}`);
		interaction.editReply({ embeds: [configEmbed] });
	};

	const viewAllOptions = async () => {
		const response = await viewConfig(guild.id);

		configEmbed.setTitle(`${gear} CONFIG`);
		let descStr = "";

		Object.entries(response).forEach(([key, value]) => {
			const strKey = getOptionName(key);
			const strValue = getNameFromID(value as `${bigint}`);

			if (!strKey) return;
			descStr += `${strKey}:\n${strValue !== "unknown" ? strValue : "Not set/unknown"}\n\n`;
		});

		configEmbed.setDescription(descStr);

		interaction.editReply({ embeds: [configEmbed] });
	};

	const viewOption = async (option: string, optionName: string) => {
		const setting = await viewValue(option, guild.id);
		const settingStr = setting
			? ID_REGEX.test(setting)
				? `Is set to ${getNameFromID(setting)} (${setting})`
				: ` Is set to ${setting}`
			: "Not set";

		configEmbed.addField(`${checklist} ${optionName}`, settingStr);
		interaction.editReply({ embeds: [configEmbed] });
	};

	const removeOption = async () => {
		if (!option || !optionName) return interaction.reply("Something went wrong");

		await removeValue(option, guild.id);

		configEmbed.addField(`${tools} ${optionName}`, `Removed value`);
		interaction.editReply({ embeds: [configEmbed] });
	};

	switch (method) {
		case "set":
			await setOption();
			break;

		case "view":
			if (!option || !optionName) viewAllOptions();
			else viewOption(option, optionName);
			break;

		case "remove":
			removeOption();
			break;
	}

	const msgNullStr = `${option ? ` on option ${option}` : ""}${value ? ` with value "${value}"` : ""}`;
	log.cmd({ cmd: "config", msg: `Method ${method}${msgNullStr}` }, { guild, channel, user });
}
