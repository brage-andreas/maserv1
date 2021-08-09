import chalk from "chalk";

import { getTime } from "../util/automaton.js";
import { DaClient } from "../resources/definitions.js";
import { FGREEN, FYELLOW } from "../constants.js";

export async function run(client: DaClient) {
	const timeStr = getTime();
	const channels = client.channels.cache.size;
	const guilds = client.guilds.cache.size;
	const tag = client.user?.tag;
	const id = client.user?.id;

	const started = chalk`  ${timeStr} {grey =>} {${FGREEN} Started}\n`;
	const identity = client.user ? chalk`  {grey Alias} {${FYELLOW} ${tag}} {grey (${id})}` : null;
	const counts = chalk`  {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`;

	console.log(started);
	if (identity) console.log(identity);
	console.log(counts);

	console.log("\n");
}
