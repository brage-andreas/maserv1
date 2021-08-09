import type { RateLimitData } from "discord.js";

import type { DaClient } from "../resources/definitions.js";
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

	const logger = new InfoLogger();
	logger.log("rateLimit", msg, false);
}
