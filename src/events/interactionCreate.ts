import { Interaction } from "discord.js";
import { CmdInteraction, DaClient } from "../resources/definitions.js";
import { CommandLogger } from "../util/Logger.js";

export async function run(client: DaClient, intr: Interaction) {
	if (intr.isCommand()) {
		if (!intr.channel || intr.channel.type !== "GUILD_TEXT") {
			intr.reply({ content: "Try this in a guild text channel!", ephemeral: true });
			return;
		}

		if (intr.user.id !== "196333104183508992") return intr.reply({ content: "rip", ephemeral: true });
		const interaction = intr as CmdInteraction;
		interaction.util = new CommandLogger(interaction);

		void client.commands.get(interaction.commandName)?.run(interaction);
	}
}
