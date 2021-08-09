import { ApplicationCommand } from "discord.js";

import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, command: ApplicationCommand) {
	const { name, description, guild } = command;
	if (!guild) return;

	const msg = `New command "${name}" with description: "${description}"`;
	client.util.log(guild, "applicationCommandCreate", msg);
}
