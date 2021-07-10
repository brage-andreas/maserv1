import { YELLOW, GREEN, RED, BLACK, WHITE, BLURPLE } from "./constants.js";
import {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	Client,
	Collection,
	CommandInteraction
} from "discord.js";

class DaClient extends Client {
	commands = new Collection<string, Command>();
	colours = { yellow: YELLOW, green: GREEN, red: RED, black: BLACK, white: WHITE, blurple: BLURPLE };

	get moji() {
		const emojis = new Collection<string, string>();

		this.emojis.cache.forEach((em) => {
			if (!em.name) return;
			emojis.set(em.name, em.toString());
		});

		return emojis;
	}

	mojis(...mojis: string[]) {
		return mojis.map((emoji) => {
			const em = this.emojis.cache.find((em) => em.name === emoji);
			if (em) return em.toString();
		});
	}
}

interface Command {
	name: string;
	description: string;
	options?: ApplicationCommandOptionData[];
	data: ApplicationCommandData;
	category: string;
	run(client: DaClient, interaction: CommandInteraction, args: Args): void;
}

type Args = Collection<string, string | number | boolean | undefined>;

export { DaClient, Command, Args };
