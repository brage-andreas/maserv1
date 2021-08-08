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

import { YELLOW, GREEN, RED, BLACK, WHITE, BLURPLE, INVIS, ORANGE } from "../constants.js";
import { CommandManager } from "../util/CommandManager.js";
import { EventManager } from "../util/EventManager.js";

class DaClient extends Client {
	commands = new CommandManager();
	events = new EventManager(this);

	colours = {
		blurple: BLURPLE,
		orange: ORANGE,
		yellow: YELLOW,
		black: BLACK,
		green: GREEN,
		invis: INVIS,
		white: WHITE,
		red: RED
	};

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
