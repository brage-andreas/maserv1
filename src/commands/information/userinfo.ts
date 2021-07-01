import { ApplicationCommandData, CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log, parseDate } from "../../resources/automaton.js";
import { USER_STATUS } from "../../resources/constants.js";
import { getNick } from "../../resources/psql/nicks/nicks.js";

const data: ApplicationCommandData = {
	name: "userinfo",
	description: "Sender en haug med ræl om inn fyr",
	options: [
		{
			name: "user",
			type: "USER",
			description: "Hvem å sende ræl om"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { guild } = interaction;
	const channel = interaction.channel as TextChannel;

	await interaction.defer();

	const memberID = args.get("user") as `${bigint}` | undefined;
	const member = memberID
		? (await guild?.members.fetch({ user: memberID, withPresences: true })) ||
		  (interaction.member as GuildMember | null)
		: (interaction.member as GuildMember | null);
	const user = member?.user;

	if (!member || !user || !guild) return interaction.editReply({ content: "Hmm. Noe gikk galt." });

	const roles = member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.toString());
	const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
	const status = USER_STATUS[member.presence.status] || "⬛ Offline";
	const came = parseDate(member.joinedTimestamp);
	const made = parseDate(user.createdTimestamp);

	const nicks = await getNick(user.id, guild.id);

	const infoEmbed = new MessageEmbed()
		.setColor(["#000000", "#ffffff"].includes(member.displayHexColor) ? "RANDOM" : member.displayHexColor)
		.setThumbnail(avatar)
		.setTitle(member.displayName)
		.addField("Brukernavn", `${user.tag}`, true)
		.addField("Avatar", `[Link](${avatar})`, true)
		.addField("ID", `\`${user.id}\``);

	if (made) infoEmbed.addField("Bruker laget", made, true);
	if (came) infoEmbed.addField(`Kom til ${guild.name}`, came, true);

	infoEmbed.addField("Status", `${status}`).setTimestamp();

	if (roles.length) infoEmbed.addField("Roller", roles.join(", "));
	if (nicks?.length) infoEmbed.addField("Navn", `"${nicks.reverse().join('"\n"')}"`);
	if (guild.ownerID === user.id) infoEmbed.setDescription(`👑 Eieren av serveren`);

	interaction.editReply({ embeds: [infoEmbed] });

	log.cmd({ cmd: "userinfo", msg: `Used on ${user.tag} (${user.id})` }, { channel, guild, user: interaction.user });
}
