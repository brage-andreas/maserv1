import { RateLimitData } from "discord.js";

import { DaClient } from "../resources/definitions.js";

export async function run(client: DaClient, limitObject: RateLimitData) {
	console.log(
		[
			`\n\n`,
			`  <AVOIDING RATE LIMIT>:`,
			`      Timeout: ${limitObject.timeout} ms`,
			`      ..Limit: ${limitObject.limit}`,
			`      .Method: ${limitObject.method}`,
			`      ...Path: ${limitObject.path}`,
			`      ..Route: ${limitObject.route}`,
			`      .Global: ${limitObject.global.toString().toUpperCase()}`,
			`\n\n`
		].join("\n")
	);
}
