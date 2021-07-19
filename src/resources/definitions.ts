import { YELLOW, GREEN, RED, BLACK, WHITE, BLURPLE } from "../constants.js";
import {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	Client,
	Collection,
	CommandInteraction,
	Guild,
	GuildMember,
	TextChannel
} from "discord.js";

class DaClient extends Client {
	commands = new Collection<string, Command>();
	colours = { yellow: YELLOW, green: GREEN, red: RED, black: BLACK, white: WHITE, blurple: BLURPLE };

	get moji(): Collection<string, string> {
		const emojis = new Collection<string, string>();

		this.emojis.cache.forEach((emoji) => {
			if (!emoji.name) return;
			emojis.set(emoji.name, emoji.toString());
		});

		return emojis;
	}

	mojis(...mojis: string[]): (string | undefined)[] {
		return mojis.map((emoji) => {
			const emojiStr = this.emojis.cache.find((em) => em.name === emoji)?.toString();
			if (emojiStr) return emojiStr;
		});
	}
}

interface Command {
	name: string;
	description: string;
	options?: ApplicationCommandOptionData[];
	data: ApplicationCommandData;
	category: string;
	run(client: DaClient, interaction: CommandInteraction): void;
}

interface CmdInteraction extends CommandInteraction {
	member: GuildMember;
	channel: TextChannel;
	guild: Guild;
}

export { DaClient, Command, CmdInteraction };
