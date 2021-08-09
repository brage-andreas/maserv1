import chalk from "chalk";
import type { Guild } from "discord.js";

import { FGREEN, FRED, FYELLOW } from "../constants.js";
import { CmdInteraction } from "../resources/definitions.js";
import { getTime } from "./automaton.js";

type sn = string | null;

interface LoggerCache {
	channel: sn;
	guildId: sn;
	userId: sn;
	guild: sn;
	user: sn;
}

let cache: LoggerCache = {
	channel: null,
	guildId: null,
	userId: null,
	guild: null,
	user: null
};

class Logger {
	// public to use in child classes
	public _channel: sn;
	public _guildId: sn;
	public _userId: sn;
	public _guild: sn;
	public _user: sn;

	constructor() {
		this._channel = null;
		this._guildId = null;
		this._userId = null;
		this._guild = null;
		this._user = null;
	}

	public parse(string: string) {
		return string.replace(/[\r\n]/g, "\n  ");
	}

	public trace(checkGuild = false) {
		if (checkGuild) {
			if (this._sameGuild) return false;
		} else {
			if (this._sameUser) return false;
		}

		const ch = this._channel;
		const gi = this._guildId;
		const id = this._userId;
		const g = this._guild;
		const u = this._user;

		const uStr = chalk`\n  {${FYELLOW} ${u}} {grey (${id})}`;
		const cStr = chalk` {grey in} #${ch}`;
		const gStr = chalk` {grey in} ${g} {grey (${gi})}`;

		process.stdout.write(uStr);
		process.stdout.write(cStr);
		process.stdout.write(gStr);
		process.stdout.write("\n");

		return true;
	}

	public _update(newCache: LoggerCache) {
		cache = newCache;
	}

	private get _sameUser() {
		const ch = this._channel ? this._channel === cache.channel : false;
		const gi = this._guildId ? this._guildId === cache.guildId : false;
		const ui = this._userId ? this._userId === cache.userId : false;
		const g = this._guild ? this._guild === cache.guild : false;
		const u = this._user ? this._user === cache.user : false;

		return ch && gi && ui && g && u;
	}

	private get _sameGuild() {
		const gi = this._guildId ? this._guildId === cache.guildId : false;
		const g = this._guild ? this._guild === cache.guild : false;

		return gi && g;
	}
}

export class CommandLogger extends Logger {
	private name: string;

	constructor(interaction: CmdInteraction) {
		super();

		this._channel = interaction.channel.name;
		this._guildId = interaction.guild.id;
		this._userId = interaction.user.id;
		this._guild = interaction.guild.name;
		this._user = interaction.user.tag;

		this.name = interaction.commandName.toUpperCase();
	}

	public log(message?: string, err = false) {
		this.trace();

		const time = chalk`  {grey ${getTime()}}`;
		const cmd = chalk` {${err ? FRED : FGREEN} ${this.name}}`;
		const msg = message ? chalk` {grey >} ${this.parse(message)}` : null;

		process.stdout.write(time);
		process.stdout.write(cmd);
		if (msg) process.stdout.write(msg);
		process.stdout.write("\n");

		const newCache: LoggerCache = {
			channel: this._channel,
			guildId: this._guildId,
			userId: this._userId,
			guild: this._guild,
			user: this._user
		};

		this._update(newCache);
	}
}

export class EventLogger extends Logger {
	constructor() {
		super();

		this._channel = null;
		this._guildId = null;
		this._userId = null;
		this._guild = null;
		this._user = null;
	}

	public log(guild: Guild, event: string, message?: string) {
		this._guildId = guild.id;
		this._guild = guild.name;

		this.trace(true);

		const time = chalk`  {grey ${getTime()}}`;
		const evn = chalk` {${FYELLOW} ${event}}`;
		const msg = message ? chalk` {grey >} ${this.parse(message)}` : null;

		process.stdout.write(time);
		process.stdout.write(evn);
		if (msg) process.stdout.write(msg);
		process.stdout.write("\n");

		const newCache: LoggerCache = {
			channel: null,
			guildId: guild.id,
			userId: null,
			guild: guild.name,
			user: null
		};

		this._update(newCache);
	}
}

export class InfoLogger extends Logger {
	constructor() {
		super();

		this._channel = null;
		this._guildId = null;
		this._userId = null;
		this._guild = null;
		this._user = null;
	}

	public log(event: string, message?: string, parse = true) {
		const time = chalk`  {grey ${getTime()}}`;
		const evn = chalk` {${FRED} ${event}}`;
		const msg = message ? chalk` {grey >} ${parse ? this.parse(message) : message}` : null;

		process.stdout.write(time);
		process.stdout.write(evn);
		if (msg) process.stdout.write(msg);
		process.stdout.write("\n");

		const newCache: LoggerCache = {
			channel: null,
			guildId: null,
			userId: null,
			guild: null,
			user: null
		};

		this._update(newCache);
	}
}
