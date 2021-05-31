//import "module-alias/register.js";
import { readdirSync } from "fs";
import { Client, Collection } from "discord.js";
import { default as opt } from "./settings.js"

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.commands = new Collection();

const getJSFiles = (dir) => {
    const allFilesInDir = readdirSync(dir);
    const jsFiles = allFilesInDir.filter(filename => filename.endsWith(".js"));
    return jsFiles;
}

const commandFiles = getJSFiles("./commands");
for (const file of commandFiles) {
    const cmdFile = await import(`./commands/${file}`);
    client.commands.set(cmdFile.default.name, cmdFile);
}

client.on("ready", () => {
    console.log("READY");
});

client.on("message", async (msg) => {
    const { content, author, guild } = msg;
    const botOwner = (query) => content.toLowerCase() === query && author.id === client.application?.owner.id;

    if (!client.application?.owner) await client.application?.fetch();

	if (botOwner("?deploy")) {
		const data = client.commands.map(cmd => cmd.default);
		await guild.commands.set(data);
    }

    if (botOwner("?clear")) {
        await guild.commands.set([]);
    }
});

client.on("interaction", async (interaction) => {
    if (!interaction.isCommand()) return;
    const { options, commandName } = interaction;

    const getArgs = () => {
        const argsCollection = new Collection();

        options.forEach(option => {
            argsCollection.set(option.name, option.value);
        });

        return argsCollection;
    };

    const args = getArgs();

    const cmd = client.commands.get(commandName);
    if (cmd) cmd.run(interaction, args);
});


client.login(opt.token);