import { readdirSync } from "fs";
import chalk from "chalk";

import { DaClient } from "./resources/definitions.js";
import { token } from "./resources/settings.js";

process.stdout.write("\x1Bc\n"); // clears terminal, console.clear() doesn't fully clear it

const client = new DaClient({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const getJSFiles = (dir: string) => {
    const allFilesInDir = readdirSync(dir);
    const jsFiles = allFilesInDir.filter((filename: string) => filename.endsWith(".js"));
    return jsFiles;
}

const commandFiles = getJSFiles("./commands");
console.log(chalk `  {grey Loading} ${commandFiles.length} {grey commands...}`)

commandFiles.forEach(async (file: string) => {
    const cmdFile = await import(`./commands/${file}`);
    client.commands.set(cmdFile.default.name, cmdFile);
});



const eventFiles = getJSFiles("./events");
console.log(chalk `  {grey Loading} ${eventFiles.length} {grey events...}\n`)

eventFiles.forEach(async (file: string) => {
    const eventFile = await import(`./events/${file}`);
    const eventFileName = file.split(".")[0];
    if (eventFile) client.on(eventFileName, (...args: any) => eventFile.run(client, ...args))
});



client.login(token);