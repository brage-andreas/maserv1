import { ApplicationCommand } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { log } from "../resources/automaton.js";

export async function run(client: DaClient, command: ApplicationCommand) {
	const { name, description, guild } = command;
	log.event({ msg: `{grey New command} ${name} {grey with description: "${description}"}`, guild });
}
