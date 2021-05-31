import { Collection } from "discord.js";

export async function run(client, interaction) {
    if (interaction.isCommand()) {
        const { options, commandName } = interaction;
    
        const args = new Collection();
        options.forEach(option => {
            args.set(option.name, option.value);
        });
    
        const cmd = client.commands.get(commandName);
        if (cmd) cmd.run(interaction, args);
    } else

    if (interaction) return;
}