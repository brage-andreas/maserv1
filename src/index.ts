import dotenv from "dotenv";
import chalk from "chalk";
import { Collection } from "discord.js";
import { readdirSync } from "fs";

import { Command, DaClient } from "./resources/definitions.js";
import { INTENTS_BITFIELD } from "./constants.js";

dotenv.config();
process.stdout.write("\x1Bc\n"); // clears terminal, console.clear() doesn't fully clear it

const client = new DaClient({
	intents: INTENTS_BITFIELD,
	allowedMentions: { repliedUser: false }
});

const getJSFiles = (dir: string, subfolder = false): Collection<string, string[]> | string[] => {
	const allItemsInDir: string[] = readdirSync(new URL(`./${dir}`, import.meta.url));

	if (!subfolder) {
		const jsFilesInFolder = allItemsInDir.filter((filename: string) => filename.endsWith(".js"));
		return jsFilesInFolder;
	} else {
		const filesToReturn: Collection<string, string[]> = new Collection();

		allItemsInDir.forEach((folder) => {
			const allFilesInDir = readdirSync(new URL(`./${dir}/${folder}`, import.meta.url));
			const jsFilesInFolder = allFilesInDir.filter((filename: string) => filename.endsWith(".js"));

			filesToReturn.set(folder, jsFilesInFolder);
		});

		return filesToReturn;
	}
};

const commandFiles = getJSFiles("./commands", true) as Collection<string, string[]>;
const commandAmount = commandFiles.array().reduce((acc, current) => acc + current.length, 0);
console.log(chalk`  {grey Loading} ${commandAmount} {grey commands...}`);

commandFiles.forEach(async (filesInFolder: string[], folder: string) => {
	filesInFolder.forEach(async (file: string) => {
		const cmdFile: Command = await import(new URL(`./commands/${folder}/${file}`, import.meta.url).toString());

		client.commands.set(cmdFile.data.name, {
			...cmdFile,
			category: folder
		});
	});
});

const eventFiles = getJSFiles("./events") as string[];
console.log(chalk`  {grey Loading} ${eventFiles.length} {grey events...}\n`);

eventFiles.forEach(async (fullFileName: string) => {
	const file = await import(new URL(`./events/${fullFileName}`, import.meta.url).toString());
	const fileName = fullFileName.split(".")[0];

	if (!fileName) return;

	if (file) client.on(fileName, (...args: unknown[]) => file.run(client, ...args));
});

void client.login(process.env.TOKEN);
