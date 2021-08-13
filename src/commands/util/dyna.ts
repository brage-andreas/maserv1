import type { CmdInteraction, DaClient } from "../../resources/definitions.js";
import { Logger } from "../../util/Logger.js";

export const data = {
	name: "dyna",
	description: "This interaction will fail"
};

export async function run(client: DaClient, interaction: CmdInteraction) {
	// Logger.parse()
}
