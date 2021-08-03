import { Interaction } from "discord.js";
import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, interaction: Interaction) {
	if (interaction.isCommand()) {
		if (!interaction.channel || interaction.channel.type !== "GUILD_TEXT") {
			interaction.reply({ content: "Try this in a guild text channel!", ephemeral: true });
			return;
		}

		void client.commands.get(interaction.commandName)?.run(client, interaction);
	}
}
