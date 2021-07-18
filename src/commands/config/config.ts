import {
	ApplicationCommandData,
	Collection,
	CommandInteraction,
	Guild,
	GuildChannel,
	MessageEmbed,
	Role,
	TextChannel,
	ThreadChannel
} from "discord.js";

import { CONFIG_METHOD_CHOICES, CONFIG_OPTION_CHOICES, CONFIG_OPTION_INFO, ID_REGEX } from "../../constants.js";
import { removeValue, setValue, viewConfig, viewValue } from "../../resources/psql/config/config.js";
import { Args, DaClient } from "../../resources/definitions.js";
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

export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { user } = interaction;
	const channel = interaction.channel as TextChannel;
	const guild = interaction.guild as Guild;

	const getIdFromValue = (option: string | undefined) => {
		const value = args.get("value") as string | undefined;
		if (!value || !option) return;

		const type = CONFIG_OPTION_INFO[option].type;
		const regexp = CONFIG_OPTION_INFO[option].reg;

		type Stupid = Collection<string, { name: string; id: string }> | null;
		const base: Stupid = type === "ROLE" ? guild.roles.cache : type === "CHANNEL" ? guild.channels.cache : null;
		if (!base) return "STOP";

		if (ID_REGEX.test(value) || regexp.test(value)) {
			const id = base.get(value.replace(/\D+/g, ""))?.id;

			if (!id) {
				interaction.reply({
					content: `I cannot find a ${type.toLowerCase()} with the ID your provided`,
					ephemeral: true
				});
				return "STOP";
			}

			return id;
		} else {
			const fn = (e: { name: string }) => e.name.toLowerCase() === value.toLowerCase();
			const id = base.find(fn)?.id;

			if (!id) {
				interaction.reply({
					content: `I cannot find a ${type.toLowerCase()} with the name your provided`,
					ephemeral: true
				});
				return "STOP";
			}

			return id;
		}
	};

	const method = args.get("method") as string;
	const option = args.get("option") as string | undefined;
	const value = getIdFromValue(option);

	if (value === "STOP") return;

	await interaction.defer();

	const getOptionName = (valueName: string) =>
		CONFIG_OPTION_CHOICES.find((opt) => opt.value === valueName)?.name || option;

	const getNameFromID = (id: `${bigint}`) =>
		guild.channels.cache.get(id)?.toString() || guild.roles.cache.get(id)?.toString() || "unknown";

	const optionName = option ? getOptionName(option) : null;

	const checklist = client.moji.get("checklist");
	const tools = client.moji.get("apparatus");
	const gear = client.moji.get("gears");
	const err = client.moji.get("err");

	const configEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.yellow}`)
		.setTimestamp();

	const setOption = async () => {
		if (!option || !optionName || !value) return interaction.editReply(`${err} Something went wrong`);

		await setValue(option, value, guild.id);

		let nameStr = `${getNameFromID(value as `${bigint}`)} (${value})`;

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
