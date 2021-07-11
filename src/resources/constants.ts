import { ApplicationCommandOptionChoice } from "discord.js";

export const INVITE_REGEX = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|(?:app)?\.com\/invite)\/(\S+)/;
export const CODEBLOCK_REGEX = /```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/;
export const TOKEN_REGEX = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/;

export const CHANNEL_REGEX = /^(<#(\d{17,19})>)$/;
export const USER_REGEX = /^(<@!?(\d{17,19})>)$/;
export const ROLE_REGEX = /^(<@&(\d{17,19})>)$/;
export const ID_REGEX = /^(\d{17,19})$/;

export const BLURPLE = "5865F2";
export const YELLOW = "FFC152";
export const BLACK = "000000";
export const GREEN = "5AD658";
export const WHITE = "FFFFFF";
export const RED = "FF5733";

export const FYELLOW = `hex("${YELLOW}")`;
export const FGREEN = `hex("${GREEN}")`;
export const FRED = `hex("${RED}")`;

export const JOIN_PHRASES = [
	"Nice to see you, ¤!",
	"Much welcome, ¤!",
	"Good morning, ¤!",
	"What's up, ¤?",
	"Hello, ¤!",
	"Hiii, ¤!"
];
export const LEAVE_PHRASES = [
	"Hope too see you soon, ¤!",
	"Until next time, ¤!",
	"See you later, ¤!",
	"Farewell, ¤!",
	"Bye bye, ¤!",
	"Adiós, ¤!"
];

export const PLATFORMS: { [index: string]: string } = {
	freebsd: "FreeBSD",
	android: "Android",
	openbsd: "OpenBSD",
	darwin: "Darwin",
	win32: "Windows",
	linux: "Linux",
	sunos: "SunOS",
	aix: "AIX"
};

export const CMD_TYPES: { [index: string]: string } = {
	CHANNEL: "channel (@/ID)",
	BOOLEAN: "true/false",
	MENTIONABLE: "@/ID",
	USER: "user (@/ID)",
	ROLE: "role (@/ID)",
	INTEGER: "number",
	STRING: "string"
};

export const USER_STATUS: { [index: string]: string } = {
	dnd: "🟥 Do Not Disturb",
	offline: "⬛ Offline",
	online: "🟩 Online",
	idle: "🟨 Idle"
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
		name: "Mute Role",
		value: "mute_role"
	},
	{
		name: "Member Log Channel",
		value: "member_log_channel"
	},
	{
		name: "Action Log Channel",
		value: "log_channel"
	}
];

export const CONFIG_OPTION_INFO: { [index: string]: { type: string; reg: RegExp } } = {
	mute_role: { type: "ROLE", reg: ROLE_REGEX },
	member_log_channel: { type: "CHANNEL", reg: CHANNEL_REGEX },
	log_channel: { type: "CHANNEL", reg: CHANNEL_REGEX }
};

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
