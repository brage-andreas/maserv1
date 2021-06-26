import chalk from "chalk";
import { ApplicationCommand } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { botLog } from "../resources/automaton.js";

export async function run(client: DaClient, command: ApplicationCommand) {
	const { name, description, guild } = command;
	botLog(chalk`{grey New command} ${name} {grey with description: "${description}"}`, { guildName: guild?.name });
}
