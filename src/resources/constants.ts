import { ApplicationCommandOptionChoice } from "discord.js";

export const CODEBLOCK_REGEX = /```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/;
export const INVITE_REGEX = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|(?:app)?\.com\/invite)\/(\S+)/;
export const TOKEN_REGEX = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/;
export const ID_REGEX = /^(\d{17,19})$/;

export const BLURPLE = "5865F2";
export const YELLOW = "FFC152";
export const BLACK = "000000";
export const GREEN = "5AD658";
export const WHITE = "FFFFFF";
export const RED = "FF5733";

export const FYELLOW = 'hex("FFC152")';
export const FGREEN = 'hex("5AD658")';
export const FRED = 'hex("FF5733")';

export const JOIN_PHRASES = [
	"Hiii, ¤!",
	"Hello, ¤!",
	"Much welcome, ¤!",
	"What's up, ¤?",
	"Good morning, ¤!",
	"Nice to see you, ¤!"
];
export const LEAVE_PHRASES = [
	"Bye bye, ¤!",
	"Hope too see you soon, ¤!",
	"See you later, ¤!",
	"Farewell, ¤!",
	"Until next time, ¤!",
	"Adiós, ¤!"
];

export const PLATFORMS: { [index: string]: string } = {
	aix: "AIX",
	darwin: "Darwin",
	freebsd: "FreeBSD",
	linux: "Linux",
	openbsd: "OpenBSD",
	sunos: "SunOS",
	win32: "Windows",
	android: "Android"
};

export const CMD_TYPES: { [index: string]: string } = {
	STRING: "string",
	INTEGER: "number",
	BOOLEAN: "true/false",
	USER: "user (@/ID)",
	CHANNEL: "channel (@/ID)",
	ROLE: "role (@/ID)",
	MENTIONABLE: "@/ID"
};

export const USER_STATUS: { [index: string]: string } = {
	offline: "⬛ Offline",
	online: "🟩 Online",
	idle: "🟨 Idle",
	dnd: "🟥 Do Not Disturb"
};

export const CATEGORIES: { [index: string]: string } = {
	information: "Info",
	moderation: "Mod",
	config: "Config",
	util: "Util",
	help: "Help"
};

export const CONFIG_OPTION_CHOICES: ApplicationCommandOptionChoice[] = [
	{
		name: "mute role",
		value: "mute_role"
	},
	{
		name: "default channel",
		value: "default_channel"
	},
	{
		name: "action log channel",
		value: "log_channel"
	}
];

export const CONFIG_METHOD_CHOICES: ApplicationCommandOptionChoice[] = [
	{
		name: "set",
		value: "set"
	},
	{
		name: "view",
		value: "view"
	},
	{
		name: "remove",
		value: "remove"
	}
];
