import { Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import type { Command } from "../resources/definitions";
import { getCommandFiles } from "./getJSFiles.js";
import { InfoLogger, Logger } from "./Logger.js";
import { ID_REGEX } from "../constants.js";

const logger = new InfoLogger();

export default class CommandManager {
	private _commands: Collection<string, Command>;

	constructor() {
		this._commands = new Collection();
	}

	public async init() {
		this._commands = await getCommandFiles();
	}

	public get(command: string) {
		return this._commands.get(command) ?? null;
	}

	public withCategory(category: string) {
		return this._commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.data.name}\``);
	}

	public data() {
		return this._commands.map((cmd) => cmd.data);
	}

	get categories() {
		return new Set(this._commands.map((cmd) => cmd.category).sort());
	}

	public async post(clientId: string, guildId: string) {
		const data = this.data();
		await this._set(clientId, guildId, data);
	}

	public async clear(clientId: string, guildId: string) {
		const data: any = [];
		await this._set(clientId, guildId, data);
	}

	private async _set(clientId: string, guildId: string, data: any) {
		if (!process.env.TOKEN) {
			return console.error(Logger.parse("Token not defined in .env file"));
		}

		if (!ID_REGEX.test(clientId)) {
			return console.error(Logger.parse(`Client id is faulty: ${clientId}`));
		}

		if (!ID_REGEX.test(guildId)) {
			return console.error(Logger.parse(`Guild id is faulty: ${clientId}`));
		}

		const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
		try {
			const res = await rest
				.put(Routes.applicationGuildCommands(clientId as `${bigint}`, guildId as `${bigint}`), {
					body: data
				})
				.then(() => `Set commands in guild: ${guildId}`)
				.catch((err) => err.stack ?? err.toString());

			logger.log("CommandManager", res);
		} catch (e) {
			console.error(Logger.parse(e.stack ?? e.toString()));
		}
	}
}

/*
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
*/
