import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import chalk from "chalk";

import opt from "./resources/settings.js";

process.stdout.write("\x1Bc\n"); // clears terminal, console.clear() doesn't fully clear it



const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.commands = new Collection();

const getJSFiles = (dir) => {
    const allFilesInDir = readdirSync(dir);
    const jsFiles = allFilesInDir.filter(filename => filename.endsWith(".js"));
    return jsFiles;
}



const commandFiles = getJSFiles("./commands");
console.log(chalk `  {grey │ Loading} ${commandFiles.length} {grey commands...}`)

commandFiles.forEach(async file => {
    const cmdFile = await import(`./commands/${file}`);
    client.commands.set(cmdFile.default.name, cmdFile);
});



const eventFiles = getJSFiles("./events");
console.log(chalk `  {grey │ Loading} ${commandFiles.length} {grey events...}\n`)

eventFiles.forEach(async file => {
    const eventFile = await import(`./events/${file}`);
    const eventFileName = file.split(".")[0];
    if (eventFile) client.on(eventFileName, (...args) => eventFile.run(client, ...args))
});



client.login(opt.token);