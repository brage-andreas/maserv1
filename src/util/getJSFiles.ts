import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command, DaClient } from "../resources/definitions";

const getFolders = (files: string[]) => files.filter((f) => !f.endsWith(".js"));
const getFiles = (files: string[]) => files.filter((f) => f.endsWith(".js"));

export const getCommandFiles = async (dir = "commands"): Promise<Collection<string, Command>> => {
	const allItemsInDir = readdirSync(new URL(`../${dir}`, import.meta.url));
	const folders = getFolders(allItemsInDir);

	const filesToReturn: Collection<string, Command> = new Collection();

	for (let folder of folders) {
		const allItemsInDir = readdirSync(new URL(`../${dir}/${folder}`, import.meta.url));
		const files = getFiles(allItemsInDir);

		const jsFilesInFolder = files.filter((filename: string) => filename.endsWith(".js"));
		for (let file of jsFilesInFolder) {
			const that = await import(`../${dir}/${folder}/${file}`);
			const name = file.split(".")[0];
			filesToReturn.set(name, {
				...that,
				category: folder
			});
		}
	}

	return filesToReturn;
};

export const getEventFiles = async (dir = "events") => {
	const allItemsInDir = readdirSync(new URL(`../${dir}`, import.meta.url));
	const files = getFiles(allItemsInDir);

	const filesToReturn: Map<string, { run(client: DaClient, ...args: unknown[]): Promise<void> }> = new Map();

	const jsFilesInFolder = files.filter((filename: string) => filename.endsWith(".js"));
	for (let file of jsFilesInFolder) {
		const that = await import(`../${dir}/${file}`);
		const name = file.split(".")[0];

		filesToReturn.set(name, {
			...that
		});
	}

	return filesToReturn;
};
