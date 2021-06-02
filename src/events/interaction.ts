import { Collection, Interaction } from "discord.js";
import { DaClient, CommandInterface } from "../resources/definitions.js"

export async function run(client: DaClient, interaction: Interaction) {
    if (interaction.isCommand()) {
        const { options, commandName } = interaction;
    
        const args: Collection<string, (string | number | boolean | undefined)> = new Collection();
        options.forEach(option => {
            args.set(option.name, option.value);
        });
    
        const cmd: (CommandInterface | undefined) = client.commands.get(commandName);
        if (cmd) cmd.run(interaction, args);
    } //else

    // if (interaction.isMessageComponent()) { }
}