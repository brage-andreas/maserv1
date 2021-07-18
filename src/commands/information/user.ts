import { ApplicationCommandData, CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log, parseDate } from "../../resources/automaton.js";
import { USER_STATUS } from "../../constants.js";
import { getNick } from "../../resources/psql/nicks/nicks.js";

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

export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild } = interaction;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	const getMember = async (raw: string | undefined) => {
		let member = interaction.member as GuildMember | null;

		if (raw) {
			let fetchedMember = await guild?.members.fetch({ user: raw as `${bigint}`, withPresences: true });

			if (!fetchedMember) return member;
			else return fetchedMember;
		} else return member;
	};

	const member = await getMember(args.get("user") as string | undefined);
	const user = member?.user;

	if (!member || !member.presence || !user || !guild)
		return interaction.editReply({ content: "Hmm. Something went wrong" });

	const roles = member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.toString());
	const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
	const status = USER_STATUS[member.presence.status] || "⬛ Offline";
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
	if (nicks && nicks?.length > 1) infoEmbed.addField("Names", `"${nicks.reverse().slice(1, 6).join('"\n"')}"`);
	if (guild.ownerId === user.id) infoEmbed.setDescription(`👑 Server owner`);

	interaction.editReply({ embeds: [infoEmbed] });

	log.cmd({ cmd: "userinfo", msg: `Used on ${user.tag} (${user.id})` }, { channel, guild, user: interaction.user });
}
