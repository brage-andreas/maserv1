import { RateLimitData } from "discord.js";

import { DaClient } from "../resources/definitions.js";
import { InfoLogger } from "../util/Logger.js";

export async function run(client: DaClient, limitObject: RateLimitData) {
	const msg = [
		`  AVOIDING RATE LIMIT:`,
		`      | Timeout: ${limitObject.timeout} ms`,
		`      |   Limit: ${limitObject.limit}`,
		`      |  Method: ${limitObject.method}`,
		`      |    Path: ${limitObject.path}`,
		`      |   Route: ${limitObject.route}`,
		`      |  Global: ${limitObject.global.toString().toUpperCase()}`
	].join("\n");

	const lgr = new InfoLogger();
	log("rateLimit", msg, false);
}
