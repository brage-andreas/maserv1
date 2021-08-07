import { ApplicationCommandData, MessageEmbed, PresenceStatus } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { log, parseDate } from "../../resources/automaton.js";
import { USER_STATUS } from "../../constants.js";
import { getNick } from "../../resources/psql/schemas/nicks.js";

export const data: ApplicationCommandData = {
	name: "user",
	description: "Sends information about a user",
	options: [
		{
			name: "user",
			type: "USER",
			description: "What user to send information about"
		}
	]
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	const { guild, channel } = interaction;
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

	if (!member.presence) return interaction.editReply({ content: "Hmm. Something went wrong" });

	const roles = member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.toString());
	const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
	const status = `${emojis[member.presence.status]} ${USER_STATUS[member.presence.status]}`;
	const came = parseDate(member.joinedTimestamp);
	const made = parseDate(user.createdTimestamp);
	const colour = ["#000000", "#ffffff"].includes(member.displayHexColor) ? "RANDOM" : member.displayHexColor;

	const nicks = await getNick(user.id, guild.id);

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

	log.cmd({ cmd: "userinfo", msg: `Used on ${user.tag} (${user.id})` }, { channel, guild, user: interaction.user });
}
