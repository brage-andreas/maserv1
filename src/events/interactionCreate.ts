import { Interaction } from "discord.js";
import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, itr: Interaction) {
	if (itr.isCommand()) {
		if (!itr.channel || itr.channel.type !== "GUILD_TEXT") {
			itr.reply({ content: "Try this in a guild text channel!", ephemeral: true });
			return;
		}

		void client.commands.get(itr.commandName)?.run(client, itr);
	}
}
