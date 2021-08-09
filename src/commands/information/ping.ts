import { ApplicationCommandData, Message } from "discord.js";

import { CmdInteraction, DaClient } from "../../resources/definitions.js";

export const data: ApplicationCommandData = {
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

export async function run(client: DaClient, interaction: CmdInteraction) {
	interaction.reply("...");

	const reply = (await interaction.fetchReply()) as Message;
	if (!reply) return interaction.editReply("Something went wrong");

	const extended = interaction.options.getBoolean("extended");

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

	interaction.util.log();
}
