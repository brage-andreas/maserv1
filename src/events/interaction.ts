import { Collection, Interaction } from "discord.js";
import { DaClient, Args } from "../resources/definitions.js";

export async function run(client: DaClient, interaction: Interaction) {
	if (interaction.isCommand()) {
		if (interaction.channel.type === "dm") return;
		const { commandName } = interaction;

		const args: Args = new Collection();
		interaction.options.each((option) => args.set(option.name, option.value));

		const cmd = client.commands.get(commandName);
		if (cmd) cmd.run(client, interaction, args);
	}
}
