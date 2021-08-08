import { ApplicationCommand } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { log } from "../util/automaton.js";

export async function run(client: DaClient, command: ApplicationCommand) {
	const { name, description, guild } = command;
	log.event({ msg: `New command "${name}" with description: "${description}"`, guild });
}
