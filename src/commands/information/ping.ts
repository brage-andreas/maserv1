import { ApplicationCommandData, CommandInteraction, Message, TextChannel } from "discord.js";

import { Args, DaClient } from "../../resources/definitions.js";
import { log } from "../../resources/automaton.js";

const data: ApplicationCommandData = {
	name: "ping",
	description: "Sends ping",
	options: [
		{
			name: "extended",
			type: "BOOLEAN",
			description: "Sends more information"
		}
	]
};

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Args) {
	const { channel, guild, user } = interaction;
	interaction.reply("...");

	const reply = (await interaction.fetchReply()) as Message;
	if (!reply) return interaction.editReply("Something went wrong");

	const extended = args.get("extended");

	const heartbeat = client.ws.ping;
	const absPing = reply.createdTimestamp - interaction.createdTimestamp;
	const ping = absPing - heartbeat < 0 ? absPing - heartbeat * -1 : absPing - heartbeat;

	if (extended) {
		interaction.editReply(`Ping/absolute: \`${ping}/${absPing} ms\`\nWS heartbeat: \`${heartbeat} ms\``);
	} else {
		const [str1, str2, str3] = client.mojis("strength1", "strength2", "strength3");
		const emoji = ping > 300 ? str1 : ping > 75 ? str2 : str3;

		interaction.editReply(`Ping: ${emoji} ${ping} ms`);
	}

	log.cmd({ cmd: "ping" }, { channel: channel as TextChannel, guild, user });
}
