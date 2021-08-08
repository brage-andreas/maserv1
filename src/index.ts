import dotenv from "dotenv";

import { DaClient } from "./resources/definitions.js";
import { INTENTS_BITFIELD } from "./constants.js";

dotenv.config();
process.stdout.write("\x1Bc\n"); // clears terminal, console.clear() doesn't fully clear it

process.on("uncaughtException", (err) => {
	const errStr = err.toString().replace(/[\r\n]/g, "\n  ");
	console.error(`  There was an uncaught error:\n${errStr}`);
});

const daclient = new DaClient({
	intents: INTENTS_BITFIELD,
	allowedMentions: { repliedUser: false }
});

await daclient.commands.init();
await daclient.events.init();

void daclient.login(process.env.TOKEN);
