import { ApplicationCommandOptionType } from "discord-api-types";
import { MessageEmbed } from "discord.js";

import type { CmdInteraction } from "../../resources/definitions.js";
import { parseDate } from "../../util/automaton.js";
import { USER_STATUS } from "../../constants.js";
import { getNick } from "../../resources/psql/schemas/nicks.js";

export const data = {
	name: "user",
	description: "Sends information about a user",
	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "What user to send information about"
		}
	]
};

export async function run(interaction: CmdInteraction) {
	const { client, guild } = interaction;
	const [online, idle, dnd, offline] = client.mojis("online", "idle", "dnd", "offline");
	const emojis: { [index: string]: string | undefined } = { online, idle, dnd, offline };

	await interaction.deferReply();

	const getMember = async (raw: string | undefined) => {
		let member = interaction.member;

		if (!raw) return member;

		let fetchedMember = await guild.members.fetch({ user: raw, withPresences: true });
		return fetchedMember ?? member;
	};

	const rawUser = interaction.options.getUser("user");
	const member = await getMember(rawUser?.id);
	const user = member.user;

	const rawStatus = member.presence ? member.presence.status : "offline";

	const roles = member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.toString());
	const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
	const status = `${emojis[rawStatus]} ${USER_STATUS[rawStatus]}`;
	const came = parseDate(member.joinedTimestamp);
	const made = parseDate(user.createdTimestamp);
	const colour = ["#000000", "#ffffff"].includes(member.displayHexColor) ? "RANDOM" : member.displayHexColor;

	const nicks = await getNick(guild.id, user.id, member.displayName);

	const infoEmbed = new MessageEmbed()
		.setColor(colour)
		.setThumbnail(avatar)
		.setTitle(member.displayName)
		.addField("Tag", `${user.tag}`, true)
		.addField("Avatar", `[Link](${avatar})`, true)
		.addField("ID", `\`${user.id}\``);

	if (made) infoEmbed.addField("Account made", made, true);
	if (came) infoEmbed.addField(`Joined ${guild.name}`, came, true);

	infoEmbed.addField("Status", `${status}`).setTimestamp();

	if (roles.length) infoEmbed.addField("Roles", roles.join(", "));
	if (nicks && nicks?.length > 1) infoEmbed.addField("Past names", `"${nicks.reverse().slice(1, 6).join('"\n"')}"`);
	if (guild.ownerId === user.id) infoEmbed.setDescription(`👑 Server owner`);

	interaction.editReply({ embeds: [infoEmbed] });

	interaction.util.log(`Used on ${user.tag} (${user.id})`);
}
