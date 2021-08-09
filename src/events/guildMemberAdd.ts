import { GuildMember, MessageEmbed } from "discord.js";
import { getDefaultChannel, parseDate } from "../util/automaton.js";
import { JOIN_PHRASES } from "../constants.js";
import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, member: GuildMember) {
	const { guild, user } = member;
	const me = guild.me;

	const logMsg = `${user.tag} (${user.id}) joined ${guild.name}`;
	client.log(guild, "guildMemberAdd", logMsg);

	if (!me) return;

	const channel = await getDefaultChannel({ optGuild: guild, me, type: "member_log" });
	if (!channel) return;

	const randomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];
	const msg = randomElement(JOIN_PHRASES).replace("¤", member.displayName);

	const created = parseDate(user.createdTimestamp);
	const joined = parseDate(member.joinedTimestamp);

	const joinEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.displayAvatarURL())
		.setColor(`#${client.colours.green}`)
		.setTitle(msg)
		.addField("Member", member.toString())
		.setFooter("User joined")
		.setTimestamp();

	if (created) joinEmbed.addField("Account created", created);
	if (joined) joinEmbed.addField("Member joined", joined);

	channel.send({ embeds: [joinEmbed] });
}
