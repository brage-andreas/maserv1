export const TOKEN_REGEX = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/;

export const YELLOW = "#FFC152";
export const GREEN = "#5AD658";
export const RED = "#FF5733";
export const FYELLOW = 'hex("FFC152")';
export const FGREEN = 'hex("5AD658")';
export const FRED = 'hex("FF5733")';

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
	INTEGER: "tall",
	BOOLEAN: "sant/usant",
	USER: "bruker (@/ID)",
	CHANNEL: "kanal (@/ID)",
	ROLE: "rolle (@/ID)",
	MENTIONABLE: "@/ID"
};
