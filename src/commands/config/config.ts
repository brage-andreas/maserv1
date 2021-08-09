import type { ThreadChannel, Role, GuildChannel, ApplicationCommandData } from "discord.js";
import { MessageEmbed } from "discord.js";

import { CONFIG_OPTION_CHOICES, CONFIG_OPTION_INFO, ID_REGEX } from "../../constants.js";
import { removeValue, setValue, viewConfig, viewValue } from "../../resources/psql/schemas/config.js";
import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
	name: "config",
	description: "Changes the various options for this server",
	options: [
		{
			name: "method",
			type: "STRING",
			description: "What method to use",
			choices: [
				{
					name: "set",
					value: "set"
				},
				{
					name: "view",
					value: "view"
				},
				{
					name: "remove",
					value: "remove"
				}
			],
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
	const { user, guild } = interaction;

	const getValue = async (raw: string | null) => {
		if (!raw) return null;
		const fn = (that: Role | GuildChannel | ThreadChannel) => that.name.toLowerCase() === raw.toLowerCase();

		const { type, reg } = CONFIG_OPTION_INFO[raw];

		if (type === "ROLE") {
			if (reg.test(raw) || !ID_REGEX.test(raw)) return guild.roles.cache.get(raw.replace(/\D/g, "")) ?? null;
			else return guild.roles.cache.find(fn) ?? null;
		}

		if (type === "CHANNEL") {
			if (reg.test(raw) || !ID_REGEX.test(raw)) return guild.channels.cache.get(raw.replace(/\D/g, "")) ?? null;
			else return guild.channels.cache.find(fn) ?? null;
		}

		return null;
	};

	const method = interaction.options.getString("method", true);
	const option = interaction.options.getString("option");
	const rawValue = interaction.options.getString("value");
	const value = await getValue(rawValue);

	await interaction.deferReply();

	const getOptionName = (valueName: string) =>
		CONFIG_OPTION_CHOICES.find((opt) => opt.value === valueName)?.name || option;

	const getNameFromID = (id: string) =>
		guild.channels.cache.get(id)?.toString() || guild.roles.cache.get(id)?.toString() || "unknown";

	const optionName = option ? getOptionName(option) : null;

	const [checklist, tools, gear, err] = client.mojis("checklist", "apparatus", "gears", "err");

	const configEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.yellow}`)
		.setTimestamp();

	const setOption = async () => {
		if (!option) return interaction.editReply(`${err} Something went wrong with your option`);
		if (!value)
			return interaction.editReply(`${err} Something went wrong with your value.\n"${rawValue}" didn't resolve.`);

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
			const strValue = getNameFromID(value as string);

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
	interaction.log(`Method ${method}${msgNullStr}`);
}
