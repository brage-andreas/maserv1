import { Collection } from "discord.js";

import type { Command } from "../resources/definitions";
import { getCommandFiles } from "./getJSFiles.js";

export default class CommandManager {
	private _commands: Collection<string, Command>;

	constructor() {
		this._commands = new Collection();
	}

	public async init() {
		this._commands = await getCommandFiles("./commands/");
	}

	public get(command: string) {
		return this._commands.get(command) ?? null;
	}

	public withCategory(category: string) {
		return this._commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.data.name}\``);
	}

	get data() {
		return this._commands.map((cmd) => cmd.data);
	}

	get categories() {
		return new Set(this._commands.map((cmd) => cmd.category).sort());
	}
}
